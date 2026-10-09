import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { PageSectionsModule } from './modules/page-sections/page-sections.module.js';
import { UploadsModule } from './modules/uploads/uploads.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ChildAccessCodesModule } from './modules/child-access-codes/child-access-codes.module.js';
import { GoogleSheetsModule } from './modules/google-sheets/google-sheets.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), '../.env'),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT') || 3306,
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: true,
        migrations: ['dist/database/migrations/*.js'],
      }),
    }),
    AuthModule,
    ChildAccessCodesModule,
    GoogleSheetsModule,
    PageSectionsModule,
    UploadsModule,
  ],
})
export class AppModule {}
