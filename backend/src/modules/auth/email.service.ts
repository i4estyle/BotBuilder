import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthEmailService {
  private readonly logger = new Logger(AuthEmailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendVerification(email: string, token: string): Promise<void> {
    await this.send(email, 'ยืนยันอีเมล BotBuilder', 'verify-email', token);
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    await this.send(email, 'รีเซ็ตรหัสผ่าน BotBuilder', 'reset-password', token);
  }

  private async send(email: string, subject: string, route: string, token: string): Promise<void> {
    const appUrl = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:9000';
    const link = `${appUrl.replace(/\/$/, '')}/${route}?token=${encodeURIComponent(token)}`;
    const host = this.config.get<string>('SMTP_HOST');
    const from = this.config.get<string>('SMTP_FROM');
    if (!host || !from) {
      this.logger.warn(`SMTP is not configured. Development ${route} link for ${email}: ${link}`);
      return;
    }
    const port = Number(this.config.get<string>('SMTP_PORT') ?? 587);
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASSWORD');
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: this.config.get<string>('SMTP_SECURE') === 'true',
      auth: user && pass ? { user, pass } : undefined,
    });
    await transporter.sendMail({
      from,
      to: email,
      subject,
      text: `กรุณาเปิดลิงก์นี้: ${link}`,
      html: `<p>กรุณาเปิดลิงก์นี้เพื่อดำเนินการ:</p><p><a href="${link}">${link}</a></p>`,
    });
  }
}
