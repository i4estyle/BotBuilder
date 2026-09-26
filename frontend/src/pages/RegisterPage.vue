<template>
  <div class="login-page flex flex-center">
    <q-card class="login-card">
      <div class="login-card__brand">
        <img :src="logo" alt="BotBuilder Logo" class="login-card__logo" />
        <h1 class="login-card__title">สร้างบัญชี</h1>
        <p class="login-card__subtitle">สร้างบัญชีเพื่อเข้าสู่ระบบ</p>
      </div>
      <q-form class="login-card__form" @submit.prevent="submit">
        <q-input v-model="loginName" label="ชื่อผู้ใช้งาน" outlined dense maxlength="50" :disable="loading" :rules="[loginNameRule]">
          <template #prepend><q-icon name="person" /></template>
        </q-input>
        <q-input v-model="password" :type="showPassword ? 'text' : 'password'" label="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)" outlined dense :disable="loading" :rules="[passwordRule]">
          <template #prepend><q-icon name="lock" /></template>
          <template #append><q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword = !showPassword" /></template>
        </q-input>
        <q-input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" label="ยืนยันรหัสผ่าน" outlined dense :disable="loading" :rules="[confirmPasswordRule]">
          <template #prepend><q-icon name="lock" /></template>
          <template #append><q-icon :name="showConfirmPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showConfirmPassword = !showConfirmPassword" /></template>
        </q-input>
        <q-banner v-if="errorMessage" dense rounded class="login-card__error">{{ errorMessage }}</q-banner>
        <q-btn type="submit" unelevated no-caps label="สร้างบัญชี" :loading="loading" class="login-card__submit" />
        <p class="login-card__switch">มีบัญชีอยู่แล้ว? <RouterLink to="/login">เข้าสู่ระบบ</RouterLink></p>
      </q-form>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import axios from 'axios';
import logo from '@/assets/landing/logo.png';
import { useAuthStore } from '@/stores/auth-store';

const router = useRouter();
const auth = useAuthStore();
const loginName = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const loginNameRule = (value: string) => /^[A-Za-z0-9]{3,50}$/.test(value) || 'ใช้ตัวอักษรภาษาอังกฤษหรือตัวเลข 3–50 ตัว';
const passwordRule = (value: string) => value.length >= 8 || 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
const confirmPasswordRule = (value: string) => value === password.value || 'รหัสผ่านไม่ตรงกัน';

async function submit(): Promise<void> {
  if (!/^[A-Za-z0-9]{3,50}$/.test(loginName.value) || password.value.length < 8 || password.value !== confirmPassword.value) return;
  loading.value = true;
  errorMessage.value = '';
  try {
    await auth.register({ loginName: loginName.value, password: password.value });
    auth.logout();
    await router.replace('/login');
  } catch (error) {
    errorMessage.value = axios.isAxiosError(error) && error.response?.status === 409 ? 'ชื่อผู้ใช้งานนี้ถูกใช้แล้ว' : 'สร้างบัญชีไม่สำเร็จ กรุณาลองใหม่';
  } finally {
    loading.value = false;
  }
}
</script>
