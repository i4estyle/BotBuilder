<template>
  <q-dialog v-model="isOpen" transition-show="scale" transition-hide="scale">
    <div class="quiz-panel">
      <template v-if="!finished">
        <div class="quiz-panel__header">
          <span class="quiz-panel__badge">{{
            t('quiz.badge', { current: currentIndex + 1, total: questions.length })
          }}</span>
          <q-btn
            flat
            round
            dense
            icon="close"
            class="quiz-panel__close"
            :aria-label="t('quiz.close')"
            @click="close"
          />
        </div>

        <div class="quiz-panel__progress">
          <div class="quiz-panel__progress-bar" :style="{ width: `${progressPercent}%` }" />
        </div>

        <h3 class="quiz-panel__question">{{ currentQuestion.question }}</h3>

        <div class="quiz-panel__options">
          <button
            v-for="(option, index) in currentQuestion.options"
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
            {{ t('quiz.confirm') }}
          </AppButton>
        </div>

        <div v-if="answered" class="quiz-panel__feedback">
          <p v-if="isCorrect">{{ t('quiz.feedbackCorrect') }}</p>
          <p v-else>{{ t('quiz.feedbackWrong') }}</p>
          <AppButton variant="green" @click="nextQuestion">
            {{ isLastQuestion ? t('quiz.viewResults') : t('quiz.nextQuestion') }}
          </AppButton>
        </div>
      </template>

      <template v-else>
        <div class="quiz-panel__header">
          <span class="quiz-panel__badge">{{ t('quiz.resultBadge') }}</span>
          <q-btn
            flat
            round
            dense
            icon="close"
            class="quiz-panel__close"
            :aria-label="t('quiz.close')"
            @click="close"
          />
        </div>

        <div class="quiz-panel__result">
          <q-icon :name="resultIcon" class="quiz-panel__result-icon" />
          <h3>{{ t('quiz.scoreLabel', { score, total: questions.length }) }}</h3>
          <p>{{ resultMessage }}</p>
          <div class="quiz-panel__result-actions">
            <AppButton variant="outline" @click="restart">{{ t('quiz.tryAgain') }}</AppButton>
            <AppButton variant="red" @click="close">{{ t('quiz.close') }}</AppButton>
          </div>
        </div>
      </template>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from './AppButton.vue';

import { useWebsiteEditor } from '@/composables/use-website-editor';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const i18n = useI18n();
const { t } = i18n;
const { quiz: quizData } = useWebsiteEditor();

const letters = ['A', 'B', 'C', 'D'];

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

const correctIndexes = [2, 1, 2, 1, 3, 3, 0, 1, 2, 2, 2, 2, 1, 1, 0, 1, 3, 2, 0, 1];

const allQuestions = computed<Question[]>(() => {
  if (quizData.questions && quizData.questions.length > 0) {
    return quizData.questions;
  }
  const questionsList = i18n.tm('quiz.questions');
  if (Array.isArray(questionsList) && questionsList.length > 0) {
    return questionsList.map((question, index) => ({
      ...question,
      correctIndex: correctIndexes[index] ?? 0,
    }));
  }
  return [];
});

const QUIZ_LENGTH = 10;

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

function pickRandomQuestions(): Question[] {
  const pool = allQuestions.value;
  if (pool.length === 0) return [];
  const len = Math.min(pool.length, QUIZ_LENGTH);
  return shuffle(pool).slice(0, len);
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

const currentQuestion = computed(() => questions.value[currentIndex.value]!);
const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1);
const isCorrect = computed(() => selectedIndex.value === currentQuestion.value.correctIndex);
const progressPercent = computed(
  () => ((currentIndex.value + (answered.value ? 1 : 0)) / questions.value.length) * 100,
);

function selectOption(index: number) {
  if (answered.value) return;
  selectedIndex.value = index;
}

function confirmAnswer() {
  if (answered.value || selectedIndex.value === null) return;
  answered.value = true;
  if (selectedIndex.value === currentQuestion.value.correctIndex) score.value += 1;
}

function optionClass(index: number) {
  if (answered.value) {
    return {
      'quiz-option--correct': index === currentQuestion.value.correctIndex,
      'quiz-option--wrong':
        index === selectedIndex.value && index !== currentQuestion.value.correctIndex,
    };
  }
  return {
    'quiz-option--selected': index === selectedIndex.value,
  };
}

function nextQuestion() {
  if (isLastQuestion.value) {
    finished.value = true;
    return;
  }
  currentIndex.value += 1;
  selectedIndex.value = null;
  answered.value = false;
}

function restart() {
  questions.value = pickRandomQuestions();
  currentIndex.value = 0;
  selectedIndex.value = null;
  answered.value = false;
  score.value = 0;
  finished.value = false;
}

function close() {
  isOpen.value = false;
}

const resultMessage = computed(() => {
  const ratio = score.value / questions.value.length;
  if (ratio >= 0.8) return t('quiz.resultMessages.great');
  if (ratio >= 0.5) return t('quiz.resultMessages.good');
  return t('quiz.resultMessages.okay');
});

const resultIcon = computed(() => {
  const ratio = score.value / questions.value.length;
  if (ratio >= 0.8) return 'emoji_events';
  if (ratio >= 0.5) return 'sentiment_satisfied';
  return 'sentiment_satisfied_alt';
});

watch(
  () => props.modelValue,
  (value) => {
    if (value) restart();
  },
);
</script>
