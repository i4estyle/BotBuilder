<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">หัวข้อหลัก (Heading)</label>
      <q-input v-model="branches.heading" outlined dense class="admin-input" />
    </div>

    <div v-for="(branch, index) in branches.items" :key="index" class="admin-card-editor">
      <header class="admin-card-editor__header">
        <span class="admin-card-editor__title">สาขาที่ {{ index + 1 }}: {{ branch.name }}</span>
      </header>

      <div class="admin-field-group">
        <label class="admin-label">ชื่อสาขา</label>
        <q-input v-model="branch.name" outlined dense class="admin-input" />
      </div>

      <div class="admin-field-group">
        <label class="admin-label">ที่อยู่สาขา</label>
        <q-input v-model="branch.address" outlined dense class="admin-input" />
      </div>

      <div class="admin-field-group">
        <label class="admin-label">คำอธิบายสาขา</label>
        <q-input
          v-model="branch.description"
          type="textarea"
          rows="3"
          outlined
          dense
          class="admin-input"
        />
      </div>

      <div class="admin-field-group">
        <label class="admin-label">เบอร์โทรศัพท์</label>
        <q-input v-model="branch.phone" outlined dense class="admin-input" />
      </div>

      <div class="admin-field-group">
        <label class="admin-label">ชื่อผู้ติดต่อ / ครูประจำสาขา</label>
        <q-input v-model="branch.contactName" outlined dense class="admin-input" />
      </div>

      <div class="admin-field-group">
        <label class="admin-label">Google Maps Embed URL</label>
        <q-input
          v-model="branch.mapEmbedUrl"
          type="textarea"
          rows="2"
          outlined
          dense
          class="admin-input"
        />
      </div>

      <div class="admin-field-group">
        <label class="admin-label">วันและเวลาทำการ</label>
        <div v-for="(hour, hIndex) in branch.hours" :key="hIndex" class="admin-repeatable-row">
          <q-input v-model="hour.days" outlined dense placeholder="วันทำการ" class="admin-input" />
          <q-input v-model="hour.time" outlined dense placeholder="เวลาทำการ" class="admin-input" />
        </div>
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { branches } = useWebsiteEditor();
</script>
