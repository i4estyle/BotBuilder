<template>
  <div class="login-page flex flex-center">
    <q-card class="login-card">
      <div class="login-card__brand">
        <img :src="logo" alt="BotBuilder Logo" class="login-card__logo" />
        <h1 class="login-card__title">เข้าสู่ระบบผู้ดูแล</h1>
        <p class="login-card__subtitle">สำหรับผู้ดูแลเว็บไซต์ BotBuilder เท่านั้น</p>
      </div>
      <q-form class="login-card__form" @submit.prevent="submit">
        <q-input
          v-model="loginName"
          label="ชื่อผู้ใช้งานหรืออีเมล"
          outlined
          dense
          :disable="loading"
          :rules="[required]"
          ><template #prepend><q-icon name="person" /></template
        ></q-input>
        <q-input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="รหัสผ่าน"
          outlined
          dense
          :disable="loading"
          :rules="[required]"
          ><template #prepend><q-icon name="lock" /></template
          ><template #append
            ><q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword" /></template
        ></q-input>
        <q-banner v-if="errorMessage" dense rounded class="login-card__error">{{
          errorMessage
        }}</q-banner>
        <q-btn
          type="submit"
          icon="login"
          unelevated
          no-caps
          label="เข้าสู่ระบบ"
          :loading="loading"
          class="login-card__submit"
        />
        <div v-if="googleClientId" class="login-card__oauth">
          <div class="login-card__divider"><span>หรือ</span></div>
          <!-- Google renders its official button into this element. -->
          <div
            ref="googleButton"
            class="login-card__google"
            :class="{ 'login-card__google--busy': googleLoading || loading }"
          />
          <q-linear-progress v-if="googleLoading" indeterminate color="primary" />
          <q-skeleton v-if="!googleReady && !googleUnavailable" type="QBtn" height="40px" />
          <p v-if="googleUnavailable" class="login-card__google-error">
            โหลดปุ่ม Google Sign-In ไม่สำเร็จ กรุณารีเฟรชหน้า หรือเข้าสู่ระบบด้วยรหัสผ่าน
          </p>
        </div>
        <p class="login-card__switch">
          <RouterLink to="/admin/forgot-password">ลืมรหัสผ่าน?</RouterLink>
        </p>
      </q-form>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import logo from '@/assets/landing/logo.png';
import { useAuthStore } from '@/stores/auth-store';
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const loginName = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const googleLoading = ref(false);
const googleReady = ref(false);
const googleUnavailable = ref(false);
const googleButton = ref<HTMLElement | null>(null);
const errorMessage = ref('');
const required = (value: string) => !!value || 'กรุณากรอกข้อมูล';

/** Only follow in-app paths from ?redirect=, never protocol-relative or absolute URLs. */
function redirectTarget(): string {
  const raw = route.query.redirect;
  return typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//')
    ? raw
    : '/admin';
}

interface GoogleCredentialResponse {
  credential: string;
}
interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    ux_mode?: 'popup' | 'redirect';
  }): void;
  renderButton(
    parent: HTMLElement,
    options: {
      type?: 'standard' | 'icon';
      theme?: 'outline' | 'filled_blue' | 'filled_black';
      size?: 'large' | 'medium' | 'small';
      text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
      shape?: 'rectangular' | 'pill' | 'circle' | 'square';
      logo_alignment?: 'left' | 'center';
      width?: number;
      locale?: string;
    },
  ): void;
}
declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

function loadGoogleIdentity(): Promise<void> {
  if (window.google?.accounts.id) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-identity]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('Google Identity failed to load')),
        { once: true },
      );
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Identity failed to load'));
    document.head.appendChild(script);
  });
}

/**
 * Renders Google's own "Sign in with Google" button. It opens a popup on click, so
 * unlike One Tap (`prompt()`) it isn't silently suppressed after a dismissal or
 * when the browser blocks third-party sign-in.
 */
async function renderGoogleButton(): Promise<void> {
  if (!googleClientId) return;
  try {
    await loadGoogleIdentity();
    const container = googleButton.value;
    const accounts = window.google?.accounts.id;
    if (!container || !accounts) return;
    accounts.initialize({
      client_id: googleClientId,
      ux_mode: 'popup',
      callback: ({ credential }) => {
        void completeGoogleSignIn(credential);
      },
    });
    accounts.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'center',
      // Google caps the width at 400px.
      width: Math.min(Math.max(container.clientWidth, 200), 400),
      locale: 'th',
    });
    googleReady.value = true;
  } catch {
    googleUnavailable.value = true;
  }
}

onMounted(() => {
  void renderGoogleButton();
});

async function completeGoogleSignIn(credential: string): Promise<void> {
  googleLoading.value = true;
  errorMessage.value = '';
  try {
    await auth.loginWithGoogle(credential);
    await router.replace(redirectTarget());
  } catch (error) {
    errorMessage.value =
      axios.isAxiosError(error) && error.response?.status === 401
        ? 'บัญชี Google นี้ไม่มีสิทธิ์เข้าระบบผู้ดูแล'
        : 'ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาลองใหม่';
  } finally {
    googleLoading.value = false;
  }
}

async function submit(): Promise<void> {
  if (!loginName.value || !password.value) return;
  loading.value = true;
  errorMessage.value = '';
  try {
    await auth.login(loginName.value, password.value);
    await router.replace(redirectTarget());
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        errorMessage.value =
          'ระบบตรวจพบการพยายามเข้าสู่ระบบบ่อยเกินไป (HTTP 429 Too Many Requests) บล็อกการใช้งานชั่วคราว กรุณารอสักครู่แล้วลองใหม่';
      } else if (error.response?.status === 401) {
        errorMessage.value = 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง';
      } else {
        errorMessage.value =
          (error.response?.data as { message?: string })?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่';
      }
    } else {
      errorMessage.value = 'เกิดข้อผิดพลาด กรุณาลองใหม่';
    }
  } finally {
    loading.value = false;
  }
}
</script>
