<template>
  <div class="login-page flex flex-center">
    <q-card class="login-card">
      <div class="login-card__brand">
        <h1 class="login-card__title">รีเซ็ตรหัสผ่านผู้ดูแล</h1>
        <p class="login-card__subtitle">ส่งลิงก์ไปยังอีเมลผู้ดูแล</p>
      </div>
      <q-form class="login-card__form" @submit.prevent="submit">
        <q-input v-model="email" type="email" label="อีเมล" outlined :rules="[required]" />
        <q-banner
          v-if="message"
          dense
          rounded
          :class="success ? 'bg-positive text-white' : 'login-card__error'"
          >{{ message }}</q-banner
        >
        <q-btn
          type="submit"
          unelevated
          no-caps
          label="ส่งลิงก์รีเซ็ต"
          :loading="loading"
          class="login-card__submit"
        />
        <p class="login-card__switch">
          <RouterLink to="/admin/login">กลับไปเข้าสู่ระบบ</RouterLink>
        </p>
      </q-form>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { authApiService } from '@/services/auth-api.service';

const email = ref('');
const loading = ref(false);
const message = ref('');
const success = ref(false);
const required = (value: string) => Boolean(value) || 'กรุณากรอกอีเมล';

async function submit(): Promise<void> {
  loading.value = true;
  message.value = '';
  try {
    await authApiService.forgotPassword(email.value);
    success.value = true;
    message.value = 'หากมีบัญชีที่ตรงกับอีเมล ระบบได้ส่งลิงก์แล้ว';
  } catch {
    success.value = false;
    message.value = 'ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง';
  } finally {
    loading.value = false;
  }
}
</script>
