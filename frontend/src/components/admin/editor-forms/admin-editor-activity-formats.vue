<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.heading') }}</label>
      <q-input v-model="activityFormats.heading" outlined dense class="admin-input" />
    </div>

    <div v-for="(item, index) in activityFormats.items" :key="index" class="admin-card-editor">
      <header class="admin-card-editor__header">
        <span class="admin-card-editor__title">Activity Format #{{ index + 1 }}</span>
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
            :disabled="index === activityFormats.items.length - 1"
            @click="moveDown(index)"
          />
          <q-btn
            flat
            round
            dense
            color="negative"
            icon="delete"
            :disabled="activityFormats.items.length <= 1"
            @click="removeItem(index)"
          />
        </div>
      </header>

      <div class="admin-field-group">
        <label class="admin-label">{{ t('admin.fields.image') }}</label>
        <div class="admin-image-picker">
          <img :src="item.image" :alt="item.title" class="admin-image-picker__preview" />
          <q-file
            :model-value="null"
            outlined
            dense
            accept="image/*"
            label="Change Image"
            class="admin-input"
            @update:model-value="(file) => onImageChange(file, index)"
          >
            <template #prepend>
              <q-icon name="cloud_upload" />
            </template>
          </q-file>
        </div>
      </div>

      <div class="admin-field-group">
        <label class="admin-label">{{ t('admin.fields.title') }}</label>
        <q-input v-model="item.title" outlined dense class="admin-input" />
      </div>

      <div class="admin-field-group">
        <label class="admin-label">{{ t('admin.fields.description') }}</label>
        <q-input
          v-model="item.description"
          type="textarea"
          rows="3"
          outlined
          dense
          class="admin-input"
        />
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
import starterImageDefault from '@/assets/landing/playlearn.png';
import { useWebsiteEditor, type ActivityFormatItem } from '@/composables/use-website-editor';

const { t } = useI18n();
const { activityFormats } = useWebsiteEditor();

function onImageChange(file: File | null, index: number): void {
  if (!file) return;
  const item = activityFormats.items[index];
  if (item) item.image = URL.createObjectURL(file);
}

function addItem(): void {
  const newItem: ActivityFormatItem = {
    image: starterImageDefault,
    title: 'New Activity Format',
    description: 'Description of the activity format.',
  };
  activityFormats.items.push(newItem);
}

function removeItem(index: number): void {
  if (activityFormats.items.length > 1) {
    activityFormats.items.splice(index, 1);
  }
}

function moveUp(index: number): void {
  if (index > 0) {
    const item = activityFormats.items.splice(index, 1)[0];
    if (item) activityFormats.items.splice(index - 1, 0, item);
  }
}

function moveDown(index: number): void {
  if (index < activityFormats.items.length - 1) {
    const item = activityFormats.items.splice(index, 1)[0];
    if (item) activityFormats.items.splice(index + 1, 0, item);
  }
}
</script>
