<template>
  <header class="site-header">
    <RouterLink
      to="/home"
      class="site-header__brand"
      aria-label="Bot Builder home"
      :style="getStyleOverride('header.logo')"
    >
      <img :src="resolveAssetUrl(headerData.logo)" alt="Bot Builder" class="site-header__logo" />
    </RouterLink>

    <nav class="site-header__nav" aria-label="Main navigation">
      <RouterLink to="/home" :style="getStyleOverride('header.nav.home')">{{
        headerData.nav?.home || 'หน้าหลัก'
      }}</RouterLink>
      <RouterLink to="/promotions" :style="getStyleOverride('header.nav.promotions')">{{
        headerData.nav?.promotions || 'โปรโมชั่น'
      }}</RouterLink>
      <RouterLink to="/courses" :style="getStyleOverride('header.nav.courses')">{{
        headerData.nav?.courses || 'คอร์สเรียน'
      }}</RouterLink>
      <RouterLink to="/resources" :style="getStyleOverride('header.nav.resources')">{{
        headerData.nav?.resources || 'คลังความรู้'
      }}</RouterLink>
      <RouterLink to="/about-us" :style="getStyleOverride('header.nav.about')">{{
        headerData.nav?.about || 'เกี่ยวกับเรา'
      }}</RouterLink>
    </nav>

    <div class="site-header__lang" role="group" aria-label="Language switch">
      <button
        type="button"
        class="site-header__lang-btn"
        :class="{ 'site-header__lang-btn--active': editorLocale === 'th-TH' }"
        @click="setEditorLocale('th-TH')"
      >
        {{ editorLocale === 'th-TH' ? 'ไทย' : 'TH' }}
      </button>
      <span class="site-header__lang-divider">|</span>
      <button
        type="button"
        class="site-header__lang-btn"
        :class="{ 'site-header__lang-btn--active': editorLocale === 'en-US' }"
        @click="setEditorLocale('en-US')"
      >
        {{ editorLocale === 'th-TH' ? 'อังกฤษ' : 'EN' }}
      </button>
    </div>

    <q-btn
      v-if="!authStore.isAuthenticated"
      to="/login"
      unelevated
      label="เข้าสู่ระบบ"
      no-caps
      class="site-header__auth-btn site-header__auth-btn--login"
    />
    <div v-else class="site-header__auth-actions">
      <q-btn
        v-if="authStore.isAdmin"
        to="/admin"
        outline
        icon="settings"
        label="จัดการเว็บไซต์"
        no-caps
        class="site-header__auth-btn site-header__auth-btn--admin"
      />
      <q-btn
        unelevated
        icon="logout"
        label="ออกจากระบบ"
        no-caps
        class="site-header__auth-btn site-header__auth-btn--logout"
        @click="handleLogout"
      />
    </div>

    <q-btn flat round dense icon="menu" class="site-header__menu" aria-label="Open menu" />
    <AdminSectionBlockLayer section-id="header" />
  </header>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';
import { useAuthStore } from '@/stores/auth-store';

const { header: headerData, editorLocale, setEditorLocale, getStyleOverride } = useWebsiteEditor();
const authStore = useAuthStore();
const router = useRouter();

function handleLogout(): void {
  authStore.logout();
  void router.replace('/login');
}
</script>
