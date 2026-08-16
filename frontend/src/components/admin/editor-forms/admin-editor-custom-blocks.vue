<template>
  <div class="admin-editor-form">
    <div v-for="(block, index) in customBlocks" :key="block.id" class="admin-card-editor">
      <header class="admin-card-editor__header">
        <span class="admin-card-editor__title">
          #{{ index + 1 }} {{ block.type === 'text' ? 'กล่องข้อความ' : 'รูปภาพ' }}
        </span>
        <div class="admin-card-editor__actions">
          <q-btn flat round dense color="negative" icon="delete" @click="removeSection(block.id)" />
        </div>
      </header>

      <div class="admin-field-group">
        <label class="admin-label">ชื่อหัวข้อ (Title)</label>
        <q-input v-model="block.title" outlined dense class="admin-input" />
      </div>

      <div v-if="block.type === 'text'" class="admin-field-group">
        <label class="admin-label">เนื้อหาข้อความ (Content)</label>
        <q-input
          v-model="block.content"
          type="textarea"
          rows="3"
          outlined
          dense
          class="admin-input"
        />
      </div>

      <div v-else-if="block.type === 'image'" class="admin-field-group">
        <label class="admin-label">รูปภาพ (Image)</label>
        <div class="admin-image-picker">
          <img
            :src="resolveAssetUrl(block.image)"
            alt="Custom Image"
            class="admin-image-picker__preview"
          />
          <q-file
            :model-value="null"
            outlined
            dense
            accept="image/*"
            label="เปลี่ยนรูป"
            class="admin-input"
            @update:model-value="(file) => onCustomImageChange(file, block)"
          >
            <template #prepend>
              <q-icon name="cloud_upload" />
            </template>
          </q-file>
        </div>
      </div>
    </div>

    <p v-if="customBlocks.length === 0" class="text-caption text-grey-7">
      ยังไม่มีองค์ประกอบอิสระ กดปุ่มด้านบนเพื่อเพิ่มกล่องข้อความหรือรูปภาพลงในหน้าเว็บได้ทันที
    </p>
  </div>
</template>

<script setup lang="ts">
import { useWebsiteEditor, type CustomBlockItem } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';
import { uploadImageFile } from '@/utils/upload-helper';

const { customBlocks, removeSection } = useWebsiteEditor();

async function onCustomImageChange(file: File | null, block: CustomBlockItem): Promise<void> {
  if (!file) return;
  try {
    const uploadedUrl = await uploadImageFile(file);
    block.image = uploadedUrl;
  } catch {
    block.image = URL.createObjectURL(file);
  }
}
</script>
