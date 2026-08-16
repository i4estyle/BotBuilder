<template>
  <header class="site-header">
    <RouterLink to="/home" class="site-header__brand" aria-label="Bot Builder home">
      <img :src="resolveAssetUrl(headerData.logo)" alt="Bot Builder" class="site-header__logo" />
    </RouterLink>

    <nav class="site-header__nav" aria-label="Main navigation">
      <RouterLink to="/home">{{ headerData.nav?.home || 'หน้าหลัก' }}</RouterLink>
      <RouterLink to="/promotions">{{ headerData.nav?.promotions || 'โปรโมชั่น' }}</RouterLink>
      <RouterLink to="/courses">{{ headerData.nav?.courses || 'คอร์สเรียน' }}</RouterLink>
      <RouterLink to="/resources">{{ headerData.nav?.resources || 'คลังความรู้' }}</RouterLink>
      <RouterLink to="/about-us">{{ headerData.nav?.about || 'เกี่ยวกับเรา' }}</RouterLink>
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

    <q-btn flat round dense icon="menu" class="site-header__menu" aria-label="Open menu" />
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';

const { header: headerData, editorLocale, setEditorLocale } = useWebsiteEditor();
</script>
