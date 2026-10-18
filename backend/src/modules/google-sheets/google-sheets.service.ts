import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, sheets_v4 } from 'googleapis';
import type {
  EvaluationRecord,
  EvaluationScores,
  GoogleSheetsEvaluationsResponse,
} from './interfaces/evaluation.interface.js';

@Injectable()
export class GoogleSheetsService {
  private readonly logger = new Logger(GoogleSheetsService.name);
  private sheetsClient: sheets_v4.Sheets | null = null;

  constructor(private readonly configService: ConfigService) {}

  private getSheetsClient(): sheets_v4.Sheets {
    if (this.sheetsClient) {
      return this.sheetsClient;
    }

    const email = this.configService.get<string>(
      'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    );
    const rawKey = this.configService.get<string>('GOOGLE_PRIVATE_KEY');

    if (!email || !rawKey) {
      this.logger.error(
        'Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY in .env',
      );
      throw new InternalServerErrorException(
        'Google Sheets credentials are not configured in environment variables.',
      );
    }

    // Replace escaped \n with actual newlines
    const privateKey = rawKey.replace(/\\n/g, '\n');

    try {
      const auth = new google.auth.JWT({
        email,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      this.sheetsClient = google.sheets({ version: 'v4', auth });
      return this.sheetsClient;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to initialize Google Sheets Auth: ${message}`);
      throw new InternalServerErrorException(
        `Google Sheets Auth Initialization Failed: ${message}`,
      );
    }
  }

  async getEvaluations(
    customSheetName?: string,
  ): Promise<GoogleSheetsEvaluationsResponse> {
    const spreadsheetId = this.configService.get<string>(
      'GOOGLE_SPREADSHEET_ID',
    );
    const sheetName =
      customSheetName ||
      this.configService.get<string>('GOOGLE_SHEET_NAME') ||
      'Sheet1';

    if (!spreadsheetId) {
      throw new InternalServerErrorException(
        'GOOGLE_SPREADSHEET_ID is not configured in .env',
      );
    }

    const sheets = this.getSheetsClient();

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A1:Z`,
      });

      const rows = response.data.values;
      if (!rows || rows.length <= 1) {
        return {
          sheetTitle: sheetName,
          spreadsheetId,
          totalRows: 0,
          lastUpdated: new Date().toISOString(),
          records: [],
        };
      }

      // First row is headers
      // const headers = rows[0];
      const dataRows = rows.slice(1);

      const cellToString = (val: unknown): string => {
        if (typeof val === 'string') return val.trim();
        if (typeof val === 'number' || typeof val === 'boolean') {
          return String(val).trim();
        }
        return '';
      };

      const records: EvaluationRecord[] = dataRows
        .filter((row) => row && row.length > 0 && Boolean(cellToString(row[0])))
        .map((row) => {
          const parseScore = (val: unknown): number | null => {
            if (val === undefined || val === null || val === '') return null;
            const parsed = Number(val);
            return isNaN(parsed) ? null : parsed;
          };

          const s1 = parseScore(row[8]);
          const s2 = parseScore(row[9]);
          const s3 = parseScore(row[10]);
          const s4 = parseScore(row[11]);
          const s5 = parseScore(row[12]);
          const s6 = parseScore(row[13]);
          const s7 = parseScore(row[14]);

          const validScores = [s1, s2, s3, s4, s5, s6, s7].filter(
            (s): s is number => s !== null,
          );
          const totalScore = validScores.reduce((acc, curr) => acc + curr, 0);
          const averageScore =
            validScores.length > 0
              ? Number((totalScore / validScores.length).toFixed(2))
              : 0;

          const scores: EvaluationScores = {
            score1: s1,
            score2: s2,
            score3: s3,
            score4: s4,
            score5: s5,
            score6: s6,
            score7: s7,
          };

          const sessionNum = row[3] ? Number(row[3]) : null;

          return {
            evaluationId: cellToString(row[0]),
            evaluationTitle: cellToString(row[1]),
            enrollment: cellToString(row[2]),
            sessionNumber: isNaN(sessionNum as number) ? null : sessionNum,
            sessionDate: cellToString(row[4]),
            comment: cellToString(row[5]),
            googleDriveLink: cellToString(row[6]),
            status: cellToString(row[7]) || 'Pending',
            scores,
            totalScore,
            averageScore,
            teacherNote: cellToString(row[15]),
            aiMessage: cellToString(row[16]),
            genMessage: cellToString(row[17]),
            lineSentStatus: cellToString(row[18]),
          };
        });

      return {
        sheetTitle: sheetName,
        spreadsheetId,
        totalRows: records.length,
        lastUpdated: new Date().toISOString(),
        records,
      };
    } catch (err: unknown) {
      const errorObj = err as {
        code?: number;
        message?: string;
        response?: { data?: unknown };
      };
      this.logger.error(
        `Error reading Google Sheet: ${errorObj.message}`,
        errorObj.response?.data,
      );

      if (errorObj.code === 404) {
        throw new NotFoundException(
          `Google Spreadsheet not found with ID: ${spreadsheetId}`,
        );
      }
      if (errorObj.code === 403) {
        throw new InternalServerErrorException(
          'Permission denied: Please ensure the Google Sheet is shared with the Service Account email.',
        );
      }

      throw new InternalServerErrorException(
        `Failed to fetch Google Sheet data: ${errorObj.message || 'Unknown error'}`,
      );
    }
  }
}
