import { apiClient } from './api-client';
import type { GoogleSheetsEvaluationsResponse } from '@/types/evaluation';

export const googleSheetsApiService = {
  /**
   * Fetch children evaluations directly from Google Sheets via NestJS backend
   * @param sheetName Optional custom sheet tab name (defaults to backend .env)
   */
  async getEvaluations(sheetName?: string): Promise<GoogleSheetsEvaluationsResponse> {
    const { data } = await apiClient.get<GoogleSheetsEvaluationsResponse>(
      '/google-sheets/evaluations',
      {
        params: sheetName ? { sheetName } : undefined,
      },
    );
    return data;
  },
};

