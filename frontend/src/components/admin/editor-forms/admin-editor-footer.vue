<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">ชื่อแบรนด์ (Brand Title)</label>
      <q-input v-model="footer.brandTitle" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">คำอธิบายแบรนด์ (Brand Text)</label>
      <q-input
        v-model="footer.brandText"
        type="textarea"
        rows="3"
        outlined
        dense
        class="admin-input"
      />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">หัวข้อลิงก์ด่วน (Quick Links Heading)</label>
      <q-input v-model="footer.quickLinks" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ลิงก์คอร์สเรียน (Courses)</label>
      <q-input v-model="footer.courses" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ลิงก์เกี่ยวกับเรา (About Us)</label>
      <q-input v-model="footer.aboutUs" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ลิงก์คลังความรู้ (Resources)</label>
      <q-input v-model="footer.resources" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">หัวข้อช่วยเหลือ (Support Heading)</label>
      <q-input v-model="footer.support" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ลิงก์โปรโมชั่น (Promotion)</label>
      <q-input v-model="footer.promotion" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ข้อความลิขสิทธิ์ (Copyright)</label>
      <q-input v-model="footer.copyright" outlined dense class="admin-input" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { footer } = useWebsiteEditor();
</script>
