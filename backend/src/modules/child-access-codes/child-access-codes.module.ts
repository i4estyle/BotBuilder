import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { ChildAccessCodesController } from './child-access-codes.controller.js';
import { ChildAccessCodesService } from './child-access-codes.service.js';
import { ChildAccessCode } from './entities/child-access-code.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ChildAccessCode]), AuthModule],
  controllers: [ChildAccessCodesController],
  providers: [ChildAccessCodesService],
})
export class ChildAccessCodesModule {}
