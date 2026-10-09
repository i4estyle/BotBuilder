<template>
  <div class="activities activities--photo-strip">
    <figure
      v-for="(item, index) in items"
      :key="index"
      class="activities__card"
      data-reveal
      :style="{ '--reveal-delay': `${index * 90}ms` }"
    >
      <div
        class="activities__media"
        :style="getStyleOverride(`activityFormats.items.${index}.image`)"
      >
        <img :src="resolveAssetUrl(item.image)" :alt="item.title" />
      </div>
      <figcaption class="activities__copy">
        <strong :style="getStyleOverride(`activityFormats.items.${index}.title`)">{{ item.title }}</strong>
        <span :style="getStyleOverride(`activityFormats.items.${index}.description`)">{{
          item.description
        }}</span>
      </figcaption>
    </figure>
  </div>
</template>

<script setup lang="ts">
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';

interface ActivityItem {
  image: string;
  title: string;
  description: string;
}

defineProps<{ items: ActivityItem[] }>();

const { getStyleOverride } = useWebsiteEditor();
</script>
