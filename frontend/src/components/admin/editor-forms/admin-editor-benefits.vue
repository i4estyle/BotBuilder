<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.heading') }}</label>
      <q-input v-model="benefits.heading" outlined dense class="admin-input" />
    </div>

    <div v-for="(item, index) in benefits.items" :key="index" class="admin-card-editor">
      <header class="admin-card-editor__header">
        <span class="admin-card-editor__title">Benefit Card #{{ index + 1 }}</span>
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
        <label class="admin-label">{{ t('admin.fields.icon') }} (Material Icon name)</label>
        <q-input v-model="item.icon" outlined dense class="admin-input">
          <template #prepend>
            <q-icon :name="item.icon || 'star'" />
          </template>
        </q-input>
      </div>

      <div class="admin-field-group">
        <label class="admin-label">{{ t('admin.fields.title') }}</label>
        <q-input v-model="item.title" outlined dense class="admin-input" />
      </div>

      <div class="admin-field-group">
        <label class="admin-label">{{ t('admin.fields.description') }}</label>
        <q-input v-model="item.text" type="textarea" rows="3" outlined dense class="admin-input" />
      </div>
    </div>

    <q-btn
      outline
      color="positive"
      icon="add"
      :label="t('admin.fields.addItem')"
      class="admin-add-btn"
      @click="addItem"
    />
  </q-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useWebsiteEditor, type BenefitItem } from '@/composables/use-website-editor';

const { t } = useI18n();
const { benefits } = useWebsiteEditor();

function addItem(): void {
  const newItem: BenefitItem = {
    icon: 'star',
    title: 'NEW BENEFIT',
    text: 'Description of the benefit goes here.',
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
