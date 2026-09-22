import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { Role } from '../roles/entities/role.entity.js';
import { UserRole } from '../user-roles/entities/user-role.entity.js';
import { ChildAccessCode } from '../child-access-codes/entities/child-access-code.entity.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { AdminGuard } from './guards/admin.guard.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole, ChildAccessCode]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN') ?? '8h';
        return {
          secret:
            configService.get<string>('JWT_SECRET') ??
            'botbuilder-dev-secret-change-me',
          signOptions: {
            expiresIn: expiresIn as NonNullable<
              JwtModuleOptions['signOptions']
            >['expiresIn'],
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AdminGuard],
  exports: [AuthService, AdminGuard],
})
export class AuthModule {}
