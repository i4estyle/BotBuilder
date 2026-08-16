<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">หัวข้อหลัก (Heading)</label>
      <q-input v-model="benefits.heading" outlined dense class="admin-input" />
    </div>

    <div v-for="(item, index) in benefits.items" :key="index" class="admin-card-editor">
      <header class="admin-card-editor__header">
        <span class="admin-card-editor__title">การ์ดจุดเด่น #{{ index + 1 }}</span>
        <div class="admin-card-editor__actions">
          <q-btn
            flat
            round
            dense
            icon="arrow_upward"
            :disabled="index === 0"
            @click="moveUp(index)"
          />
          <q-btn
            flat
            round
            dense
            icon="arrow_downward"
            :disabled="index === benefits.items.length - 1"
            @click="moveDown(index)"
          />
          <q-btn
            flat
            round
            dense
            color="negative"
            icon="delete"
            :disabled="benefits.items.length <= 1"
            @click="removeItem(index)"
          />
        </div>
      </header>

      <div class="admin-field-group">
        <label class="admin-label">ไอคอน (Material Icon name)</label>
        <q-input v-model="item.icon" outlined dense class="admin-input">
          <template #prepend>
            <q-icon :name="item.icon || 'star'" />
          </template>
        </q-input>
      </div>

      <div class="admin-field-group">
        <label class="admin-label">หัวข้อจุดเด่น (Title)</label>
        <q-input v-model="item.title" outlined dense class="admin-input" />
      </div>

      <div class="admin-field-group">
        <label class="admin-label">คำอธิบาย (Description)</label>
        <q-input v-model="item.text" type="textarea" rows="3" outlined dense class="admin-input" />
      </div>
    </div>

    <q-btn
      outline
      color="positive"
      icon="add"
      label="เพิ่มจุดเด่น"
      class="admin-add-btn"
      @click="addItem"
    />
  </q-form>
</template>

<script setup lang="ts">
import { useWebsiteEditor, type BenefitItem } from '@/composables/use-website-editor';

const { benefits } = useWebsiteEditor();

function addItem(): void {
  const newItem: BenefitItem = {
    icon: 'star',
    title: 'จุดเด่นใหม่',
    text: 'รายละเอียดของจุดเด่น',
  };
  benefits.items.push(newItem);
}

function removeItem(index: number): void {
  if (benefits.items.length > 1) {
    benefits.items.splice(index, 1);
  }
}

function moveUp(index: number): void {
  if (index > 0) {
    const item = benefits.items.splice(index, 1)[0];
    if (item) benefits.items.splice(index - 1, 0, item);
  }
}

function moveDown(index: number): void {
  if (index < benefits.items.length - 1) {
    const item = benefits.items.splice(index, 1)[0];
    if (item) benefits.items.splice(index + 1, 0, item);
  }
}
</script>
