<template>
  <div class="activities">
    <div
      v-for="(item, index) in items"
      :key="item.title"
      class="activities__item"
      data-reveal
      :style="{ '--reveal-delay': `${index * 90}ms` }"
    >
      <div class="activities__media">
        <img :src="item.image" :alt="item.title" />
      </div>
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
      <a href="#" class="activities__link">รายละเอียดเพิ่มเติม <q-icon name="arrow_forward" /></a>
    </div>
  </div>
</template>

<script setup lang="ts">
type ActivityItem = { image: string; title: string; description: string };

defineProps<{ items: ActivityItem[] }>();
</script>
