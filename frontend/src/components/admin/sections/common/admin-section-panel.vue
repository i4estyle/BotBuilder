<template>
  <q-expansion-item
    :id="`editor-section-${sectionId}`"
    ref="panelRef"
    :model-value="isActive"
    group="admin-sections"
    header-class="admin-section-header"
    :class="{ 'admin-section-panel--active': isActive }"
    @update:model-value="onToggle"
  >
    <template #header>
      <q-item-section avatar>
        <q-icon :name="icon" class="admin-section-panel__icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="admin-section-panel__title">{{ title }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <span v-if="isActive" class="admin-section-panel__badge">กำลังแก้ไข</span>
      </q-item-section>
    </template>

    <q-card class="admin-section-card">
      <q-card-section>
        <slot />
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { computed, ref, watch, type ComponentPublicInstance } from 'vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const props = defineProps<{
  sectionId: string;
  title: string;
  icon: string;
}>();

const { activeSectionId } = useWebsiteEditor();
const isActive = computed(() => activeSectionId.value === props.sectionId);
const panelRef = ref<ComponentPublicInstance | null>(null);

function onToggle(expanded: boolean): void {
  if (expanded) {
    activeSectionId.value = props.sectionId;
  } else if (activeSectionId.value === props.sectionId) {
    activeSectionId.value = '';
  }
}

watch(isActive, (active) => {
  if (active && panelRef.value) {
    const el = (panelRef.value as { $el?: HTMLElement }).$el || null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
});
</script>
