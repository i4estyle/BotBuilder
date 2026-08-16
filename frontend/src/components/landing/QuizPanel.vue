<template>
  <q-dialog v-model="isOpen" transition-show="scale" transition-hide="scale">
    <div class="quiz-panel">
      <template v-if="!finished">
        <div class="quiz-panel__header">
          <span class="quiz-panel__badge">
            {{ labels.badge(currentIndex + 1, questions.length) }}
          </span>
          <q-btn
            flat
            round
            dense
            icon="close"
            class="quiz-panel__close"
            :aria-label="labels.close"
            @click="close"
          />
        </div>

        <div class="quiz-panel__progress">
          <div class="quiz-panel__progress-bar" :style="{ width: `${progressPercent}%` }" />
        </div>

        <h3 class="quiz-panel__question">{{ currentQuestion?.question }}</h3>

        <div class="quiz-panel__options">
          <button
            v-for="(option, index) in currentQuestion?.options || []"
            :key="option"
            type="button"
            class="quiz-option"
            :class="optionClass(index)"
            :disabled="answered"
            @click="selectOption(index)"
          >
            <span class="quiz-option__letter">{{ letters[index] }}</span>
            <span>{{ option }}</span>
          </button>
        </div>

        <div v-if="!answered" class="quiz-panel__confirm">
          <AppButton variant="green" :disabled="selectedIndex === null" @click="confirmAnswer">
            {{ labels.confirm }}
          </AppButton>
        </div>

        <div v-if="answered" class="quiz-panel__feedback">
          <p v-if="isCorrect">{{ labels.feedbackCorrect }}</p>
          <p v-else>{{ labels.feedbackWrong }}</p>
          <AppButton variant="green" @click="nextQuestion">
            {{ isLastQuestion ? labels.viewResults : labels.nextQuestion }}
          </AppButton>
        </div>
      </template>

      <template v-else>
        <div class="quiz-panel__header">
          <span class="quiz-panel__badge">{{ labels.resultBadge }}</span>
          <q-btn
            flat
            round
            dense
            icon="close"
            class="quiz-panel__close"
            :aria-label="labels.close"
            @click="close"
          />
        </div>

        <div class="quiz-panel__result">
          <q-icon :name="resultIcon" class="quiz-panel__result-icon" />
          <h3>{{ labels.scoreLabel(score, questions.length) }}</h3>
          <p>{{ resultMessage }}</p>
          <div class="quiz-panel__result-actions">
            <AppButton variant="outline" @click="restart">{{ labels.tryAgain }}</AppButton>
            <AppButton variant="red" @click="close">{{ labels.close }}</AppButton>
          </div>
        </div>
      </template>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AppButton from './AppButton.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const { quiz: quizData, editorLocale } = useWebsiteEditor();

const letters = ['A', 'B', 'C', 'D'];

const LABELS_DICT = {
  'th-TH': {
    badge: (curr: number, total: number) => `คำถามข้อที่ ${curr} จาก ${total}`,
    close: 'ปิด',
    confirm: 'ยืนยันคำตอบ',
    feedbackCorrect: 'ถูกต้อง! เยี่ยมมาก',
    feedbackWrong: 'ยังไม่ถูกต้อง ลองดูข้อถัดไปนะ',
    nextQuestion: 'ข้อถัดไป →',
    viewResults: 'ดูผลคะแนน →',
    resultBadge: 'สรุปผลคะแนน',
    scoreLabel: (s: number, t: number) => `คุณได้ ${s} / ${t} คะแนน`,
    tryAgain: 'ลองใหม่อีกครั้ง',
    msgGreat: 'สุดยอดมาก! คุณมีความรู้เกี่ยวกับหุ่นยนต์ในระดับยอดเยี่ยม',
    msgGood: 'เก่งมาก! คุณเข้าใจพื้นฐานเกี่ยวกับหุ่นยนต์ได้ดี',
    msgOkay: 'ไม่เป็นไรนะ! มาเรียนรู้เพิ่มเติมกับเราได้ที่ BotBuilder',
  },
  'en-US': {
    badge: (curr: number, total: number) => `Question ${curr} of ${total}`,
    close: 'Close',
    confirm: 'Confirm Answer',
    feedbackCorrect: 'Correct! Excellent job',
    feedbackWrong: 'Not quite right. Let us check the next one',
    nextQuestion: 'Next Question →',
    viewResults: 'View Results →',
    resultBadge: 'Quiz Results',
    scoreLabel: (s: number, t: number) => `You scored ${s} / ${t}`,
    tryAgain: 'Try Again',
    msgGreat: 'Outstanding! You have exceptional robotics knowledge',
    msgGood: 'Great job! You have a solid grasp of robotics basics',
    msgOkay: 'Good effort! Come explore and learn more with BotBuilder',
  },
};

const labels = computed(() => {
  return LABELS_DICT[editorLocale.value] || LABELS_DICT['th-TH'];
});

const allQuestions = computed<Question[]>(() => {
  if (quizData.questions && quizData.questions.length > 0) {
    return quizData.questions;
  }
  return [];
});

const QUIZ_LENGTH = 5;

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = result[i];
    const target = result[j];
    if (current !== undefined && target !== undefined) {
      result[i] = target;
      result[j] = current;
    }
  }
  return result;
}

function pickRandomQuestions(): Question[] {
  const pool = allQuestions.value;
  if (pool.length === 0) return [];
  const len = Math.min(pool.length, QUIZ_LENGTH);
  return shuffle(pool)
    .slice(0, len)
    .map((q) => ({
      question: q.question,
      options: [...q.options],
      correctIndex: q.correctIndex,
    }));
}

const questions = ref<Question[]>(pickRandomQuestions());
const currentIndex = ref(0);
const selectedIndex = ref<number | null>(null);
const answered = ref(false);
const score = ref(0);
const finished = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const currentQuestion = computed(() => questions.value[currentIndex.value]);
const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1);
const isCorrect = computed(() => selectedIndex.value === currentQuestion.value?.correctIndex);
const progressPercent = computed(() => {
  if (questions.value.length === 0) return 0;
  return ((currentIndex.value + (answered.value ? 1 : 0)) / questions.value.length) * 100;
});

function selectOption(index: number): void {
  if (answered.value) return;
  selectedIndex.value = index;
}

function confirmAnswer(): void {
  if (answered.value || selectedIndex.value === null || !currentQuestion.value) return;
  answered.value = true;
  if (selectedIndex.value === currentQuestion.value.correctIndex) {
    score.value += 1;
  }
}

function optionClass(index: number): Record<string, boolean> {
  if (answered.value) {
    return {
      'quiz-option--correct': index === currentQuestion.value?.correctIndex,
      'quiz-option--wrong':
        index === selectedIndex.value && index !== currentQuestion.value?.correctIndex,
    };
  }
  return {
    'quiz-option--selected': index === selectedIndex.value,
  };
}

function nextQuestion(): void {
  if (isLastQuestion.value) {
    finished.value = true;
    return;
  }
  currentIndex.value += 1;
  selectedIndex.value = null;
  answered.value = false;
}

function restart(): void {
  questions.value = pickRandomQuestions();
  currentIndex.value = 0;
  selectedIndex.value = null;
  answered.value = false;
  score.value = 0;
  finished.value = false;
}

function close(): void {
  isOpen.value = false;
}

const resultMessage = computed(() => {
  if (questions.value.length === 0) return labels.value.msgOkay;
  const ratio = score.value / questions.value.length;
  if (ratio >= 0.8) return labels.value.msgGreat;
  if (ratio >= 0.5) return labels.value.msgGood;
  return labels.value.msgOkay;
});

const resultIcon = computed(() => {
  if (questions.value.length === 0) return 'sentiment_satisfied';
  const ratio = score.value / questions.value.length;
  if (ratio >= 0.8) return 'emoji_events';
  if (ratio >= 0.5) return 'sentiment_satisfied';
  return 'sentiment_satisfied_alt';
});

watch(
  () => [props.modelValue, allQuestions.value],
  ([val]) => {
    if (val) restart();
  },
);
</script>
