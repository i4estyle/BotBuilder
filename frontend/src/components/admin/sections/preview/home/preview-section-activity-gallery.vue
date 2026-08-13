<template>
  <section
    id="preview-section-activityGallery"
    class="section activity-gallery admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'activityGallery')"
  >
    <div class="section-heading section-heading--centered">
      <h2
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (activityGalleryData.heading = val))"
      >
        {{ activityGalleryData.heading }}
      </h2>
      <span class="section-heading__line" />
    </div>
    <div class="activity-gallery__columns">
      <div
        v-for="(group, groupIndex) in activityGalleryData.groups"
        :key="groupIndex"
        class="activity-gallery__column"
      >
        <h3
          contenteditable="true"
          class="activity-gallery__column-title admin-inline-editable"
          @blur="(e) => onTextChange(e, (val) => (group.title = val))"
        >
          {{ group.title }}
        </h3>
        <div class="admin-preview-gallery-grid">
          <div
            v-for="(photo, photoIndex) in group.photos"
            :key="photoIndex"
            class="admin-image-hover-trigger"
            data-image-key="activityGallery.photo"
            :data-group-index="groupIndex"
            :data-photo-index="photoIndex"
          >
            <img :src="photo.src" :alt="photo.alt" class="admin-preview-gallery-thumb" />
            <div class="admin-image-hover-overlay admin-image-hover-overlay--compact">
              <q-icon name="photo_camera" size="18px" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <AdminSectionBlockLayer section-id="activityGallery" />
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

const { activityGallery: activityGalleryData } = useWebsiteEditor();
</script>
