import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity.js';
import { Role } from '../roles/entities/role.entity.js';
import { UserRole } from '../user-roles/entities/user-role.entity.js';
import { ChildAccessCode } from '../child-access-codes/entities/child-access-code.entity.js';
import { UserStatus } from '../../common/enums/user-status.enum.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import type { AuthenticatedUser } from './interfaces/jwt-payload.interface.js';

export interface LoginResult {
  accessToken: string;
  user: AuthenticatedUser;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,
    @InjectRepository(ChildAccessCode)
    private readonly childAccessCodesRepository: Repository<ChildAccessCode>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResult> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .where('user.loginName = :loginName OR user.userEmail = :loginName', {
        loginName: dto.loginName,
      })
      .getOne();

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    if (user.userStatus !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('บัญชีผู้ใช้นี้ถูกระงับการใช้งาน');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    return this.createLoginResult(user);
  }

  async register(dto: RegisterDto): Promise<LoginResult> {
    const loginNameExists = await this.usersRepository.exists({
      where: { loginName: dto.loginName },
    });
    if (loginNameExists) throw new ConflictException('Username already exists');
    let userId = this.generateUserId();
    while (await this.usersRepository.exists({ where: { userId } }))
      userId = this.generateUserId();
    const user = await this.usersRepository.save(
      this.usersRepository.create({
        userId,
        userName: dto.loginName,
        loginName: dto.loginName,
        userEmail: null,
        childAccessCode: null,
        netionalId: null,
        userAddress: null,
        userPhone: null,
        guardianRelation: null,
        userStatus: UserStatus.ACTIVE,
        passwordHash: await bcrypt.hash(dto.password, 10),
      }),
    );
    const userRole = await this.rolesRepository.findOneBy({ roleId: 'USER' });
    if (!userRole) throw new Error('Default USER role is not configured');
    await this.userRolesRepository.save(
      this.userRolesRepository.create({
        userId: user.userId,
        roleId: userRole.roleId,
      }),
    );
    user.userRoles = [{ role: userRole } as UserRole];
    return this.createLoginResult(user);
  }

  async validateUserById(userId: string): Promise<AuthenticatedUser | null> {
    const user = await this.usersRepository.findOne({
      where: { userId },
      relations: { userRoles: { role: true } },
    });
    if (!user || user.userStatus !== UserStatus.ACTIVE) {
      return null;
    }
    return this.toAuthenticatedUser(user);
  }

  private generateUserId(): string {
    return Array.from({ length: 8 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(
        Math.floor(Math.random() * 36),
      ),
    ).join('');
  }
  private toAuthenticatedUser(user: User): AuthenticatedUser {
    return {
      userId: user.userId,
      userEmail: user.userEmail ?? null,
      userName: user.userName,
      roles: (user.userRoles ?? []).map((item) =>
        (item.role?.roleName ?? item.roleId).toLowerCase(),
      ),
    };
  }
  private async createLoginResult(user: User): Promise<LoginResult> {
    const accessToken = await this.jwtService.signAsync({ sub: user.userId });
    return { accessToken, user: this.toAuthenticatedUser(user) };
  }
}
