<template>
  <div class="activities">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="activities__row"
      :class="{ 'activities__row--reverse': index % 2 === 1 }"
      data-reveal
      :style="{ '--reveal-delay': `${index * 90}ms` }"
    >
      <div class="activities__media">
        <img :src="resolveAssetUrl(item.image)" :alt="item.title" />
      </div>
      <div class="activities__copy">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { resolveAssetUrl } from '@/utils/asset-helper';

interface ActivityItem {
  image: string;
  title: string;
  description: string;
}

defineProps<{ items: ActivityItem[] }>();
</script>
