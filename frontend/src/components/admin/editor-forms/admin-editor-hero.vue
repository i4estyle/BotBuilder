<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">รูปภาพหลัก (Hero Image)</label>
      <div class="admin-image-picker">
        <img
          :src="resolveAssetUrl(hero.image)"
          :alt="hero.imageAlt"
          class="admin-image-picker__preview"
        />
        <q-file
          v-model="heroImageFile"
          outlined
          dense
          accept="image/*"
          label="เปลี่ยนรูปภาพ Hero"
          class="admin-input"
          @update:model-value="onImageChange"
        >
          <template #prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
      </div>
    </div>

    <div class="admin-field-group">
      <label class="admin-label">หัวข้อหลักเน้นสีแดง (Title Highlight)</label>
      <q-input v-model="hero.titleHighlight" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">หัวข้อต่อท้าย (Title Rest)</label>
      <q-input v-model="hero.titleRest" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ข้อความรายละเอียด (Paragraph)</label>
      <q-input
        v-model="hero.paragraph"
        type="textarea"
        rows="4"
        outlined
        dense
        class="admin-input"
      />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">รายการทักษะที่ได้รับ (Skills)</label>
      <div v-for="(_, index) in hero.skills" :key="index" class="admin-repeatable-row">
        <q-input v-model="hero.skills[index]" outlined dense class="admin-input" />
        <q-btn
          flat
          round
          dense
          color="negative"
          icon="delete"
          :disabled="hero.skills.length <= 1"
          @click="removeSkill(index)"
        />
      </div>
      <q-btn
        outline
        color="positive"
        icon="add"
        label="เพิ่มทักษะ"
        class="admin-add-btn"
        @click="addSkill"
      />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ข้อความการจอง (Booking Note)</label>
      <q-input
        v-model="hero.bookingNote"
        type="textarea"
        rows="2"
        outlined
        dense
        class="admin-input"
      />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ข้อความปุ่มกด (CTA Label)</label>
      <q-input v-model="hero.ctaLabel" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ข้อความสาขาบางแสน</label>
      <q-input v-model="hero.ctaBangsaen" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ข้อความสาขาศรีราชา</label>
      <q-input v-model="hero.ctaSriracha" outlined dense class="admin-input" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';
import { uploadImageFile } from '@/utils/upload-helper';

const { hero } = useWebsiteEditor();
const heroImageFile = ref<File | null>(null);

async function onImageChange(file: File | null): Promise<void> {
  if (!file) return;
  try {
    const uploadedUrl = await uploadImageFile(file);
    hero.image = uploadedUrl;
  } catch {
    hero.image = URL.createObjectURL(file);
  }
}

function addSkill(): void {
  hero.skills.push('ทักษะใหม่');
}

function removeSkill(index: number): void {
  if (hero.skills.length > 1) {
    hero.skills.splice(index, 1);
  }
}
</script>
