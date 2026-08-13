<template>
  <header
    id="preview-section-header"
    class="site-header admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'header')"
  >
    <a
      href="javascript:void(0)"
      class="site-header__brand admin-image-hover-trigger"
      data-image-key="header.logo"
    >
      <img :src="headerData.logo" alt="Bot Builder" class="site-header__logo" />
    </a>
    <nav class="site-header__nav">
      <a
        href="javascript:void(0)"
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (headerData.nav.home = val))"
        >{{ headerData.nav.home }}</a
      >
      <a
        href="javascript:void(0)"
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (headerData.nav.promotions = val))"
        >{{ headerData.nav.promotions }}</a
      >
      <a
        href="javascript:void(0)"
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (headerData.nav.courses = val))"
        >{{ headerData.nav.courses }}</a
      >
      <a
        href="javascript:void(0)"
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (headerData.nav.resources = val))"
        >{{ headerData.nav.resources }}</a
      >
      <a
        href="javascript:void(0)"
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (headerData.nav.about = val))"
        >{{ headerData.nav.about }}</a
      >
    </nav>
    <div class="site-header__lang">
      <button
        type="button"
        class="site-header__lang-btn"
        :class="{ 'site-header__lang-btn--active': editorLocale === 'th-TH' }"
      >
        {{ editorLocale === 'th-TH' ? 'ไทย' : 'TH' }}
      </button>
      <span class="site-header__lang-divider">|</span>
      <button
        type="button"
        class="site-header__lang-btn"
        :class="{ 'site-header__lang-btn--active': editorLocale === 'en-US' }"
      >
        {{ editorLocale === 'th-TH' ? 'อังกฤษ' : 'EN' }}
      </button>
    </div>
    <q-btn flat round dense icon="menu" class="site-header__menu" aria-label="Open menu" />
    <AdminSectionBlockLayer section-id="header" />
  </header>
</template>

<script setup lang="ts">
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { onTextChange } from '@/utils/admin-helpers';

defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();

const { header: headerData, editorLocale } = useWebsiteEditor();
</script>
