<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">โลโก้เว็บไซต์ (Logo)</label>
      <div class="admin-image-picker">
        <img
          :src="resolveAssetUrl(header.logo)"
          alt="Logo preview"
          class="admin-image-picker__preview"
        />
        <q-file
          v-model="logoFile"
          outlined
          dense
          accept="image/*"
          label="เปลี่ยนรูปโลโก้"
          class="admin-input"
          @update:model-value="onLogoChange"
        >
          <template #prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
      </div>
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ลิงก์เมนู: หน้าหลัก (Home)</label>
      <q-input v-model="header.nav.home" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ลิงก์เมนู: โปรโมชั่น (Promotions)</label>
      <q-input v-model="header.nav.promotions" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ลิงก์เมนู: คอร์สเรียน (Courses)</label>
      <q-input v-model="header.nav.courses" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ลิงก์เมนู: คลังความรู้ (Resources)</label>
      <q-input v-model="header.nav.resources" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ลิงก์เมนู: เกี่ยวกับเรา (About Us)</label>
      <q-input v-model="header.nav.about" outlined dense class="admin-input" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';
import { uploadImageFile } from '@/utils/upload-helper';

const { header } = useWebsiteEditor();
const logoFile = ref<File | null>(null);

async function onLogoChange(file: File | null): Promise<void> {
  if (!file) return;
  try {
    const uploadedUrl = await uploadImageFile(file);
    header.logo = uploadedUrl;
  } catch {
    header.logo = URL.createObjectURL(file);
  }
}
</script>
