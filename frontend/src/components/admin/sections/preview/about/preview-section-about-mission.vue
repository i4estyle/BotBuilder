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
          contenteditable="true"
          class="section-heading__title admin-inline-editable"
          @blur="(e) => onTextChange(e, (val) => (aboutPageData.missionHeading = val))"
        >
          {{ aboutPageData.missionHeading }}
        </h2>
        <span class="section-heading__line" />
      </div>
      <p
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (aboutPageData.missionText = val))"
      >
        {{ aboutPageData.missionText }}
      </p>
    </div>
    <div class="admin-image-hover-trigger" data-image-key="aboutPage.image">
      <img :src="aboutPageData.image" :alt="aboutPageData.imageAlt" />
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

defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();

const { aboutPage: aboutPageData } = useWebsiteEditor();
</script>
