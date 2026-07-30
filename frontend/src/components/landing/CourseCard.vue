<template>
  <article class="course-card">
    <div class="course-card__image-wrap">
      <img :src="image" :alt="title" class="course-card__image" />
      <span class="course-card__age">{{ age }}</span>
    </div>
    <div class="course-card__content">
      <h3>{{ title }}</h3>
      <p class="course-card__lessons"><q-icon name="school" size="16px" /> {{ lessons }} Lessons</p>
      <p>{{ description }}</p>
      <AppButton variant="red">ดูรายละเอียด</AppButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import AppButton from './AppButton.vue';

defineProps<{ image: string; title: string; age: string; lessons: number; description: string }>();
</script>
