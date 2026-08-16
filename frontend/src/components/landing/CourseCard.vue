<template>
  <article class="course-card">
    <div class="course-card__image-wrap">
      <img :src="resolveAssetUrl(image)" :alt="title" class="course-card__image" />
      <span v-if="badge" class="course-card__badge">{{ badge }}</span>
    </div>
    <div class="course-card__content">
      <h3>{{ title }}</h3>
      <div v-if="Array.isArray(description)">
        <p v-for="(line, i) in description" :key="i">{{ line }}</p>
      </div>
      <p v-else>{{ description }}</p>
      <AppButton variant="red">{{ buttonText || 'ดูรายละเอียดเพิ่มเติม' }}</AppButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import AppButton from './AppButton.vue';
import { resolveAssetUrl } from '@/utils/asset-helper';

defineProps<{
  image: string;
  title: string;
  description: string | string[];
  badge?: string;
  buttonText?: string;
}>();
</script>
