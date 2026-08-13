<template>
  <q-dialog
    :model-value="modelValue"
    transition-show="fade"
    transition-hide="fade"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <div class="admin-quiz-modal">
      <div class="admin-quiz-modal__header">
        <div class="admin-quiz-modal__icon-badge">
          <q-icon name="quiz" size="22px" />
        </div>
        <div>
          <h3 class="admin-quiz-modal__title">จัดการคลังข้อสอบ Quiz</h3>
          <span class="admin-quiz-modal__subtitle">
            คำถามทั้งหมด {{ quizData.questions.length }} ข้อ • (ภาษา:
            {{ editorLocale === 'th-TH' ? 'ไทย' : 'English' }})
          </span>
        </div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense color="grey-6" />
      </div>

      <div class="admin-quiz-modal__top-actions">
        <span class="admin-quiz-modal__hint"
          >แก้ไขคำถาม ตัวเลือก A-D และเลือกเฉลยคำตอบที่ถูกต้อง</span
        >
        <button type="button" class="admin-quiz-add-btn" @click="addQuizQuestionItem">
          <q-icon name="add" size="18px" />
          <span>เพิ่มข้อสอบใหม่</span>
        </button>
      </div>

      <div ref="quizModalBodyRef" class="admin-quiz-modal__body">
        <div v-for="(qItem, qIdx) in quizData.questions" :key="qIdx" class="admin-quiz-qcard">
          <div class="admin-quiz-qcard__header">
            <span class="admin-quiz-qcard__number">ข้อที่ {{ qIdx + 1 }}</span>
            <q-space />
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              size="sm"
              :disabled="quizData.questions.length <= 1"
              @click="removeQuizQuestionItem(qIdx)"
            >
              <q-tooltip>ลบ</q-tooltip>
            </q-btn>
          </div>

          <div class="admin-quiz-qcard__form">
            <div class="admin-quiz-form-group">
              <label class="admin-quiz-form-label">โจทย์คำถาม</label>
              <q-input
                v-model="qItem.question"
                outlined
                dense
                placeholder="พิมพ์โจทย์คำถาม..."
                class="admin-quiz-input"
              />
            </div>

            <div class="admin-quiz-options-grid">
              <div
                v-for="(optText, oIdx) in qItem.options"
                :key="oIdx"
                class="admin-quiz-option-input-wrap"
              >
                <span class="admin-quiz-option-letter">{{ ['A', 'B', 'C', 'D'][oIdx] }}</span>
                <q-input
                  v-model="qItem.options[oIdx]"
                  outlined
                  dense
                  :placeholder="`ตัวเลือก ${['A', 'B', 'C', 'D'][oIdx]}`"
                  class="admin-quiz-input"
                />
              </div>
            </div>

            <div class="admin-quiz-form-group admin-quiz-form-group--correct">
              <label class="admin-quiz-form-label">เฉลยข้อที่ถูกต้อง</label>
              <q-select
                v-model="qItem.correctIndex"
                :options="correctOptions"
                map-options
                emit-value
                outlined
                dense
                class="admin-quiz-select"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="admin-quiz-modal__footer">
        <button
          type="button"
          class="admin-quiz-footer-btn admin-quiz-footer-btn--cancel"
          v-close-popup
        >
          <span>ยกเลิก</span>
        </button>
        <button
          type="button"
          class="admin-quiz-footer-btn admin-quiz-footer-btn--save"
          @click="saveQuizModal"
        >
          <q-icon name="check" size="18px" />
          <span>บันทึกข้อสอบ</span>
        </button>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { Notify } from 'quasar';
import { useWebsiteEditor } from '@/composables/use-website-editor';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const { quiz: quizData, editorLocale, saveHistorySnapshot } = useWebsiteEditor();

const quizModalBodyRef = ref<HTMLElement | null>(null);
const correctOptions = [
  { label: 'ตัวเลือก A', value: 0 },
  { label: 'ตัวเลือก B', value: 1 },
  { label: 'ตัวเลือก C', value: 2 },
  { label: 'ตัวเลือก D', value: 3 },
];

async function addQuizQuestionItem(): Promise<void> {
  saveHistorySnapshot();
  quizData.questions.push({
    question: 'คำถามใหม่...',
    options: ['ตัวเลือก A', 'ตัวเลือก B', 'ตัวเลือก C', 'ตัวเลือก D'],
    correctIndex: 0,
  });
  await nextTick();
  if (quizModalBodyRef.value) {
    const cards = quizModalBodyRef.value.querySelectorAll<HTMLElement>('.admin-quiz-qcard');
    const lastCard = cards[cards.length - 1];
    if (lastCard) {
      lastCard.classList.add('admin-quiz-qcard--new');
      lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = lastCard.querySelector<HTMLInputElement>('input');
      if (input) {
        input.focus();
        input.select();
      }
      setTimeout(() => {
        lastCard.classList.remove('admin-quiz-qcard--new');
      }, 1800);
    }
  }
}

function removeQuizQuestionItem(index: number): void {
  if (quizData.questions.length > 1) {
    saveHistorySnapshot();
    quizData.questions.splice(index, 1);
  }
}

function saveQuizModal(): void {
  emit('update:modelValue', false);
  Notify.create({
    type: 'positive',
    message: 'บันทึกชุดข้อสอบ Quiz เรียบร้อยแล้ว',
    position: 'top',
    timeout: 2000,
  });
}
</script>
