<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.heading') }}</label>
      <q-input v-model="gallery.heading" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.paragraph') }}</label>
      <q-input
        v-model="gallery.paragraph"
        type="textarea"
        rows="3"
        outlined
        dense
        class="admin-input"
      />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Stat Badge 1: Course Certified</label>
      <q-input v-model="gallery.courseCertified" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Stat Badge 2: Skill Badges</label>
      <q-input v-model="gallery.skillBadges" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Certificate Image</label>
      <div class="admin-image-picker">
        <img
          :src="gallery.certificateImage"
          :alt="gallery.imageAlt"
          class="admin-image-picker__preview"
        />
        <q-file
          v-model="certificateFile"
          outlined
          dense
          accept="image/*"
          label="Change Certificate Image"
          class="admin-input"
          @update:model-value="onImageChange"
        >
          <template #prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { t } = useI18n();
const { gallery } = useWebsiteEditor();
const certificateFile = ref<File | null>(null);

function onImageChange(file: File | null): void {
  if (!file) return;
  gallery.certificateImage = URL.createObjectURL(file);
}
</script>
