<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.heading') }}</label>
      <q-input v-model="activityGallery.heading" outlined dense class="admin-input" />
    </div>

    <div
      v-for="(group, groupIndex) in activityGallery.groups"
      :key="groupIndex"
      class="admin-card-editor"
    >
      <header class="admin-card-editor__header">
        <span class="admin-card-editor__title">Photo Group #{{ groupIndex + 1 }}</span>
      </header>

      <div class="admin-field-group">
        <label class="admin-label">Group Title</label>
        <q-input v-model="group.title" outlined dense class="admin-input" />
      </div>

      <div class="admin-field-group">
        <label class="admin-label">Photos in this group</label>
        <div
          v-for="(photo, photoIndex) in group.photos"
          :key="photoIndex"
          class="admin-repeatable-row admin-repeatable-row--image"
        >
          <img :src="photo.src" :alt="photo.alt" class="admin-thumbnail" />
          <q-input
            v-model="photo.alt"
            outlined
            dense
            placeholder="Image Alt text"
            class="admin-input"
          />
          <q-file
            :model-value="null"
            outlined
            dense
            accept="image/*"
            label="Upload"
            class="admin-file-compact"
            @update:model-value="(file) => onPhotoUpload(file, groupIndex, photoIndex)"
          />
          <q-btn
            flat
            round
            dense
            color="negative"
            icon="delete"
            :disabled="group.photos.length <= 1"
            @click="removePhoto(groupIndex, photoIndex)"
          />
        </div>
        <q-btn
          outline
          color="positive"
          icon="add_a_photo"
          label="Add Photo"
          class="admin-add-btn"
          @click="addPhoto(groupIndex)"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import promotionsPhotoDefault from '@/assets/landing/promotions.png';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { t } = useI18n();
const { activityGallery } = useWebsiteEditor();

function onPhotoUpload(file: File | null, groupIndex: number, photoIndex: number): void {
  if (!file) return;
  const group = activityGallery.groups[groupIndex];
  if (group) {
    const photo = group.photos[photoIndex];
    if (photo) photo.src = URL.createObjectURL(file);
  }
}

function addPhoto(groupIndex: number): void {
  const group = activityGallery.groups[groupIndex];
  if (group) {
    group.photos.push({
      src: promotionsPhotoDefault,
      alt: 'New activity photo',
    });
  }
}

function removePhoto(groupIndex: number, photoIndex: number): void {
  const group = activityGallery.groups[groupIndex];
  if (group && group.photos.length > 1) {
    group.photos.splice(photoIndex, 1);
  }
}
</script>
