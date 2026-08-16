<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">หัวข้อหลัก (Heading)</label>
      <q-input v-model="quiz.heading" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">คำอธิบาย (Paragraph)</label>
      <q-input
        v-model="quiz.paragraph"
        type="textarea"
        rows="3"
        outlined
        dense
        class="admin-input"
      />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">ข้อความปุ่มกด (Button Text)</label>
      <q-input v-model="quiz.cta" outlined dense class="admin-input" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { quiz } = useWebsiteEditor();
</script>
