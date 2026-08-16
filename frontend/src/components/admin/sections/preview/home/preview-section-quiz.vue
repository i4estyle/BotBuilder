<template>
  <section
    id="preview-section-quiz"
    class="quiz section admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'quiz')"
  >
    <q-icon
      name="quiz"
      class="quiz__icon admin-icon-clickable"
      data-style-key="quiz.icon"
      :style="getStyleOverride('quiz.icon')"
    />
    <h2
      data-style-key="quiz.heading"
      contenteditable="true"
      class="admin-inline-editable"
      :style="getStyleOverride('quiz.heading')"
      @blur="(e) => onTextChange(e, (val) => (quizData.heading = val))"
    >
      {{ quizData.heading }}
    </h2>
    <p
      data-style-key="quiz.paragraph"
      contenteditable="true"
      class="admin-inline-editable"
      :style="getStyleOverride('quiz.paragraph')"
      @blur="(e) => onTextChange(e, (val) => (quizData.paragraph = val))"
    >
      {{ quizData.paragraph }}
    </p>
    <AppButton>
      <span
        data-style-key="quiz.cta"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('quiz.cta')"
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

const { quiz: quizData, getStyleOverride } = useWebsiteEditor();
</script>
