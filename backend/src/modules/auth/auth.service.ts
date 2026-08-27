import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity.js';
import { UserStatus } from '../../common/enums/user-status.enum.js';
import { LoginDto } from './dto/login.dto.js';
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
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResult> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.userEmail = :userEmail', { userEmail: dto.userEmail })
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

    const accessToken = await this.jwtService.signAsync({
      sub: user.userId,
      userEmail: user.userEmail,
    });

    return {
      accessToken,
      user: {
        userId: user.userId,
        userEmail: user.userEmail,
        userName: user.userName,
      },
    };
  }

  async validateUserById(userId: string): Promise<AuthenticatedUser | null> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user || user.userStatus !== UserStatus.ACTIVE) {
      return null;
    }
    return {
      userId: user.userId,
      userEmail: user.userEmail,
      userName: user.userName,
    };
  }
}
