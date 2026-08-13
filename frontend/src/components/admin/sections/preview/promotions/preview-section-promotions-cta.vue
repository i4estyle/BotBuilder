<template>
  <section
    id="preview-section-promotions-cta"
    class="promotion-cta admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'promotionsCta')"
  >
    <div>
      <p
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (promotionsPageData.cta.eyebrow = val))"
      >
        {{ promotionsPageData.cta.eyebrow }}
      </p>
      <h2
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (promotionsPageData.cta.heading = val))"
      >
        {{ promotionsPageData.cta.heading }}
      </h2>
    </div>
    <a href="javascript:void(0)" class="promotion-cta__button">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path
          d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z"
        />
      </svg>
      <span
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (promotionsPageData.cta.button = val))"
      >
        {{ promotionsPageData.cta.button }}
      </span>
    </a>
    <AdminSectionBlockLayer section-id="promotionsCta" />
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

const { promotionsPage: promotionsPageData } = useWebsiteEditor();
</script>
