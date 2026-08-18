<template>
  <section
    id="preview-section-activityFormats"
    class="section admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'activityFormats')"
  >
    <div class="section-heading section-heading--centered">
      <h2
        data-style-key="activityFormats.heading"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('activityFormats.heading')"
        @blur="(e) => onTextChange(e, (val) => (activityFormatsData.heading = val))"
      >
        {{ activityFormatsData.heading }}
      </h2>
      <span class="section-heading__line" />
    </div>
    <div class="activities">
      <div
        v-for="(actItem, index) in activityFormatsData.items"
        :key="index"
        class="activities__row"
        :class="{ 'activities__row--reverse': index % 2 === 1 }"
      >
        <div
          class="activities__media admin-image-hover-trigger"
          data-image-key="activityFormats.item"
          :data-style-key="`activityFormats.items.${index}.image`"
          :data-image-index="index"
          :style="getStyleOverride(`activityFormats.items.${index}.image`)"
        >
          <img :src="resolveAssetUrl(actItem.image)" :alt="actItem.title" />
          <div class="admin-image-hover-overlay">
            <q-icon name="photo_camera" size="28px" />
            <span>ปรับแต่งรูปกิจกรรม</span>
          </div>
        </div>
        <div class="activities__copy">
          <h3
            :data-style-key="`activityFormats.items.${index}.title`"
            contenteditable="true"
            class="admin-inline-editable"
            :style="getStyleOverride(`activityFormats.items.${index}.title`)"
            @blur="(e) => onTextChange(e, (val) => (actItem.title = val))"
          >
            {{ actItem.title }}
          </h3>
          <p
            :data-style-key="`activityFormats.items.${index}.description`"
            contenteditable="true"
            class="admin-inline-editable"
            :style="getStyleOverride(`activityFormats.items.${index}.description`)"
            @blur="(e) => onTextChange(e, (val) => (actItem.description = val))"
          >
            {{ actItem.description }}
          </p>
        </div>
      </div>
    </div>
    <AdminSectionBlockLayer section-id="activityFormats" />
  </section>
</template>

<script setup lang="ts">
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { onTextChange } from '@/utils/admin-helpers';
import { resolveAssetUrl } from '@/utils/asset-helper';

defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();

const { activityFormats: activityFormatsData, getStyleOverride } = useWebsiteEditor();
</script>
