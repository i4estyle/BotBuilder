import axios, { type InternalAxiosRequestConfig } from 'axios';

const rawBaseUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';
export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

export const AUTH_TOKEN_STORAGE_KEY = 'bb_auth_token';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

export interface RefreshedSession {
  accessToken: string;
  admin: { adminId: string; email: string; displayName: string };
}

interface AuthHandlers {
  /** Called after a 401 was recovered by refreshing the access token. */
  onRefreshed?: (session: RefreshedSession) => void;
  /** Called when the session could not be recovered (refresh failed). */
  onUnauthorized?: () => void;
}

let handlers: AuthHandlers = {};

export function registerAuthHandlers(next: AuthHandlers): void {
  handlers = { ...handlers, ...next };
}

/** Endpoints whose 401 means "bad credentials", not "access token expired". */
const AUTH_ENDPOINTS_WITHOUT_RETRY = [
  '/auth/login',
  '/auth/google',
  '/auth/refresh',
  '/auth/logout',
  '/auth/forgot-password',
  '/auth/reset-password',
];

type RetriableConfig = InternalAxiosRequestConfig & { _authRetried?: boolean };

let refreshInFlight: Promise<RefreshedSession> | null = null;

/** Single-flight refresh so parallel 401s don't race to rotate the same refresh cookie. */
function refreshSession(): Promise<RefreshedSession> {
  refreshInFlight ??= apiClient
    .post<RefreshedSession>('/auth/refresh')
    .then(({ data }) => {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.accessToken);
      handlers.onRefreshed?.(data);
      return data;
    })
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      throw error;
    }
    const config = error.config as RetriableConfig;
    const url = config.url ?? '';
    if (AUTH_ENDPOINTS_WITHOUT_RETRY.some((path) => url.startsWith(path))) throw error;

    if (!config._authRetried) {
      config._authRetried = true;
      try {
        await refreshSession();
      } catch {
        handlers.onUnauthorized?.();
        throw error;
      }
      // The request interceptor re-reads the new token from localStorage.
      return apiClient.request(config);
    }

    handlers.onUnauthorized?.();
    throw error;
  },
);
