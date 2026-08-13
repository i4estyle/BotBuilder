<template>
  <section
    id="preview-section-resources-list"
    class="section admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'resourcesList')"
  >
    <div class="resource-grid">
      <article v-for="(res, rIdx) in resourcesPageData.items" :key="rIdx" class="resource-card">
        <div class="q-mb-sm">
          <div
            class="admin-icon-clickable"
            @click.stop="$emit('openIconPicker', (iconName) => (res.icon = iconName))"
          >
            <q-icon :name="res.icon" size="32px" />
            <q-tooltip>คลิกเพื่อเปลี่ยนไอคอน</q-tooltip>
          </div>
        </div>
        <h2
          contenteditable="true"
          class="admin-inline-editable"
          @blur="(e) => onTextChange(e, (val) => (res.title = val))"
        >
          {{ res.title }}
        </h2>
        <p
          contenteditable="true"
          class="admin-inline-editable"
          @blur="(e) => onTextChange(e, (val) => (res.text = val))"
        >
          {{ res.text }}
        </p>
      </article>
    </div>
    <AdminSectionBlockLayer section-id="resourcesList" />
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
  (e: 'openIconPicker', cb: (iconName: string) => void): void;
}>();

const { resourcesPage: resourcesPageData } = useWebsiteEditor();
</script>
