<template><div class="login-page flex flex-center"><q-card class="login-card"><div class="login-card__brand"><h1 class="login-card__title">ยืนยันอีเมล</h1><p class="login-card__subtitle">{{ message }}</p></div><q-btn v-if="done" to="/login" unelevated no-caps label="เข้าสู่ระบบ" class="login-card__submit full-width" /></q-card></div></template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'; import { useRoute } from 'vue-router'; import { authApiService } from '@/services/auth-api.service';
const route = useRoute(); const message = ref('กำลังยืนยันอีเมล…'); const done = ref(false);
onMounted(async () => { try { await authApiService.verifyEmail(String(route.query.token || '')); message.value = 'ยืนยันอีเมลสำเร็จแล้ว'; done.value = true; } catch { message.value = 'ลิงก์ยืนยันไม่ถูกต้องหรือหมดอายุ'; } });
</script>
