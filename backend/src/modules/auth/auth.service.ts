import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { google } from 'googleapis';
import { Brackets, Repository } from 'typeorm';
import { UserStatus } from '../../common/enums/user-status.enum.js';
import { LoginDto } from './dto/login.dto.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { UpdateAdminDto } from './dto/update-admin.dto.js';
import { Admin } from './entities/admin.entity.js';
import { AuthToken, AuthTokenPurpose } from './entities/auth-token.entity.js';
import { AuthEmailService } from './email.service.js';
import type { AuthenticatedAdmin } from './interfaces/jwt-payload.interface.js';

export interface LoginResult {
  accessToken: string;
  admin: AuthenticatedAdmin;
}
export interface AdminSummary extends AuthenticatedAdmin {
  loginName: string;
  status: UserStatus;
  createdAt: Date;
  lastLoginAt: Date | null;
}

/** bcrypt hash (cost 10) of a random string; compared against when no account matches. */
const DUMMY_PASSWORD_HASH =
  '$2b$10$w3rVhmMrCfBcNh2RkTc39.yMVwO90CYr/8u5WI/Ro5n9viCEu85eG';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Admin) private readonly admins: Repository<Admin>,
    @InjectRepository(AuthToken) private readonly tokens: Repository<AuthToken>,
    private readonly jwt: JwtService,
    private readonly email: AuthEmailService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResult> {
    const admin = await this.admins
      .createQueryBuilder('admin')
      .addSelect('admin.passwordHash')
      .where('admin.loginName = :loginName OR admin.email = :loginName', {
        loginName: dto.loginName,
      })
      .getOne();
    // Always run bcrypt so response time doesn't reveal whether the account exists.
    const passwordMatches = await bcrypt.compare(
      dto.password,
      admin?.passwordHash ?? DUMMY_PASSWORD_HASH,
    );
    if (
      !admin?.passwordHash ||
      admin.status !== UserStatus.ACTIVE ||
      !passwordMatches
    )
      throw new UnauthorizedException('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    await this.recordLogin(admin.adminId);
    return this.createLoginResult(admin);
  }

  /** Verifies a Google ID token and signs in an already-authorized administrator. */
  async loginWithGoogle(credential: string): Promise<LoginResult> {
    const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      throw new ServiceUnavailableException(
        'Google Sign-In has not been configured',
      );
    }

    let email: string | undefined;
    try {
      const ticket = await new google.auth.OAuth2().verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      if (payload?.email_verified === true)
        email = payload.email?.toLowerCase();
    } catch {
      throw new UnauthorizedException('Google credential is invalid');
    }

    if (!email)
      throw new UnauthorizedException('Google email has not been verified');

    const admin = await this.admins.findOneBy({ email });
    if (!admin || admin.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('This Google account is not authorized');
    }
    await this.recordLogin(admin.adminId);
    return this.createLoginResult(admin);
  }

  async listAdmins(): Promise<AdminSummary[]> {
    const admins = await this.admins.find({ order: { createdAt: 'DESC' } });
    return admins.map((admin) => this.toAdminSummary(admin));
  }

  async createAdmin(dto: CreateAdminDto): Promise<AdminSummary> {
    const loginName = dto.loginName.trim();
    const email = dto.email.trim().toLowerCase();
    const displayName = dto.displayName.trim();
    await this.assertUnique({ loginName, email });

    const admin = this.admins.create({
      adminId: await this.createUniqueAdminId(),
      loginName,
      displayName,
      email,
      passwordHash: await bcrypt.hash(dto.password, 10),
      status: UserStatus.ACTIVE,
    });
    return this.toAdminSummary(await this.admins.save(admin));
  }

  async updateAdmin(
    adminId: string,
    dto: UpdateAdminDto,
  ): Promise<AdminSummary> {
    const admin = await this.findAdminOrFail(adminId);
    const displayName = dto.displayName?.trim();
    const email = dto.email?.trim().toLowerCase();
    if (email && email !== admin.email) {
      await this.assertUnique({ email }, adminId);
      admin.email = email;
    }
    if (displayName) admin.displayName = displayName;
    return this.toAdminSummary(await this.admins.save(admin));
  }

  async updateAdminStatus(
    actorId: string,
    adminId: string,
    status: UserStatus.ACTIVE | UserStatus.SUSPENDED,
  ): Promise<AdminSummary> {
    const admin = await this.findAdminOrFail(adminId);
    if (admin.status === status) return this.toAdminSummary(admin);
    if (status !== UserStatus.ACTIVE) {
      if (actorId === adminId)
        throw new ForbiddenException('ไม่สามารถระงับบัญชีของตัวเองได้');
      await this.assertNotLastActive(admin);
    }
    admin.status = status;
    if (status !== UserStatus.ACTIVE) admin.authVersion += 1;
    const saved = await this.admins.save(admin);
    if (status !== UserStatus.ACTIVE) await this.revokeTokens(adminId);
    return this.toAdminSummary(saved);
  }

  async sendAdminPasswordReset(adminId: string): Promise<void> {
    const admin = await this.findAdminOrFail(adminId);
    if (admin.status !== UserStatus.ACTIVE)
      throw new BadRequestException(
        'บัญชีนี้ถูกระงับอยู่ กรุณาเปิดใช้งานก่อนส่งลิงก์',
      );
    const token = await this.createToken(
      admin.adminId,
      AuthTokenPurpose.PASSWORD_RESET,
      60 * 60 * 1000,
    );
    try {
      await this.email.sendPasswordReset(admin.email, token);
    } catch (error) {
      this.logger.error(
        `Password reset email to admin ${adminId} failed`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException(
        'ส่งอีเมลไม่สำเร็จ กรุณาตรวจสอบการตั้งค่า SMTP ของระบบ',
      );
    }
  }

  async deleteAdmin(actorId: string, adminId: string): Promise<void> {
    if (actorId === adminId)
      throw new ForbiddenException('ไม่สามารถลบบัญชีของตัวเองได้');
    const admin = await this.findAdminOrFail(adminId);
    await this.assertNotLastActive(admin);
    // Free the unique login name / email so they can be reused by a new account.
    const suffix = `~del-${admin.adminId}`;
    await this.admins.update(
      { adminId },
      {
        loginName: `${admin.loginName.slice(0, 100 - suffix.length)}${suffix}`,
        email: `${admin.email.slice(0, 100 - suffix.length)}${suffix}`,
        status: UserStatus.INACTIVE,
        authVersion: () => 'AUTH_VERSION + 1',
      },
    );
    await this.revokeTokens(adminId);
    await this.admins.softDelete({ adminId });
  }

  async validateAdminById(
    adminId: string,
    authVersion?: number,
  ): Promise<AuthenticatedAdmin | null> {
    const admin = await this.admins.findOneBy({ adminId });
    if (
      !admin ||
      admin.status !== UserStatus.ACTIVE ||
      (authVersion !== undefined && admin.authVersion !== authVersion)
    )
      return null;
    return this.toAuthenticatedAdmin(admin);
  }

  async refresh(refreshToken: string): Promise<LoginResult> {
    const stored = await this.findUsableToken(
      refreshToken,
      AuthTokenPurpose.REFRESH,
    );
    if (!stored) throw new UnauthorizedException('Session หมดอายุแล้ว');
    stored.usedAt = new Date();
    await this.tokens.save(stored);
    const admin = await this.admins.findOneBy({ adminId: stored.adminId });
    if (!admin || admin.status !== UserStatus.ACTIVE)
      throw new UnauthorizedException('บัญชีแอดมินไม่ถูกต้อง');
    return this.createLoginResult(admin);
  }

  issueRefreshToken(adminId: string): Promise<string> {
    return this.createToken(
      adminId,
      AuthTokenPurpose.REFRESH,
      7 * 24 * 60 * 60 * 1000,
    );
  }

  async logout(adminId: string): Promise<void> {
    await this.admins.increment({ adminId }, 'authVersion', 1);
    await this.revokeTokens(adminId);
  }

  /** Signs out the admin who owns a still-valid refresh token; unknown or spent tokens are ignored. */
  async logoutByRefreshToken(refreshToken: string): Promise<void> {
    const stored = await this.findUsableToken(
      refreshToken,
      AuthTokenPurpose.REFRESH,
    );
    if (stored) await this.logout(stored.adminId);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const admin = await this.admins.findOneBy({ email: email.toLowerCase() });
    if (admin?.status !== UserStatus.ACTIVE) return;
    const token = await this.createToken(
      admin.adminId,
      AuthTokenPurpose.PASSWORD_RESET,
      60 * 60 * 1000,
    );
    try {
      await this.email.sendPasswordReset(admin.email, token);
    } catch (error) {
      // Swallow so the response matches the "no such account" case and
      // doesn't reveal which emails belong to an administrator.
      this.logger.error(
        `Password reset email to admin ${admin.adminId} failed`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const stored = await this.findUsableToken(
      token,
      AuthTokenPurpose.PASSWORD_RESET,
    );
    if (!stored)
      throw new BadRequestException('ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุ');
    await this.updatePassword(stored.adminId, password);
    stored.usedAt = new Date();
    await this.tokens.save(stored);
  }

  async changePassword(
    adminId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const admin = await this.admins
      .createQueryBuilder('admin')
      .addSelect('admin.passwordHash')
      .where('admin.adminId = :adminId', { adminId })
      .getOne();
    if (
      !admin?.passwordHash ||
      !(await bcrypt.compare(currentPassword, admin.passwordHash))
    )
      // 400, not 401: the session itself is valid, and a 401 makes the
      // frontend treat it as expired and sign the admin out.
      throw new BadRequestException('รหัสผ่านปัจจุบันไม่ถูกต้อง');
    await this.updatePassword(adminId, newPassword);
  }

  private toAuthenticatedAdmin(admin: Admin): AuthenticatedAdmin {
    return {
      adminId: admin.adminId,
      email: admin.email,
      displayName: admin.displayName,
    };
  }
  private toAdminSummary(admin: Admin): AdminSummary {
    return {
      ...this.toAuthenticatedAdmin(admin),
      loginName: admin.loginName,
      status: admin.status,
      createdAt: admin.createdAt,
      lastLoginAt: admin.lastLoginAt ?? null,
    };
  }
  /** Stamps an interactive sign-in (password or Google); token refreshes don't count. */
  private async recordLogin(adminId: string): Promise<void> {
    await this.admins
      .createQueryBuilder()
      .update(Admin)
      .set({
        lastLoginAt: () => 'CURRENT_TIMESTAMP',
        updatedAt: () => 'UPDATED_AT',
      })
      .where('adminId = :adminId', { adminId })
      .execute();
  }
  private async createLoginResult(admin: Admin): Promise<LoginResult> {
    return {
      accessToken: await this.jwt.signAsync({
        sub: admin.adminId,
        ver: admin.authVersion,
      }),
      admin: this.toAuthenticatedAdmin(admin),
    };
  }
  private async updatePassword(
    adminId: string,
    password: string,
  ): Promise<void> {
    await this.admins.update(
      { adminId },
      {
        passwordHash: await bcrypt.hash(password, 10),
        authVersion: () => 'AUTH_VERSION + 1',
      },
    );
    await this.revokeTokens(adminId);
  }
  private async revokeTokens(adminId: string): Promise<void> {
    await this.tokens
      .createQueryBuilder()
      .update(AuthToken)
      .set({ usedAt: new Date() })
      .where('adminId = :adminId AND usedAt IS NULL', { adminId })
      .execute();
  }
  private async createToken(
    adminId: string,
    purpose: AuthTokenPurpose,
    ttl: number,
  ): Promise<string> {
    const token = randomBytes(48).toString('base64url');
    await this.tokens.save(
      this.tokens.create({
        adminId,
        purpose,
        tokenHash: this.hashToken(token),
        expiresAt: new Date(Date.now() + ttl),
      }),
    );
    return token;
  }
  private async findUsableToken(
    token: string,
    purpose: AuthTokenPurpose,
  ): Promise<AuthToken | null> {
    const item = await this.tokens.findOneBy({
      tokenHash: this.hashToken(token),
      purpose,
    });
    return item && !item.usedAt && item.expiresAt > new Date() ? item : null;
  }
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
  private async findAdminOrFail(adminId: string): Promise<Admin> {
    const admin = await this.admins.findOneBy({ adminId });
    if (!admin) throw new NotFoundException('ไม่พบบัญชีผู้ดูแล');
    return admin;
  }
  /** Rejects when another account (including soft-deleted ones) already uses the value. */
  private async assertUnique(
    values: { loginName?: string; email?: string },
    excludeAdminId?: string,
  ): Promise<void> {
    const query = this.admins.createQueryBuilder('admin').withDeleted();
    query.where(
      new Brackets((where) => {
        if (values.loginName)
          where.orWhere('admin.loginName = :loginName', {
            loginName: values.loginName,
          });
        if (values.email)
          where.orWhere('admin.email = :email', { email: values.email });
      }),
    );
    if (excludeAdminId)
      query.andWhere('admin.adminId <> :excludeAdminId', { excludeAdminId });
    if (await query.getExists())
      throw new ConflictException(
        values.loginName
          ? 'ชื่อผู้ใช้งานหรืออีเมลนี้ถูกใช้งานแล้ว'
          : 'อีเมลนี้ถูกใช้งานแล้ว',
      );
  }
  private async assertNotLastActive(admin: Admin): Promise<void> {
    if (admin.status !== UserStatus.ACTIVE) return;
    const activeCount = await this.admins.countBy({
      status: UserStatus.ACTIVE,
    });
    if (activeCount <= 1)
      throw new ForbiddenException(
        'ต้องมีผู้ดูแลที่ใช้งานอยู่อย่างน้อย 1 บัญชี',
      );
  }
  private async createUniqueAdminId(): Promise<string> {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (let attempt = 0; attempt < 5; attempt++) {
      const id = Array.from(
        randomBytes(8),
        (byte) => alphabet[byte % alphabet.length],
      ).join('');
      if (
        !(await this.admins.exists({
          where: { adminId: id },
          withDeleted: true,
        }))
      )
        return id;
    }
    throw new ServiceUnavailableException('Could not allocate an admin ID');
  }
}
