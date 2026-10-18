import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { PageSectionsModule } from './modules/page-sections/page-sections.module.js';
import { UploadsModule } from './modules/uploads/uploads.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ChildAccessCodesModule } from './modules/child-access-codes/child-access-codes.module.js';
import { GoogleSheetsModule } from './modules/google-sheets/google-sheets.module.js';
import { HealthModule } from './modules/health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? undefined
          : path.resolve(process.cwd(), '../.env'),
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const useSsl = configService.get<string>('DB_SSL') === 'true';
        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: Number(configService.get<string | number>('DB_PORT')) || 3306,
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: true,
          migrations: ['dist/database/migrations/*.js'],
          ssl: useSsl ? { rejectUnauthorized: false } : undefined,
        };
      },
    }),
    AuthModule,
    ChildAccessCodesModule,
    GoogleSheetsModule,
    HealthModule,
    PageSectionsModule,
    UploadsModule,
  ],
})
export class AppModule {}
