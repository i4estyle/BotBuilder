<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">Brand Title</label>
      <q-input v-model="footer.brandTitle" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Brand Description Text</label>
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
      <label class="admin-label">Quick Links Heading</label>
      <q-input v-model="footer.quickLinks" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Link: Courses</label>
      <q-input v-model="footer.courses" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Link: About Us</label>
      <q-input v-model="footer.aboutUs" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Link: Resources</label>
      <q-input v-model="footer.resources" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Support Heading</label>
      <q-input v-model="footer.support" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Link: Promotion</label>
      <q-input v-model="footer.promotion" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.copyright') }}</label>
      <q-input v-model="footer.copyright" outlined dense class="admin-input" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { t } = useI18n();
const { footer } = useWebsiteEditor();
</script>
