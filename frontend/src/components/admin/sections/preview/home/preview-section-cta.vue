<template>
  <section
    id="preview-section-cta"
    class="cta admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'cta')"
  >
    <div class="cta__dots" />
    <h2
      data-style-key="cta.heading"
      contenteditable="true"
      class="admin-inline-editable"
      :style="getStyleOverride('cta.heading')"
      @blur="(e) => onTextChange(e, (val) => (ctaData.heading = val))"
    >
      {{ ctaData.heading }}
    </h2>
    <p
      data-style-key="cta.paragraph"
      contenteditable="true"
      class="admin-inline-editable"
      :style="getStyleOverride('cta.paragraph')"
      @blur="(e) => onTextChange(e, (val) => (ctaData.paragraph = val))"
    >
      {{ ctaData.paragraph }}
    </p>
    <AppButton variant="green">
      <span
        data-style-key="cta.button"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('cta.button')"
        @blur="(e) => onTextChange(e, (val) => (ctaData.button = val))"
        >{{ ctaData.button }}</span
      >
    </AppButton>
    <AdminSectionBlockLayer section-id="cta" />
  </section>
</template>

<script setup lang="ts">
import AppButton from '@/components/landing/AppButton.vue';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { onTextChange } from '@/utils/admin-helpers';

defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();

const { cta: ctaData, getStyleOverride } = useWebsiteEditor();
</script>
