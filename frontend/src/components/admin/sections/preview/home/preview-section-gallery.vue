<template>
  <section
    id="preview-section-gallery"
    class="gallery section section--muted admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'gallery')"
  >
    <div class="gallery__copy">
      <div class="section-heading">
        <h2
          contenteditable="true"
          class="admin-inline-editable"
          @blur="(e) => onTextChange(e, (val) => (galleryData.heading = val))"
        >
          {{ galleryData.heading }}
        </h2>
        <span class="section-heading__line" />
      </div>
      <p
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (galleryData.paragraph = val))"
      >
        {{ galleryData.paragraph }}
      </p>
      <div class="gallery__stats">
        <span
          contenteditable="true"
          class="admin-inline-editable"
          @blur="(e) => onTextChange(e, (val) => (galleryData.courseCertified = val))"
        >
          <q-icon name="verified" class="admin-icon-clickable" />
          {{ galleryData.courseCertified }}
        </span>
        <span
          contenteditable="true"
          class="admin-inline-editable"
          @blur="(e) => onTextChange(e, (val) => (galleryData.skillBadges = val))"
        >
          <q-icon name="emoji_events" class="admin-icon-clickable" />
          {{ galleryData.skillBadges }}
        </span>
      </div>
    </div>
    <div
      class="gallery__image-wrapper admin-image-hover-trigger"
      data-image-key="gallery.certificateImage"
    >
      <img :src="galleryData.certificateImage" :alt="galleryData.imageAlt" class="gallery__image" />
      <div class="admin-image-hover-overlay">
        <q-icon name="photo_camera" size="28px" />
        <span>ปรับแต่งรูปประกาศนียบัตร</span>
      </div>
    </div>
    <AdminSectionBlockLayer section-id="gallery" />
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

const { gallery: galleryData } = useWebsiteEditor();
</script>
