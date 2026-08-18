<template>
  <section
    id="preview-section-courses-hero"
    class="admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'coursesHero')"
  >
    <div class="page-hero">
      <p
        data-style-key="coursesPage.eyebrow"
        contenteditable="true"
        class="page-hero__eyebrow admin-inline-editable"
        :style="getStyleOverride('coursesPage.eyebrow')"
        @blur="(e) => onTextChange(e, (val) => (coursesPageData.eyebrow = val))"
      >
        {{ coursesPageData.eyebrow }}
      </p>
      <h1
        data-style-key="coursesPage.title"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('coursesPage.title')"
        @blur="(e) => onTextChange(e, (val) => (coursesPageData.title = val))"
      >
        {{ coursesPageData.title }}
      </h1>
      <span />
      <div class="page-hero__subtitle">
        <p
          data-style-key="coursesPage.paragraph"
          contenteditable="true"
          class="admin-inline-editable"
          :style="getStyleOverride('coursesPage.paragraph')"
          @blur="(e) => onTextChange(e, (val) => (coursesPageData.paragraph = val))"
        >
          {{ coursesPageData.paragraph }}
        </p>
      </div>
    </div>
    <AdminSectionBlockLayer section-id="coursesHero" />
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

const { coursesPage: coursesPageData, getStyleOverride } = useWebsiteEditor();
</script>
