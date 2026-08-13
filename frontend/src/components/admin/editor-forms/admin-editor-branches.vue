<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.heading') }}</label>
      <q-input v-model="branches.heading" outlined dense class="admin-input" />
    </div>

    <div v-for="(branch, index) in branches.items" :key="index" class="admin-card-editor">
      <header class="admin-card-editor__header">
        <span class="admin-card-editor__title">Branch #{{ index + 1 }}: {{ branch.name }}</span>
      </header>

      <div class="admin-field-group">
        <label class="admin-label">{{ t('admin.fields.name') }}</label>
        <q-input v-model="branch.name" outlined dense class="admin-input" />
      </div>

      <div class="admin-field-group">
        <label class="admin-label">{{ t('admin.fields.address') }}</label>
        <q-input v-model="branch.address" outlined dense class="admin-input" />
      </div>

      <div class="admin-field-group">
        <label class="admin-label">{{ t('admin.fields.description') }}</label>
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
        <label class="admin-label">{{ t('admin.fields.phone') }}</label>
        <q-input v-model="branch.phone" outlined dense class="admin-input" />
      </div>

      <div class="admin-field-group">
        <label class="admin-label">{{ t('admin.fields.contactName') }}</label>
        <q-input v-model="branch.contactName" outlined dense class="admin-input" />
      </div>

      <div class="admin-field-group">
        <label class="admin-label">{{ t('admin.fields.mapEmbedUrl') }}</label>
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
        <label class="admin-label">{{ t('admin.fields.hours') }}</label>
        <div v-for="(hour, hIndex) in branch.hours" :key="hIndex" class="admin-repeatable-row">
          <q-input v-model="hour.days" outlined dense placeholder="Days" class="admin-input" />
          <q-input v-model="hour.time" outlined dense placeholder="Time" class="admin-input" />
        </div>
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { t } = useI18n();
const { branches } = useWebsiteEditor();
</script>
