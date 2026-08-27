<template>
  <div class="login-page flex flex-center">
    <q-card class="login-card">
      <div class="login-card__brand">
        <img :src="logo" alt="BotBuilder Logo" class="login-card__logo" />
        <h1 class="login-card__title">เข้าสู่ระบบจัดการเว็บไซต์</h1>
        <p class="login-card__subtitle">สำหรับผู้ดูแลระบบเท่านั้น</p>
      </div>

      <q-form class="login-card__form" @submit.prevent="handleSubmit">
        <q-input
          v-model="userEmail"
          type="email"
          label="อีเมล"
          outlined
          dense
          autofocus
          :rules="[(val) => !!val || 'กรุณากรอกอีเมล']"
          :disable="isSubmitting"
        >
          <template #prepend>
            <q-icon name="mail" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="รหัสผ่าน"
          outlined
          dense
          :rules="[(val) => !!val || 'กรุณากรอกรหัสผ่าน']"
          :disable="isSubmitting"
        >
          <template #prepend>
            <q-icon name="lock" />
          </template>
          <template #append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-banner v-if="errorMessage" dense rounded class="login-card__error">
          {{ errorMessage }}
        </q-banner>

        <q-btn
          type="submit"
          unelevated
          color="primary"
          label="เข้าสู่ระบบ"
          no-caps
          class="login-card__submit"
          :loading="isSubmitting"
        />
      </q-form>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import logo from '@/assets/landing/logo.png';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const userEmail = ref('');
const password = ref('');
const showPassword = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');

async function handleSubmit(): Promise<void> {
  if (!userEmail.value || !password.value) return;

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    await authStore.login(userEmail.value, password.value);
    const redirect = (route.query.redirect as string) || '/admin';
    await router.replace(redirect);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      errorMessage.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
    } else {
      errorMessage.value = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>
