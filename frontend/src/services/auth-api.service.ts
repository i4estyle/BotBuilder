import { apiClient } from './api-client';

export interface AuthAdmin {
  adminId: string;
  email: string;
  displayName: string;
}

export interface LoginResponse {
  accessToken: string;
  admin: AuthAdmin;
}

export const authApiService = {
  async login(loginName: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', { loginName, password });
    return data;
  },
  async me(): Promise<AuthAdmin> {
    const { data } = await apiClient.get<AuthAdmin>('/auth/me');
    return data;
  },
  async refresh(): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/refresh');
    return data;
  },
  async logout(): Promise<void> { await apiClient.post('/auth/logout'); },
  async forgotPassword(email: string): Promise<void> { await apiClient.post('/auth/forgot-password', { email }); },
  async resetPassword(token: string, password: string): Promise<void> { await apiClient.post('/auth/reset-password', { token, password }); },
  async changePassword(currentPassword: string, newPassword: string): Promise<void> { await apiClient.post('/auth/change-password', { currentPassword, newPassword }); },
};
