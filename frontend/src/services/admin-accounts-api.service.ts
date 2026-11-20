import { apiClient } from './api-client';
import type {
  AdminAccount,
  AdminAccountStatus,
  CreateAdminAccountPayload,
  UpdateAdminAccountPayload,
} from '@/types/admin';

export const adminAccountsApiService = {
  async list(): Promise<AdminAccount[]> {
    const { data } = await apiClient.get<AdminAccount[]>('/auth/admins');
    return data;
  },

  async create(payload: CreateAdminAccountPayload): Promise<AdminAccount> {
    const { data } = await apiClient.post<AdminAccount>('/auth/admins', payload);
    return data;
  },

  async update(adminId: string, payload: UpdateAdminAccountPayload): Promise<AdminAccount> {
    const { data } = await apiClient.patch<AdminAccount>(`/auth/admins/${adminId}`, payload);
    return data;
  },

  async setStatus(
    adminId: string,
    status: Exclude<AdminAccountStatus, 'INACTIVE'>,
  ): Promise<AdminAccount> {
    const { data } = await apiClient.patch<AdminAccount>(`/auth/admins/${adminId}/status`, {
      status,
    });
    return data;
  },

  async sendPasswordReset(adminId: string): Promise<void> {
    await apiClient.post(`/auth/admins/${adminId}/password-reset`);
  },

  async remove(adminId: string): Promise<void> {
    await apiClient.delete(`/auth/admins/${adminId}`);
  },
};
