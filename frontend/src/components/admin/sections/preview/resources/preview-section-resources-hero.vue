<template>
  <section
    id="preview-section-resources-hero"
    class="admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'resourcesHero')"
  >
    <div class="page-hero">
      <p
        contenteditable="true"
        class="page-hero__eyebrow admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (resourcesPageData.eyebrow = val))"
      >
        {{ resourcesPageData.eyebrow }}
      </p>
      <h1
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (resourcesPageData.title = val))"
      >
        {{ resourcesPageData.title }}
      </h1>
      <span />
      <div class="page-hero__subtitle">
        <p
          contenteditable="true"
          class="admin-inline-editable"
          @blur="(e) => onTextChange(e, (val) => (resourcesPageData.paragraph = val))"
        >
          {{ resourcesPageData.paragraph }}
        </p>
      </div>
    </div>
    <AdminSectionBlockLayer section-id="resourcesHero" />
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

const { resourcesPage: resourcesPageData } = useWebsiteEditor();
</script>
