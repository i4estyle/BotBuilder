<template>
  <header class="site-header">
    <RouterLink to="/home" class="site-header__brand" aria-label="Bot Builder home">
      <img :src="logo" alt="Bot Builder" class="site-header__logo" />
    </RouterLink>

    <nav class="site-header__nav" aria-label="Main navigation">
      <RouterLink to="/home">{{ t('common.nav.home') }}</RouterLink>
      <RouterLink to="/promotions">{{ t('common.nav.promotions') }}</RouterLink>
      <RouterLink to="/courses">{{ t('common.nav.courses') }}</RouterLink>
      <RouterLink to="/resources">{{ t('common.nav.resources') }}</RouterLink>
      <RouterLink to="/about-us">{{ t('common.nav.about') }}</RouterLink>
    </nav>

    <div class="site-header__lang" role="group" aria-label="Language switch">
      <button
        type="button"
        class="site-header__lang-btn"
        :class="{ 'site-header__lang-btn--active': locale === 'th-TH' }"
        @click="setLocale('th-TH')"
      >
        {{ t('common.langSwitch.th') }}
      </button>
      <span class="site-header__lang-divider">|</span>
      <button
        type="button"
        class="site-header__lang-btn"
        :class="{ 'site-header__lang-btn--active': locale === 'en-US' }"
        @click="setLocale('en-US')"
      >
        {{ t('common.langSwitch.en') }}
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

const { t, locale } = useI18n();

function setLocale(value: MessageLanguages) {
  locale.value = value;
  localStorage.setItem(LOCALE_STORAGE_KEY, value);
}
</script>
