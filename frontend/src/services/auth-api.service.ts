import { apiClient } from './api-client';

export interface AuthUser {
  userId: string;
  userEmail: string;
  userName: string;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterPayload {
  userName: string;
  userEmail: string;
  userPhone: string;
  guardianRelation: 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER';
  password: string;
  childAccessCode: string;
}

export const authApiService = {
  async login(userEmail: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', {
      userEmail,
      password,
    });
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
