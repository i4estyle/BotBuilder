<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">หัวข้อหลัก (Heading)</label>
      <q-input v-model="gallery.heading" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">คำอธิบาย (Paragraph)</label>
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
      <label class="admin-label">ป้ายสถิติ 1: Course Certified</label>
      <q-input v-model="gallery.courseCertified" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ป้ายสถิติ 2: Skill Badges</label>
      <q-input v-model="gallery.skillBadges" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">รูปภาพประกาศนียบัตร (Certificate Image)</label>
      <div class="admin-image-picker">
        <img
          :src="resolveAssetUrl(gallery.certificateImage)"
          :alt="gallery.imageAlt"
          class="admin-image-picker__preview"
        />
        <q-file
          v-model="certificateFile"
          outlined
          dense
          accept="image/*"
          label="เปลี่ยนรูปประกาศนียบัตร"
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
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';
import { uploadImageFile } from '@/utils/upload-helper';

const { gallery } = useWebsiteEditor();
const certificateFile = ref<File | null>(null);

async function onImageChange(file: File | null): Promise<void> {
  if (!file) return;
  try {
    const uploadedUrl = await uploadImageFile(file);
    gallery.certificateImage = uploadedUrl;
  } catch {
    gallery.certificateImage = URL.createObjectURL(file);
  }
}
</script>
