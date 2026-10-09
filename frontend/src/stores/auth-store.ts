import { defineStore, acceptHMRUpdate } from 'pinia';
import { authApiService, type AuthAdmin } from '@/services/auth-api.service';
import { registerUnauthorizedHandler } from '@/services/api-client';

const USER_STORAGE_KEY = 'bb_auth_user';

function readStoredUser(): AuthAdmin | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as AuthAdmin; } catch { return null; }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: null as string | null, user: readStoredUser(), initialized: false }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    isAdmin: (state) => Boolean(state.token),
  },
  actions: {
    async register(_payload: unknown): Promise<void> { throw new Error('Public registration is disabled'); },
    async login(loginName: string, password: string): Promise<void> {
      const { accessToken, admin } = await authApiService.login(loginName, password);
      this.token = accessToken;
      this.user = admin;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(admin));
    },
    async logout(): Promise<void> {
      try { if (this.token) await authApiService.logout(); } catch { /* Local cleanup must still happen. */ }
      this.token = null;
      this.user = null;
      localStorage.removeItem(USER_STORAGE_KEY);
    },
    async initialize(): Promise<void> {
      if (this.initialized) return;
      try {
        const { accessToken, admin } = await authApiService.refresh();
        this.token = accessToken;
        this.user = admin;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(admin));
      } catch {
        this.token = null;
        this.user = null;
        localStorage.removeItem(USER_STORAGE_KEY);
      } finally {
        this.initialized = true;
      }
    },
  },
});

registerUnauthorizedHandler(() => {
  const auth = useAuthStore();
  auth.token = null;
  auth.user = null;
  localStorage.removeItem(USER_STORAGE_KEY);
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
