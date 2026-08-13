<template>
  <section
    id="preview-section-about-hero"
    class="admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'aboutHero')"
  >
    <div class="page-hero">
      <p
        contenteditable="true"
        class="page-hero__eyebrow admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (aboutPageData.eyebrow = val))"
      >
        {{ aboutPageData.eyebrow }}
      </p>
      <h1
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (aboutPageData.title = val))"
      >
        {{ aboutPageData.title }}
      </h1>
      <span />
      <div class="page-hero__subtitle">
        <p
          contenteditable="true"
          class="admin-inline-editable"
          @blur="(e) => onTextChange(e, (val) => (aboutPageData.intro = val))"
        >
          {{ aboutPageData.intro }}
        </p>
      </div>
    </div>
    <AdminSectionBlockLayer section-id="aboutHero" />
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

const { aboutPage: aboutPageData } = useWebsiteEditor();
</script>
