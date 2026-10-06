import { Module } from '@nestjs/common';
import { GoogleSheetsController } from './google-sheets.controller.js';
import { GoogleSheetsService } from './google-sheets.service.js';

@Module({
  controllers: [GoogleSheetsController],
  providers: [GoogleSheetsService],
  exports: [GoogleSheetsService],
})
export class GoogleSheetsModule {}

