<template>
  <article class="course-card">
    <div class="course-card__image-wrap">
      <img :src="image" :alt="title" class="course-card__image" />
      <span v-if="badge" class="course-card__badge">{{ badge }}</span>
    </div>
    <div class="course-card__content">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <AppButton variant="red">{{ t('courses.viewDetails') }}</AppButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppButton from './AppButton.vue';

defineProps<{ image: string; title: string; description: string; badge?: string }>();

const { t } = useI18n();
</script>
