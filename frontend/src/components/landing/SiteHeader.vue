<template>
  <header class="site-header" :class="{ 'site-header--scrolled': isScrolled }">
    <RouterLink
      to="/home"
      class="site-header__brand"
      aria-label="Bot Builder home"
      :style="getStyleOverride('header.logo')"
      @click="isMobileMenuOpen = false"
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
        TH
      </button>
      <span class="site-header__lang-divider">|</span>
      <button
        type="button"
        class="site-header__lang-btn"
        :class="{ 'site-header__lang-btn--active': editorLocale === 'en-US' }"
        @click="setEditorLocale('en-US')"
      >
        EN
      </button>
    </div>
    <q-btn
      flat
      round
      dense
      :icon="isMobileMenuOpen ? 'close' : 'menu'"
      class="site-header__menu"
      :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
      @click="isMobileMenuOpen = !isMobileMenuOpen"
    />
    <AdminSectionBlockLayer section-id="header" />

    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <aside
        v-if="isMobileMenuOpen"
        class="site-header__mobile-drawer"
        aria-label="Mobile navigation"
      >
        <nav class="site-header__mobile-nav">
          <RouterLink to="/home" @click="isMobileMenuOpen = false">
            {{ headerData.nav?.home || 'หน้าหลัก' }}
          </RouterLink>
          <RouterLink to="/promotions" @click="isMobileMenuOpen = false">
            {{ headerData.nav?.promotions || 'โปรโมชั่น' }}
          </RouterLink>
          <RouterLink to="/courses" @click="isMobileMenuOpen = false">
            {{ headerData.nav?.courses || 'คอร์สเรียน' }}
          </RouterLink>
          <RouterLink to="/resources" @click="isMobileMenuOpen = false">
            {{ headerData.nav?.resources || 'คลังความรู้' }}
          </RouterLink>
          <RouterLink to="/about-us" @click="isMobileMenuOpen = false">
            {{ headerData.nav?.about || 'เกี่ยวกับเรา' }}
          </RouterLink>
        </nav>
        <div class="site-header__mobile-footer">
          <div class="site-header__lang" role="group" aria-label="Language switch">
            <button
              type="button"
              class="site-header__lang-btn"
              :class="{ 'site-header__lang-btn--active': editorLocale === 'th-TH' }"
              @click="setEditorLocale('th-TH')"
            >
              TH
            </button>
            <span class="site-header__lang-divider">|</span>
            <button
              type="button"
              class="site-header__lang-btn"
              :class="{ 'site-header__lang-btn--active': editorLocale === 'en-US' }"
              @click="setEditorLocale('en-US')"
            >
              EN
            </button>
          </div>
          <q-btn
            unelevated
            color="primary"
            to="/courses"
            label="ดูคอร์สเรียน"
            no-caps
            rounded
            @click="isMobileMenuOpen = false"
          />
        </div>
      </aside>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';

const $q = useQuasar();
const route = useRoute();
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);

const { header: headerData, editorLocale, setEditorLocale, getStyleOverride } = useWebsiteEditor();

function handleScroll(): void {
  isScrolled.value = window.scrollY > 15;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false;
  },
);

watch(
  () => $q.screen.gt.sm,
  (isDesktop) => {
    if (isDesktop) isMobileMenuOpen.value = false;
  },
);
</script>
