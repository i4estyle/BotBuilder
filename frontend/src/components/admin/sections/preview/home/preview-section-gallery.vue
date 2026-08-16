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
          data-style-key="gallery.heading"
          contenteditable="true"
          class="admin-inline-editable"
          :style="getStyleOverride('gallery.heading')"
          @blur="(e) => onTextChange(e, (val) => (galleryData.heading = val))"
        >
          {{ galleryData.heading }}
        </h2>
        <span class="section-heading__line" />
      </div>
      <p
        data-style-key="gallery.paragraph"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('gallery.paragraph')"
        @blur="(e) => onTextChange(e, (val) => (galleryData.paragraph = val))"
      >
        {{ galleryData.paragraph }}
      </p>
      <div class="gallery__stats">
        <span
          data-style-key="gallery.courseCertified"
          contenteditable="true"
          class="admin-inline-editable"
          :style="getStyleOverride('gallery.courseCertified')"
          @blur="(e) => onTextChange(e, (val) => (galleryData.courseCertified = val))"
        >
          <q-icon name="verified" class="admin-icon-clickable" />
          {{ galleryData.courseCertified }}
        </span>
        <span
          data-style-key="gallery.skillBadges"
          contenteditable="true"
          class="admin-inline-editable"
          :style="getStyleOverride('gallery.skillBadges')"
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
      data-style-key="gallery.certificateImage"
      :style="getStyleOverride('gallery.certificateImage')"
    >
      <img
        :src="resolveAssetUrl(galleryData.certificateImage)"
        :alt="galleryData.imageAlt"
        class="gallery__image"
      />
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
import { resolveAssetUrl } from '@/utils/asset-helper';

defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();

const { gallery: galleryData, getStyleOverride } = useWebsiteEditor();
</script>
