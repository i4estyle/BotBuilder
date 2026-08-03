<template>
  <q-dialog v-model="isOpen" transition-show="scale" transition-hide="scale">
    <div class="quiz-panel">
      <template v-if="!finished">
        <div class="quiz-panel__header">
          <span class="quiz-panel__badge">ข้อที่ {{ currentIndex + 1 }} / {{ questions.length }}</span>
          <q-btn flat round dense icon="close" class="quiz-panel__close" aria-label="ปิด" @click="close" />
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

        <div v-if="answered" class="quiz-panel__feedback">
          <p v-if="isCorrect">🎉 ถูกต้อง! เก่งมาก</p>
          <p v-else>ยังไม่ถูกนะ ลองจำคำตอบที่ถูกไว้เป็นความรู้เพิ่มเติม</p>
          <AppButton variant="green" @click="nextQuestion">
            {{ isLastQuestion ? 'ดูผลคะแนน' : 'ข้อต่อไป →' }}
          </AppButton>
        </div>
      </template>

      <template v-else>
        <div class="quiz-panel__header">
          <span class="quiz-panel__badge">ผลคะแนน</span>
          <q-btn flat round dense icon="close" class="quiz-panel__close" aria-label="ปิด" @click="close" />
        </div>

        <div class="quiz-panel__result">
          <q-icon :name="resultIcon" class="quiz-panel__result-icon" />
          <h3>คุณได้ {{ score }} / {{ questions.length }} คะแนน</h3>
          <p>{{ resultMessage }}</p>
          <div class="quiz-panel__result-actions">
            <AppButton variant="outline" @click="restart">ทำอีกครั้ง</AppButton>
            <AppButton variant="red" @click="close">ปิด</AppButton>
          </div>
        </div>
      </template>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AppButton from './AppButton.vue';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const letters = ['A', 'B', 'C', 'D'];

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

const questions: Question[] = [
  {
    question: 'บล็อกสีเขียวรูปธงที่ใช้เริ่มต้นโปรแกรม เรียกว่าอะไร?',
    options: ['When program starts', 'Stop', 'Wait', 'Turn right'],
    correctIndex: 0,
  },
  {
    question: 'ถ้าอยากให้หุ่นยนต์ "วิ่งไปข้างหน้า" ต้องใช้บล็อกไหน?',
    options: ['Move', 'Light up', 'Play sound', 'Wait'],
    correctIndex: 0,
  },
  {
    question: 'บล็อก "Wait 3 seconds" ทำให้หุ่นยนต์ทำอะไร?',
    options: ['หยุดรอ 3 วินาที', 'วิ่งเร็วขึ้น 3 เท่า', 'เลี้ยว 3 รอบ', 'ปิดเครื่อง'],
    correctIndex: 0,
  },
  {
    question: 'ถ้าอยากให้หุ่นยนต์ทำงานซ้ำไปเรื่อย ๆ ไม่มีที่สิ้นสุด ต้องใช้บล็อกอะไร?',
    options: ['Repeat (loop forever)', 'Wait until', 'Stop', 'Move'],
    correctIndex: 0,
  },
  {
    question: 'เซนเซอร์ที่ใช้ตรวจจับ "สี" ของวัตถุ เรียกว่าอะไร?',
    options: ['Color Sensor', 'Force Sensor', 'Motor', 'Speaker'],
    correctIndex: 0,
  },
  {
    question: 'เซนเซอร์ที่ใช้วัด "ระยะห่าง" ระหว่างหุ่นยนต์กับวัตถุ เรียกว่าอะไร?',
    options: ['Distance Sensor', 'Color Sensor', 'Light Matrix', 'Button'],
    correctIndex: 0,
  },
  {
    question: 'ถ้าอยากให้หุ่นยนต์ "เลี้ยวขวา" ต้องปรับค่าอะไรในบล็อก Move?',
    options: ['ทิศทาง (Steering)', 'เสียง (Sound)', 'สี (Color)', 'เวลา (Time)'],
    correctIndex: 0,
  },
  {
    question: 'บล็อก "If...then...else" ใช้สำหรับอะไร?',
    options: ['ตัดสินใจตามเงื่อนไข', 'เล่นเสียง', 'เปลี่ยนสีไฟ', 'นับเวลา'],
    correctIndex: 0,
  },
  {
    question: 'มุมที่ใช้บอกว่าหุ่นยนต์เลี้ยวไปเท่าไร วัดเป็นหน่วยอะไร?',
    options: ['องศา (Degrees)', 'วินาที', 'เซนติเมตร', 'กิโลกรัม'],
    correctIndex: 0,
  },
  {
    question: 'การเขียนโปรแกรมด้วยการลากบล็อกคำสั่งมาต่อกัน (ไม่ต้องพิมพ์โค้ด) เรียกว่าอะไร?',
    options: ['Word Block Coding', 'Text Coding', 'HTML', 'Excel'],
    correctIndex: 0,
  },
];

const currentIndex = ref(0);
const selectedIndex = ref<number | null>(null);
const answered = ref(false);
const score = ref(0);
const finished = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const currentQuestion = computed(() => questions[currentIndex.value]!);
const isLastQuestion = computed(() => currentIndex.value === questions.length - 1);
const isCorrect = computed(() => selectedIndex.value === currentQuestion.value.correctIndex);
const progressPercent = computed(
  () => ((currentIndex.value + (answered.value ? 1 : 0)) / questions.length) * 100,
);

function selectOption(index: number) {
  if (answered.value) return;
  selectedIndex.value = index;
  answered.value = true;
  if (index === currentQuestion.value.correctIndex) score.value += 1;
}

function optionClass(index: number) {
  if (!answered.value) return {};
  return {
    'quiz-option--correct': index === currentQuestion.value.correctIndex,
    'quiz-option--wrong': index === selectedIndex.value && index !== currentQuestion.value.correctIndex,
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
  const ratio = score.value / questions.length;
  if (ratio >= 0.8) return 'สุดยอดไปเลย! พร้อมลุยคอร์สหุ่นยนต์กับเราแล้ว 🚀';
  if (ratio >= 0.5) return 'เก่งมากแล้ว มาเรียนเพิ่มเติมกับเราจะเก่งกว่านี้อีกแน่นอน!';
  return 'ไม่เป็นไรนะ มาเริ่มต้นเรียนรู้ไปด้วยกันกับ BotBuilder!';
});

const resultIcon = computed(() => {
  const ratio = score.value / questions.length;
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
