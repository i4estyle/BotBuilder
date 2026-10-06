import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleSheetsService } from './google-sheets.service.js';
import type { GoogleSheetsEvaluationsResponse } from './interfaces/evaluation.interface.js';

@ApiTags('Google Sheets')
@Controller('google-sheets')
export class GoogleSheetsController {
  constructor(private readonly googleSheetsService: GoogleSheetsService) {}

  @Get('evaluations')
  @ApiOperation({ summary: 'Fetch children evaluation data from Google Sheets' })
  @ApiQuery({
    name: 'sheetName',
    required: false,
    description: 'Name of the sheet tab (defaults to GOOGLE_SHEET_NAME in .env)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved Google Sheets evaluation data',
  })
  async getEvaluations(
    @Query('sheetName') sheetName?: string,
  ): Promise<GoogleSheetsEvaluationsResponse> {
    return this.googleSheetsService.getEvaluations(sheetName);
  }
}

