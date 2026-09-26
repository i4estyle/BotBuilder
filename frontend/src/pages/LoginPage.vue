<template>
  <div class="login-page flex flex-center">
    <q-card class="login-card">
      <div class="login-card__brand">
        <img :src="logo" alt="BotBuilder Logo" class="login-card__logo" />
        <h1 class="login-card__title">เข้าสู่ระบบ</h1>
        <p class="login-card__subtitle">เข้าสู่ระบบเพื่อจัดการบัญชีของคุณ</p>
      </div>
      <q-form class="login-card__form" @submit.prevent="submit">
        <q-input v-model="loginName" label="ชื่อผู้ใช้งาน" outlined dense :disable="loading" :rules="[required]"><template #prepend><q-icon name="person" /></template></q-input>
        <q-input v-model="password" :type="showPassword ? 'text' : 'password'" label="รหัสผ่าน" outlined dense :disable="loading" :rules="[required]"><template #prepend><q-icon name="lock" /></template><template #append><q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword = !showPassword" /></template></q-input>
        <q-banner v-if="errorMessage" dense rounded class="login-card__error">{{ errorMessage }}</q-banner>
        <q-btn type="submit" icon="login" unelevated no-caps label="เข้าสู่ระบบ" :loading="loading" class="login-card__submit" />
        <p class="login-card__switch">ยังไม่มีบัญชี? <RouterLink to="/register">สร้างบัญชี</RouterLink></p>
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
const loginName = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const required = (value: string) => !!value || 'กรุณากรอกข้อมูล';

async function submit(): Promise<void> {
  if (!loginName.value || !password.value) return;
  loading.value = true;
  errorMessage.value = '';
  try {
    await auth.login(loginName.value, password.value);
    await router.replace(auth.isAdmin ? ((route.query.redirect as string) || '/admin') : '/home');
  } catch (error) {
    errorMessage.value = axios.isAxiosError(error) && error.response?.status === 401 ? 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' : 'เกิดข้อผิดพลาด กรุณาลองใหม่';
  } finally {
    loading.value = false;
  }
}
</script>
