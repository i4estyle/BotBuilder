<template>
  <section
    id="preview-section-about-mission"
    class="section section--muted about-grid admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'aboutMission')"
  >
    <div>
      <div class="section-heading section-heading--start">
        <h2
          data-style-key="aboutPage.missionHeading"
          contenteditable="true"
          class="section-heading__title admin-inline-editable"
          :style="getStyleOverride('aboutPage.missionHeading')"
          @blur="(e) => onTextChange(e, (val) => (aboutPageData.missionHeading = val))"
        >
          {{ aboutPageData.missionHeading }}
        </h2>
        <span class="section-heading__line" />
      </div>
      <p
        data-style-key="aboutPage.missionText"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('aboutPage.missionText')"
        @blur="(e) => onTextChange(e, (val) => (aboutPageData.missionText = val))"
      >
        {{ aboutPageData.missionText }}
      </p>
    </div>
    <div
      class="admin-image-hover-trigger"
      data-image-key="aboutPage.image"
      data-style-key="aboutPage.image"
      :style="getStyleOverride('aboutPage.image')"
    >
      <img :src="resolveAssetUrl(aboutPageData.image)" :alt="aboutPageData.imageAlt" />
      <div class="admin-image-hover-overlay">
        <q-icon name="photo_camera" size="32px" />
        <span>คลิกเพื่อเปลี่ยนรูปภาพ</span>
      </div>
    </div>
    <AdminSectionBlockLayer section-id="aboutMission" />
  </section>
</template>

<script setup lang="ts">
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { onTextChange } from '@/utils/admin-helpers';
import { resolveAssetUrl } from '@/utils/asset-helper';

defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();

const { aboutPage: aboutPageData, getStyleOverride } = useWebsiteEditor();
</script>
