<template>
  <section
    id="preview-section-activityFormats"
    class="section admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'activityFormats')"
  >
    <div class="section-heading section-heading--centered">
      <h2
        contenteditable="true"
        class="admin-inline-editable"
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
          :data-image-index="index"
        >
          <img :src="actItem.image" :alt="actItem.title" />
          <div class="admin-image-hover-overlay">
            <q-icon name="photo_camera" size="28px" />
            <span>ปรับแต่งรูปกิจกรรม</span>
          </div>
        </div>
        <div class="activities__copy">
          <h3
            contenteditable="true"
            class="admin-inline-editable"
            @blur="(e) => onTextChange(e, (val) => (actItem.title = val))"
          >
            {{ actItem.title }}
          </h3>
          <p
            contenteditable="true"
            class="admin-inline-editable"
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

defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();

const { activityFormats: activityFormatsData } = useWebsiteEditor();
</script>
