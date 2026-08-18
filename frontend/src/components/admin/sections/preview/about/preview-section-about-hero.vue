<template>
  <section
    id="preview-section-about-hero"
    class="admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'aboutHero')"
  >
    <div class="page-hero">
      <p
        data-style-key="aboutPage.eyebrow"
        contenteditable="true"
        class="page-hero__eyebrow admin-inline-editable"
        :style="getStyleOverride('aboutPage.eyebrow')"
        @blur="(e) => onTextChange(e, (val) => (aboutPageData.eyebrow = val))"
      >
        {{ aboutPageData.eyebrow }}
      </p>
      <h1
        data-style-key="aboutPage.title"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('aboutPage.title')"
        @blur="(e) => onTextChange(e, (val) => (aboutPageData.title = val))"
      >
        {{ aboutPageData.title }}
      </h1>
      <span />
      <div class="page-hero__subtitle">
        <p
          data-style-key="aboutPage.intro"
          contenteditable="true"
          class="admin-inline-editable"
          :style="getStyleOverride('aboutPage.intro')"
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

const { aboutPage: aboutPageData, getStyleOverride } = useWebsiteEditor();
</script>
