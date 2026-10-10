import { apiClient } from './api-client';
import type { AdminAccount, CreateAdminAccountPayload } from '@/types/admin';

export const adminAccountsApiService = {
  async list(): Promise<AdminAccount[]> {
    const { data } = await apiClient.get<AdminAccount[]>('/auth/admins');
    return data;
  },

  async create(payload: CreateAdminAccountPayload): Promise<AdminAccount> {
    const { data } = await apiClient.post<AdminAccount>('/auth/admins', payload);
    return data;
  },
};
