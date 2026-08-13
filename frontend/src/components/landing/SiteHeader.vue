<template>
  <header class="site-header">
    <RouterLink to="/home" class="site-header__brand" aria-label="Bot Builder home">
      <img :src="headerData.logo || logo" alt="Bot Builder" class="site-header__logo" />
    </RouterLink>

    <nav class="site-header__nav" aria-label="Main navigation">
      <RouterLink to="/home">{{ headerData.nav.home }}</RouterLink>
      <RouterLink to="/promotions">{{ headerData.nav.promotions }}</RouterLink>
      <RouterLink to="/courses">{{ headerData.nav.courses }}</RouterLink>
      <RouterLink to="/resources">{{ headerData.nav.resources }}</RouterLink>
      <RouterLink to="/about-us">{{ headerData.nav.about }}</RouterLink>
    </nav>

    <div class="site-header__lang" role="group" aria-label="Language switch">
      <button
        type="button"
        class="site-header__lang-btn"
        :class="{ 'site-header__lang-btn--active': editorLocale === 'th-TH' }"
        @click="setLocale('th-TH')"
      >
        {{ editorLocale === 'th-TH' ? 'ไทย' : 'TH' }}
      </button>
      <span class="site-header__lang-divider">|</span>
      <button
        type="button"
        class="site-header__lang-btn"
        :class="{ 'site-header__lang-btn--active': editorLocale === 'en-US' }"
        @click="setLocale('en-US')"
      >
        {{ editorLocale === 'th-TH' ? 'อังกฤษ' : 'EN' }}
      </button>
    </div>

    <q-btn flat round dense icon="menu" class="site-header__menu" aria-label="Open menu" />
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import logo from '@/assets/landing/logo.png';
import { LOCALE_STORAGE_KEY, type MessageLanguages } from '@/boot/i18n';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { locale } = useI18n();
const { header: headerData, editorLocale, setEditorLocale } = useWebsiteEditor();

function setLocale(value: MessageLanguages) {
  setEditorLocale(value);
  locale.value = value;
  localStorage.setItem(LOCALE_STORAGE_KEY, value);
}
</script>
