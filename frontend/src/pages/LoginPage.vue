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
          <q-btn
            outline
            no-caps
            icon="img:https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            label="เข้าสู่ระบบด้วย Google"
            :disable="loading || googleLoading"
            :loading="googleLoading"
            class="login-card__google"
            @click="signInWithGoogle"
          />
        </div>
        <p class="login-card__switch">
          <RouterLink to="/admin/forgot-password">ลืมรหัสผ่าน?</RouterLink>
        </p>
      </q-form>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
const errorMessage = ref('');
const required = (value: string) => !!value || 'กรุณากรอกข้อมูล';

interface GoogleCredentialResponse {
  credential: string;
}
interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }): void;
  prompt(): void;
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

async function signInWithGoogle(): Promise<void> {
  if (!googleClientId) return;
  googleLoading.value = true;
  errorMessage.value = '';
  try {
    await loadGoogleIdentity();
    window.google?.accounts.id.initialize({
      client_id: googleClientId,
      callback: ({ credential }) => {
        void completeGoogleSignIn(credential);
      },
    });
    window.google?.accounts.id.prompt();
  } catch {
    errorMessage.value = 'ไม่สามารถเปิด Google Sign-In ได้ กรุณาลองใหม่';
    googleLoading.value = false;
  }
}

async function completeGoogleSignIn(credential: string): Promise<void> {
  try {
    await auth.loginWithGoogle(credential);
    await router.replace((route.query.redirect as string) || '/admin');
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
    await router.replace((route.query.redirect as string) || '/admin');
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
