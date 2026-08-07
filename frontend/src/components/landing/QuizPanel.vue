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

        <div v-if="!answered" class="quiz-panel__confirm">
          <AppButton variant="green" :disabled="selectedIndex === null" @click="confirmAnswer">
            ยืนยันคำตอบ
          </AppButton>
        </div>

        <div v-if="answered" class="quiz-panel__feedback">
          <p v-if="isCorrect">ถูกต้อง! เก่งมาก</p>
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

const allQuestions: Question[] = [
  {
    question: 'ส่วนประกอบใดของ LEGO SPIKE Prime ที่เปรียบเสมือน "สมอง" ของหุ่นยนต์?',
    options: ['มอเตอร์ (Motor)', 'เซนเซอร์ (Sensor)', 'ฮับ (Hub)', 'แบตเตอรี่ (Battery)'],
    correctIndex: 2,
  },
  {
    question: 'พอร์ต (Port) สำหรับเชื่อมต่อสายไฟบน SPIKE Prime Hub มีทั้งหมดกี่ช่อง?',
    options: ['4 ช่อง (A-D)', '6 ช่อง (A-F)', '8 ช่อง (A-H)', '10 ช่อง (A-J)'],
    correctIndex: 1,
  },
  {
    question: 'ไฟ LED Matrix ที่แสดงผลอยู่บนหน้าจอของ SPIKE Prime Hub มีขนาดเท่าใด?',
    options: ['3x3', '4x4', '5x5', '6x6'],
    correctIndex: 2,
  },
  {
    question: 'เซนเซอร์ชนิดใดที่ใช้คลื่นเสียงในการตรวจจับสิ่งกีดขวางและวัดระยะห่าง?',
    options: [
      'Color Sensor (เซนเซอร์สี)',
      'Distance Sensor (เซนเซอร์วัดระยะทาง)',
      'Force Sensor (เซนเซอร์แรงกด)',
      'Gyro Sensor (เซนเซอร์วัดความเอียง)',
    ],
    correctIndex: 1,
  },
  {
    question: 'Color Sensor (เซนเซอร์สี) ไม่สามารถทำสิ่งใดได้?',
    options: [
      'ตรวจจับสีของวัตถุ',
      'ตรวจวัดความเข้มของแสงสะท้อน (Reflected Light)',
      'ตรวจวัดความสว่างของแสงรอบข้าง (Ambient Light)',
      'วัดอุณหภูมิของวัตถุ',
    ],
    correctIndex: 3,
  },
  {
    question: 'เซนเซอร์ Gyro ที่ติดตั้งอยู่ภายใน Hub (Built-in) ทำหน้าที่อะไร?',
    options: [
      'วัดระดับความดังของเสียง',
      'ตรวจจับความชื้นในอากาศ',
      'ตรวจจับตำแหน่ง GPS',
      'วัดองศาการเอียงและทิศทางการหมุนของหุ่นยนต์',
    ],
    correctIndex: 3,
  },
  {
    question: 'Force Sensor (เซนเซอร์แรงกด) สามารถบอกสถานะอะไรได้บ้าง?',
    options: [
      'ถูกกด, ถูกปล่อย, และน้ำหนักแรงกด',
      'สีของวัตถุที่มากด',
      'ระยะห่างของวัตถุก่อนที่จะชน',
      'อุณหภูมิของนิ้วที่กด',
    ],
    correctIndex: 0,
  },
  {
    question: 'ในแอปพลิเคชัน SPIKE หมวดหมู่บล็อกคำสั่งสีเหลือง (Events) มีไว้สำหรับทำอะไร?',
    options: [
      'ควบคุมการเคลื่อนที่',
      'เป็นจุดเริ่มต้นหรือตัวจุดชนวนให้โปรแกรมทำงาน (เช่น เมื่อกดปุ่ม)',
      'สั่งให้เล่นเสียงดนตรี',
      'เป็นเงื่อนไขการคำนวณทางคณิตศาสตร์',
    ],
    correctIndex: 1,
  },
  {
    question: 'หากต้องการให้หุ่นยนต์เดินหน้าหรือถอยหลัง ต้องใช้บล็อกคำสั่งในหมวดหมู่ใด?',
    options: ['Sound (สีม่วง)', 'Events (สีเหลือง)', 'Movement (สีชมพู)', 'Sensors (สีฟ้า)'],
    correctIndex: 2,
  },
  {
    question: 'ความแตกต่างระหว่างคำสั่งหมวดหมู่ "Motors" (สีน้ำเงิน) และ "Movement" (สีชมพู) คืออะไร?',
    options: [
      'Motors ควบคุมความเร็ว / Movement ควบคุมทิศทาง',
      'Motors ใช้กับเซนเซอร์ / Movement ใช้กับมอเตอร์',
      'Motors ควบคุมมอเตอร์ทีละ 1 ตัว / Movement ควบคุมมอเตอร์ 2 ตัวพร้อมกัน (เช่น ล้อซ้าย-ขวา)',
      'ไม่มีข้อแตกต่าง สามารถใช้แทนกันได้',
    ],
    correctIndex: 2,
  },
  {
    question: 'บล็อกคำสั่ง "Forever" มีหน้าที่อะไรในการเขียนโปรแกรม?',
    options: [
      'ทำให้หุ่นยนต์หยุดทำงานตลอดไป',
      'สั่งให้โปรแกรมลบข้อมูลที่ไม่ได้ใช้',
      'ทำให้โปรแกรมทำงานในบล็อกนั้นซ้ำไปเรื่อยๆ ไม่มีที่สิ้นสุด',
      'เป็นการบันทึกโปรแกรมลงในฮับถาวร',
    ],
    correctIndex: 2,
  },
  {
    question: 'บล็อกคำสั่ง "If... then..." เป็นการเขียนโปรแกรมในลักษณะใด?',
    options: [
      'การสร้างตัวแปร',
      'การวนซ้ำ (Loop)',
      'การตัดสินใจตามเงื่อนไข (Condition)',
      'การคำนวณทางคณิตศาสตร์',
    ],
    correctIndex: 2,
  },
  {
    question: 'หากต้องการให้หุ่นยนต์วิ่งไปข้างหน้า จนกว่าจะเจอเส้นสีดำถึงจะหยุด ควรใช้คำสั่งใดร่วมกับ Color Sensor?',
    options: ['Wait for 1 second', 'Wait until (Color is Black)', 'Repeat 10 times', 'Stop all'],
    correctIndex: 1,
  },
  {
    question: 'มอเตอร์ที่มาในชุด LEGO SPIKE Prime มีทั้งหมดกี่ขนาด?',
    options: ['1 ขนาด', '2 ขนาด (Medium และ Large)', '3 ขนาด (Small, Medium, Large)', '4 ขนาด'],
    correctIndex: 1,
  },
  {
    question: 'ตัวแปร (Variable) ในการเขียนโปรแกรมเปรียบเสมือนสิ่งใด?',
    options: [
      'กล่องสำหรับเก็บค่าหรือข้อมูลที่สามารถนำมาใช้หรือเปลี่ยนแปลงได้',
      'สายไฟที่เชื่อมต่อระหว่างอุปกรณ์',
      'เครื่องยนต์ที่ให้พลังงาน',
      'หน้าจอสำหรับแสดงผล',
    ],
    correctIndex: 0,
  },
  {
    question: 'การเขียนโปรแกรมสั่งงานหุ่นยนต์จากคำสั่งบนสุดลงมาล่างสุดตามลำดับ เรียกว่าอะไร?',
    options: ['Debugging', 'Sequence (การทำงานตามลำดับ)', 'Loop (การวนซ้ำ)', 'Algorithm (อัลกอริทึม)'],
    correctIndex: 1,
  },
  {
    question: '"Debugging" (การดีบัก) หมายถึงอะไรในการสร้างและเขียนโปรแกรมหุ่นยนต์?',
    options: [
      'การถอดชิ้นส่วนหุ่นยนต์เก็บใส่กล่อง',
      'การทำความสะอาดเซนเซอร์',
      'การชาร์จแบตเตอรี่ให้เต็ม',
      'การค้นหาและแก้ไขข้อผิดพลาดในตัวโปรแกรมหรือการประกอบหุ่นยนต์',
    ],
    correctIndex: 3,
  },
  {
    question: 'หากเขียนโปรแกรมสั่งให้หุ่นยนต์เดินหน้าตรง แต่หุ่นยนต์กลับหมุนเป็นวงกลม สาเหตุที่เป็นไปได้มากที่สุดคืออะไร?',
    options: [
      'แบตเตอรี่เหลือน้อยเกินไป',
      'ใส่ล้อหุ่นยนต์กลับด้าน',
      'ลืมตั้งค่าพอร์ตให้ตรงกับที่เสียบมอเตอร์ซ้าย-ขวา ทำให้มอเตอร์หมุนไปทิศทางเดียวกัน',
      'เชื่อมต่อบลูทูธไม่สำเร็จ',
    ],
    correctIndex: 2,
  },
  {
    question: 'บล็อกคำสั่งสำหรับการคำนวณ (Operators) เช่น บวก ลบ คูณ หาร หรือสุ่มตัวเลข จะอยู่ในหมวดหมู่สีอะไร?',
    options: ['สีเขียว', 'สีส้ม', 'สีเหลือง', 'สีฟ้า'],
    correctIndex: 0,
  },
  {
    question: 'ข้อใดคือเป้าหมายหลักของการใช้ "การวนซ้ำ" (Loop) เช่นคำสั่ง Repeat ในการเขียนโปรแกรม?',
    options: [
      'ทำให้หุ่นยนต์ทำงานได้เร็วขึ้นสองเท่า',
      'ลดความยาวของโค้ด และไม่ต้องเขียนคำสั่งเดิมซ้ำๆ หลายครั้ง',
      'ทำให้หุ่นยนต์ประหยัดพลังงานแบตเตอรี่',
      'ป้องกันไม่ให้หุ่นยนต์ชนกำแพง',
    ],
    correctIndex: 1,
  },
];

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
  return shuffle(allQuestions).slice(0, QUIZ_LENGTH);
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
  if (ratio >= 0.8) return 'สุดยอดไปเลย! พร้อมลุยคอร์สหุ่นยนต์กับเราแล้ว 🚀';
  if (ratio >= 0.5) return 'เก่งมากแล้ว มาเรียนเพิ่มเติมกับเราจะเก่งกว่านี้อีกแน่นอน!';
  return 'ไม่เป็นไรนะ มาเริ่มต้นเรียนรู้ไปด้วยกันกับ BotBuilder!';
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
