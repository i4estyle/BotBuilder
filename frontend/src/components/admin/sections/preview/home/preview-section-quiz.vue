<template>
  <section
    id="preview-section-quiz"
    class="quiz section admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'quiz')"
  >
    <q-icon name="quiz" class="quiz__icon admin-icon-clickable" />
    <h2
      contenteditable="true"
      class="admin-inline-editable"
      @blur="(e) => onTextChange(e, (val) => (quizData.heading = val))"
    >
      {{ quizData.heading }}
    </h2>
    <p
      contenteditable="true"
      class="admin-inline-editable"
      @blur="(e) => onTextChange(e, (val) => (quizData.paragraph = val))"
    >
      {{ quizData.paragraph }}
    </p>
    <AppButton>
      <span
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (quizData.cta = val))"
        >{{ quizData.cta }}</span
      >
    </AppButton>
    <AdminSectionBlockLayer section-id="quiz" />
  </section>
</template>

<script setup lang="ts">
import AppButton from '@/components/landing/AppButton.vue';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { onTextChange } from '@/utils/admin-helpers';

defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();

const { quiz: quizData } = useWebsiteEditor();
</script>
