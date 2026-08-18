<template>
  <article class="course-card">
    <div
      class="course-card__image-wrap"
      :style="
        index !== undefined ? getStyleOverride(`coursesPage.items.${index}.image`) : undefined
      "
    >
      <img :src="resolveAssetUrl(image)" :alt="title" class="course-card__image" />
      <span
        v-if="badge"
        class="course-card__badge"
        :style="
          index !== undefined ? getStyleOverride(`coursesPage.items.${index}.badge`) : undefined
        "
        >{{ badge }}</span
      >
    </div>
    <div class="course-card__content">
      <h3
        :style="
          index !== undefined ? getStyleOverride(`coursesPage.items.${index}.title`) : undefined
        "
      >
        {{ title }}
      </h3>
      <div v-if="Array.isArray(description)">
        <p
          v-for="(line, i) in description"
          :key="i"
          :style="
            index !== undefined
              ? getStyleOverride(`coursesPage.items.${index}.description.${i}`)
              : undefined
          "
        >
          {{ line }}
        </p>
      </div>
      <p
        v-else
        :style="
          index !== undefined
            ? getStyleOverride(`coursesPage.items.${index}.description`)
            : undefined
        "
      >
        {{ description }}
      </p>
      <AppButton variant="red">
        <span :style="getStyleOverride('coursesPage.buttonText')">
          {{ buttonText || 'ดูรายละเอียดเพิ่มเติม' }}
        </span>
      </AppButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import AppButton from './AppButton.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';

defineProps<{
  image: string;
  title: string;
  description: string | string[];
  badge?: string;
  buttonText?: string;
  index?: number;
}>();

const { getStyleOverride } = useWebsiteEditor();
</script>
