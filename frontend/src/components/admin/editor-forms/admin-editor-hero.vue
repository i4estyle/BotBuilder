<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.image') }}</label>
      <div class="admin-image-picker">
        <img :src="hero.image" :alt="hero.imageAlt" class="admin-image-picker__preview" />
        <q-file
          v-model="heroImageFile"
          outlined
          dense
          accept="image/*"
          label="Change Hero Image"
          class="admin-input"
          @update:model-value="onImageChange"
        >
          <template #prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
      </div>
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Title Highlight (Red text)</label>
      <q-input v-model="hero.titleHighlight" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">Title Rest (Green text)</label>
      <q-input v-model="hero.titleRest" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.paragraph') }}</label>
      <q-input
        v-model="hero.paragraph"
        type="textarea"
        rows="4"
        outlined
        dense
        class="admin-input"
      />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.skills') }}</label>
      <div v-for="(_, index) in hero.skills" :key="index" class="admin-repeatable-row">
        <q-input v-model="hero.skills[index]" outlined dense class="admin-input" />
        <q-btn
          flat
          round
          dense
          color="negative"
          icon="delete"
          :disabled="hero.skills.length <= 1"
          @click="removeSkill(index)"
        />
      </div>
      <q-btn
        outline
        color="positive"
        icon="add"
        :label="t('admin.fields.addItem')"
        class="admin-add-btn"
        @click="addSkill"
      />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.bookingNote') }}</label>
      <q-input
        v-model="hero.bookingNote"
        type="textarea"
        rows="2"
        outlined
        dense
        class="admin-input"
      />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.ctaLabel') }}</label>
      <q-input v-model="hero.ctaLabel" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.ctaBangsaen') }}</label>
      <q-input v-model="hero.ctaBangsaen" outlined dense class="admin-input" />
    </div>

    <div class="admin-field-group">
      <label class="admin-label">{{ t('admin.fields.ctaSriracha') }}</label>
      <q-input v-model="hero.ctaSriracha" outlined dense class="admin-input" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { t } = useI18n();
const { hero } = useWebsiteEditor();
const heroImageFile = ref<File | null>(null);

function onImageChange(file: File | null): void {
  if (!file) return;
  hero.image = URL.createObjectURL(file);
}

function addSkill(): void {
  hero.skills.push('New Skill Item');
}

function removeSkill(index: number): void {
  if (hero.skills.length > 1) {
    hero.skills.splice(index, 1);
  }
}
</script>
