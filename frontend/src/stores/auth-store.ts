import { defineStore, acceptHMRUpdate } from 'pinia';
import { authApiService, type AuthAdmin } from '@/services/auth-api.service';
import { AUTH_TOKEN_STORAGE_KEY, registerAuthHandlers } from '@/services/api-client';

const USER_STORAGE_KEY = 'bb_auth_user';

function readStoredUser(): AuthAdmin | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthAdmin;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: null as string | null, user: readStoredUser(), initialized: false }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    async login(loginName: string, password: string): Promise<void> {
      const { accessToken, admin } = await authApiService.login(loginName, password);
      this.saveSession(accessToken, admin);
    },
    async loginWithGoogle(credential: string): Promise<void> {
      const { accessToken, admin } = await authApiService.loginWithGoogle(credential);
      this.saveSession(accessToken, admin);
    },
    saveSession(accessToken: string, admin: AuthAdmin): void {
      this.token = accessToken;
      this.user = admin;
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(admin));
    },
    async logout(): Promise<void> {
      try {
        // Always call the API: it revokes the session via the refresh cookie,
        // even when the in-memory access token is missing or expired.
        await authApiService.logout();
      } catch {
        /* Local cleanup must still happen. */
      }
      this.clearSession();
    },
    clearSession(): void {
      this.token = null;
      this.user = null;
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    },
    async initialize(): Promise<void> {
      if (this.initialized) return;
      try {
        const { accessToken, admin } = await authApiService.refresh();
        this.saveSession(accessToken, admin);
      } catch {
        this.clearSession();
      } finally {
        this.initialized = true;
      }
    },
  },
});

// Keep the store in sync when the API client silently refreshes an expired access token.
registerAuthHandlers({
  onRefreshed: ({ accessToken, admin }) => useAuthStore().saveSession(accessToken, admin),
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
