<template>
  <section
    id="preview-section-benefits"
    class="benefits section section--muted admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'benefits')"
  >
    <div class="section-heading section-heading--centered">
      <h2
        data-style-key="benefits.heading"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('benefits.heading')"
        @blur="(e) => onTextChange(e, (val) => (benefitsData.heading = val))"
      >
        {{ benefitsData.heading }}
      </h2>
      <span class="section-heading__line" />
    </div>
    <div class="benefits__grid">
      <article v-for="(benefit, index) in benefitsData.items" :key="index" class="benefit-card">
        <q-icon
          :name="benefit.icon"
          class="admin-icon-clickable"
          :data-style-key="`benefits.items.${index}.icon`"
          :style="getStyleOverride(`benefits.items.${index}.icon`)"
        />
        <h3
          :data-style-key="`benefits.items.${index}.title`"
          contenteditable="true"
          class="admin-inline-editable"
          :style="getStyleOverride(`benefits.items.${index}.title`)"
          @blur="(e) => onTextChange(e, (val) => (benefit.title = val))"
        >
          {{ benefit.title }}
        </h3>
        <p
          :data-style-key="`benefits.items.${index}.text`"
          contenteditable="true"
          class="admin-inline-editable"
          :style="getStyleOverride(`benefits.items.${index}.text`)"
          @blur="(e) => onTextChange(e, (val) => (benefit.text = val))"
        >
          {{ benefit.text }}
        </p>
      </article>
    </div>
    <AdminSectionBlockLayer section-id="benefits" />
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

const { benefits: benefitsData, getStyleOverride } = useWebsiteEditor();
</script>
