import { apiClient } from './api-client';
import type {
  PageDataResponse,
  BulkSavePayload,
  PageSectionItem,
} from '@/composables/website-editor/types';

export const pageSectionsApiService = {
  async getPageData(pageName = 'home', locale = 'th-TH'): Promise<PageDataResponse> {
    const { data } = await apiClient.get<PageDataResponse>('/page-sections', {
      params: { pageName, locale },
    });
    return data;
  },

  async bulkSave(payload: BulkSavePayload): Promise<PageDataResponse> {
    const { data } = await apiClient.post<PageDataResponse>('/page-sections/bulk-save', payload);
    return data;
  },

  async getAllSections(): Promise<PageSectionItem[]> {
    const { data } = await apiClient.get<PageSectionItem[]>('/page-sections/list');
    return data;
  },
};
