import axios from 'axios';
import type {
  PageDataResponse,
  BulkSavePayload,
  PageSectionItem,
} from '@/composables/website-editor/types';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
});

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
