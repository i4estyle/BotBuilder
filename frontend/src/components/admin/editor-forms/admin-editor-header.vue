<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.logo') }}</label>
      <div class="admin-image-picker">
        <img :src="header.logo" alt="Logo preview" class="admin-image-picker__preview" />
        <q-file
          v-model="logoFile"
          outlined
          dense
          accept="image/*"
          label="Change Logo Image"
          class="admin-input"
          @update:model-value="onLogoChange"
        >
          <template #prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
      </div>
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Nav Link: Home</label>
      <q-input v-model="header.nav.home" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Nav Link: Promotions</label>
      <q-input v-model="header.nav.promotions" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Nav Link: Courses</label>
      <q-input v-model="header.nav.courses" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Nav Link: Resources</label>
      <q-input v-model="header.nav.resources" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Nav Link: About Us</label>
      <q-input v-model="header.nav.about" outlined dense class="admin-input" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { t } = useI18n();
const { header } = useWebsiteEditor();
const logoFile = ref<File | null>(null);

function onLogoChange(file: File | null): void {
  if (!file) return;
  header.logo = URL.createObjectURL(file);
}
</script>
