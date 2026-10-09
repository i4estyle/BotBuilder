import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { UserStatus } from '../../common/enums/user-status.enum.js';
import { LoginDto } from './dto/login.dto.js';
import { Admin } from './entities/admin.entity.js';
import { AuthToken, AuthTokenPurpose } from './entities/auth-token.entity.js';
import { AuthEmailService } from './email.service.js';
import type { AuthenticatedAdmin } from './interfaces/jwt-payload.interface.js';

export interface LoginResult { accessToken: string; admin: AuthenticatedAdmin; }

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin) private readonly admins: Repository<Admin>,
    @InjectRepository(AuthToken) private readonly tokens: Repository<AuthToken>,
    private readonly jwt: JwtService,
    private readonly email: AuthEmailService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResult> {
    const admin = await this.admins.createQueryBuilder('admin').addSelect('admin.passwordHash')
      .where('admin.loginName = :loginName OR admin.email = :loginName', { loginName: dto.loginName }).getOne();
    if (!admin?.passwordHash || admin.status !== UserStatus.ACTIVE || !(await bcrypt.compare(dto.password, admin.passwordHash))) throw new UnauthorizedException('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    return this.createLoginResult(admin);
  }

  async validateAdminById(adminId: string, authVersion?: number): Promise<AuthenticatedAdmin | null> {
    const admin = await this.admins.findOneBy({ adminId });
    if (!admin || admin.status !== UserStatus.ACTIVE || (authVersion !== undefined && admin.authVersion !== authVersion)) return null;
    return this.toAuthenticatedAdmin(admin);
  }

  async refresh(refreshToken: string): Promise<LoginResult> {
    const stored = await this.findUsableToken(refreshToken, AuthTokenPurpose.REFRESH);
    if (!stored) throw new UnauthorizedException('Session หมดอายุแล้ว');
    stored.usedAt = new Date(); await this.tokens.save(stored);
    const admin = await this.admins.findOneBy({ adminId: stored.adminId });
    if (!admin || admin.status !== UserStatus.ACTIVE) throw new UnauthorizedException('บัญชีแอดมินไม่ถูกต้อง');
    return this.createLoginResult(admin);
  }

  issueRefreshToken(adminId: string): Promise<string> { return this.createToken(adminId, AuthTokenPurpose.REFRESH, 7 * 24 * 60 * 60 * 1000); }

  async logout(adminId: string): Promise<void> { await this.admins.increment({ adminId }, 'authVersion', 1); await this.revokeTokens(adminId); }

  async requestPasswordReset(email: string): Promise<void> {
    const admin = await this.admins.findOneBy({ email: email.toLowerCase() });
    if (admin?.status === UserStatus.ACTIVE) await this.email.sendPasswordReset(admin.email, await this.createToken(admin.adminId, AuthTokenPurpose.PASSWORD_RESET, 60 * 60 * 1000));
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const stored = await this.findUsableToken(token, AuthTokenPurpose.PASSWORD_RESET);
    if (!stored) throw new BadRequestException('ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุ');
    await this.updatePassword(stored.adminId, password); stored.usedAt = new Date(); await this.tokens.save(stored);
  }

  async changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<void> {
    const admin = await this.admins.createQueryBuilder('admin').addSelect('admin.passwordHash').where('admin.adminId = :adminId', { adminId }).getOne();
    if (!admin?.passwordHash || !(await bcrypt.compare(currentPassword, admin.passwordHash))) throw new UnauthorizedException('รหัสผ่านปัจจุบันไม่ถูกต้อง');
    await this.updatePassword(adminId, newPassword);
  }

  private toAuthenticatedAdmin(admin: Admin): AuthenticatedAdmin { return { adminId: admin.adminId, email: admin.email, displayName: admin.displayName }; }
  private async createLoginResult(admin: Admin): Promise<LoginResult> { return { accessToken: await this.jwt.signAsync({ sub: admin.adminId, ver: admin.authVersion }), admin: this.toAuthenticatedAdmin(admin) }; }
  private async updatePassword(adminId: string, password: string): Promise<void> { await this.admins.update({ adminId }, { passwordHash: await bcrypt.hash(password, 10), authVersion: () => 'AUTH_VERSION + 1' }); await this.revokeTokens(adminId); }
  private async revokeTokens(adminId: string): Promise<void> { await this.tokens.createQueryBuilder().update(AuthToken).set({ usedAt: new Date() }).where('adminId = :adminId AND usedAt IS NULL', { adminId }).execute(); }
  private async createToken(adminId: string, purpose: AuthTokenPurpose, ttl: number): Promise<string> { const token = randomBytes(48).toString('base64url'); await this.tokens.save(this.tokens.create({ adminId, purpose, tokenHash: this.hashToken(token), expiresAt: new Date(Date.now() + ttl) })); return token; }
  private async findUsableToken(token: string, purpose: AuthTokenPurpose): Promise<AuthToken | null> { const item = await this.tokens.findOneBy({ tokenHash: this.hashToken(token), purpose }); return item && !item.usedAt && item.expiresAt > new Date() ? item : null; }
  private hashToken(token: string): string { return createHash('sha256').update(token).digest('hex'); }
}
