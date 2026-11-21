<template>
  <CustomSection
    v-if="block"
    :id="`preview-section-${block.id}`"
    :block="block"
    editable
    class="admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', block.id)"
    @update="onUpdate"
    @update-card="onUpdateCard"
    @add-card="onAddCard"
    @remove-card="onRemoveCard"
    @pick-icon="onPickIcon"
  >
    <AdminSectionBlockLayer :section-id="block.id" />
  </CustomSection>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CustomSection from '@/components/landing/CustomSection.vue';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import {
  useWebsiteEditor,
  createDefaultCard,
  MAX_CUSTOM_SECTION_CARDS,
  type CustomBlockItem,
} from '@/composables/use-website-editor';

const props = defineProps<{
  blockId: string;
  isActive: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'openIconPicker', callback: (iconName: string) => void): void;
}>();

const { customBlocks, saveHistorySnapshot, syncCustomSectionTitle } = useWebsiteEditor();

const block = computed(() => customBlocks.find((b) => b.id === props.blockId));

function onUpdate(patch: Partial<CustomBlockItem>): void {
  if (!block.value) return;
  saveHistorySnapshot();
  Object.assign(block.value, patch);
  if (patch.title) syncCustomSectionTitle(block.value.id, patch.title);
}

function onUpdateCard(index: number, field: 'title' | 'text', value: string): void {
  const card = block.value?.items?.[index];
  if (!card) return;
  saveHistorySnapshot();
  card[field] = value;
}

function onAddCard(): void {
  if (!block.value) return;
  const items = block.value.items || (block.value.items = []);
  if (items.length >= MAX_CUSTOM_SECTION_CARDS) return;
  saveHistorySnapshot();
  items.push(createDefaultCard(items.length));
}

function onRemoveCard(index: number): void {
  const items = block.value?.items;
  if (!items || items.length <= 1) return;
  saveHistorySnapshot();
  items.splice(index, 1);
}

function onPickIcon(index: number): void {
  emit('openIconPicker', (iconName: string) => {
    const card = block.value?.items?.[index];
    if (card) card.icon = iconName;
  });
}
</script>
