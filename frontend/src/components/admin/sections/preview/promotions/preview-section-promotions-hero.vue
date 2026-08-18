<template>
  <section
    id="preview-section-promotions-hero"
    class="promotions-hero admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'promotionsHero')"
  >
    <p
      data-style-key="promotionsPage.eyebrow"
      contenteditable="true"
      class="promotions-hero__eyebrow admin-inline-editable"
      :style="getStyleOverride('promotionsPage.eyebrow')"
      @blur="(e) => onTextChange(e, (val) => (promotionsPageData.eyebrow = val))"
    >
      {{ promotionsPageData.eyebrow }}
    </p>
    <h1
      data-style-key="promotionsPage.title"
      contenteditable="true"
      class="admin-inline-editable"
      :style="getStyleOverride('promotionsPage.title')"
      @blur="(e) => onTextChange(e, (val) => (promotionsPageData.title = val))"
    >
      {{ promotionsPageData.title }}
    </h1>
    <span class="promotions-hero__line" />
    <p
      data-style-key="promotionsPage.subtitle"
      contenteditable="true"
      class="promotions-hero__subtitle admin-inline-editable"
      :style="getStyleOverride('promotionsPage.subtitle')"
      @blur="(e) => onTextChange(e, (val) => (promotionsPageData.subtitle = val))"
    >
      {{ promotionsPageData.subtitle }}
    </p>
    <AdminSectionBlockLayer section-id="promotionsHero" />
  </section>
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

const { promotionsPage: promotionsPageData, getStyleOverride } = useWebsiteEditor();
</script>
