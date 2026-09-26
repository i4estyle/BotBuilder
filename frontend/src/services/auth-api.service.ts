import { apiClient } from './api-client';

export interface AuthUser {
  userId: string;
  userEmail: string | null;
  userName: string;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterPayload {
  loginName: string;
  password: string;
}

export const authApiService = {
  async login(loginName: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', { loginName, password });
    return data;
  },
  async register(payload: RegisterPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/register', payload);
    return data;
  },
  async me(): Promise<AuthUser> {
    const { data } = await apiClient.get<AuthUser>('/auth/me');
    return data;
  },
};
