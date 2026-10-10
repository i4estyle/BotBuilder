import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminSummary, AuthService, LoginResult } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { AuthenticatedAdmin } from './interfaces/jwt-payload.interface.js';
import { EmailDto } from './dto/email.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Log in as an administrator' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResult> {
    const result = await this.authService.login(loginDto);
    this.setRefreshCookie(
      response,
      await this.authService.issueRefreshToken(result.admin.adminId),
    );
    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the currently authenticated administrator' })
  me(@CurrentUser() admin: AuthenticatedAdmin): AuthenticatedAdmin {
    return admin;
  }

  @Get('admins')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List administrator accounts' })
  listAdmins(): Promise<AdminSummary[]> {
    return this.authService.listAdmins();
  }

  @Post('admins')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create an administrator account' })
  createAdmin(@Body() dto: CreateAdminDto): Promise<AdminSummary> {
    return this.authService.createAdmin(dto);
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResult> {
    const token = this.getRefreshCookie(request);
    const result = await this.authService.refresh(token);
    this.setRefreshCookie(
      response,
      await this.authService.issueRefreshToken(result.admin.adminId),
    );
    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() admin: AuthenticatedAdmin,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(admin.adminId);
    response.clearCookie('bb_refresh_token', { path: '/api/auth' });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: EmailDto): Promise<{ message: string }> {
    await this.authService.requestPasswordReset(dto.email);
    return {
      message: 'หากมีบัญชีที่ตรงกับอีเมล ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(dto.token, dto.password);
    return { message: 'ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว' };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() admin: AuthenticatedAdmin,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.changePassword(
      admin.adminId,
      dto.currentPassword,
      dto.newPassword,
    );
    return { message: 'เปลี่ยนรหัสผ่านแล้ว กรุณาเข้าสู่ระบบอีกครั้ง' };
  }

  private setRefreshCookie(response: Response, token: string): void {
    response.cookie('bb_refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private getRefreshCookie(request: Request): string {
    const cookie = request.headers.cookie
      ?.split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('bb_refresh_token='))
      ?.slice('bb_refresh_token='.length);
    if (!cookie) throw new UnauthorizedException('Refresh token is required');
    return decodeURIComponent(cookie);
  }
}
