import { apiClient } from './api-client';

export interface AuthUser {
  userId: string;
  userEmail: string;
  userName: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export const authApiService = {
  async login(userEmail: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', {
      userEmail,
      password,
    });
    return data;
  },

  async me(): Promise<AuthUser> {
    const { data } = await apiClient.get<AuthUser>('/auth/me');
    return data;
  },
};
