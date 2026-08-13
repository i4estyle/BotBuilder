<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.heading') }}</label>
      <q-input v-model="quiz.heading" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.paragraph') }}</label>
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
      <label class="admin-label">{{ t('admin.fields.buttonText') }}</label>
      <q-input v-model="quiz.cta" outlined dense class="admin-input" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { t } = useI18n();
const { quiz } = useWebsiteEditor();
</script>
