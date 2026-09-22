import { defineStore, acceptHMRUpdate } from 'pinia';
import { authApiService, type AuthUser, type RegisterPayload } from '@/services/auth-api.service';
import { registerUnauthorizedHandler } from '@/services/api-client';

const TOKEN_STORAGE_KEY = 'bb_auth_token';
const USER_STORAGE_KEY = 'bb_auth_user';

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_STORAGE_KEY),
    user: readStoredUser(),
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    isAdmin: (state) => state.user?.roles?.includes('admin') ?? false,
  },

  actions: {
    async login(userEmail: string, password: string): Promise<void> {
      const { accessToken, user } = await authApiService.login(userEmail, password);
      this.token = accessToken;
      this.user = user;
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    },
    async register(payload: RegisterPayload): Promise<void> {
      const { accessToken, user } = await authApiService.register(payload);
      this.token = accessToken; this.user = user;
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    },

    logout(): void {
      this.token = null;
      this.user = null;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    },
  },
});

// Log the user out automatically whenever the API reports an expired/invalid token.
registerUnauthorizedHandler(() => {
  useAuthStore().logout();
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
