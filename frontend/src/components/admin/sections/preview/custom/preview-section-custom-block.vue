<template>
  <section
    v-if="block"
    :id="`preview-section-${block.id}`"
    class="section admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', block.id)"
  >
    <div class="section-heading section-heading--centered">
      <h2
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (block!.title = val))"
        @input="(e) => onTextChange(e, (val) => (block!.title = val))"
      >
        {{ block.title }}
      </h2>
      <span class="section-heading__line" />
    </div>

    <div v-if="block.type === 'text'" class="text-center q-pa-md">
      <p
        contenteditable="true"
        class="admin-inline-editable text-body1 text-grey-9"
        style="max-width: 800px; margin: 0 auto; line-height: 1.8"
        @blur="(e) => onTextChange(e, (val) => (block!.content = val))"
        @input="(e) => onTextChange(e, (val) => (block!.content = val))"
      >
        {{ block.content }}
      </p>
    </div>

    <div
      v-else-if="block.type === 'image'"
      class="admin-image-hover-trigger flex flex-center q-pa-md"
      style="max-width: 800px; margin: 0 auto"
      data-image-key="customBlock"
      :data-block-id="block.id"
    >
      <img
        :src="block.image"
        :alt="block.title"
        style="max-width: 100%; border-radius: 12px; height: auto"
      />
      <div class="admin-image-hover-overlay">
        <q-icon name="cloud_upload" size="32px" />
        <span>คลิกเพื่อเปลี่ยนรูปภาพ</span>
      </div>
    </div>
    <AdminSectionBlockLayer :section-id="block.id" />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { onTextChange } from '@/utils/admin-helpers';

const props = defineProps<{
  blockId: string;
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();

const { customBlocks } = useWebsiteEditor();

const block = computed(() => customBlocks.find((b) => b.id === props.blockId));
</script>
