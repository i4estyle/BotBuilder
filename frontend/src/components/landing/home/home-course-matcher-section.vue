<template>
  <div class="course-matcher__photo" data-reveal>
    <img
      :src="resolveAssetUrl('/src/assets/landing/inside1.jpg')"
      alt="เด็ก ๆ กำลังเรียนรู้และสร้างหุ่นยนต์"
    />
  </div>
  <div class="course-matcher__content" data-reveal>
    <p class="section-kicker">COURSE MATCHER</p>
    <h2>ลูกควรเริ่มตรงไหน?</h2>
    <p class="course-matcher__lead">
      อายุเป็นเพียงจุดเริ่มต้น ระดับที่เหมาะจริงควรดูทั้งความสนใจ สมาธิ การสร้าง การแก้ปัญหา
      และประสบการณ์ Coding เดิม
    </p>
    <div class="course-matcher__tabs" role="tablist" aria-label="เลือกช่วงอายุ">
      <button
        v-for="option in courseOptions"
        :key="option.id"
        type="button"
        :class="{ 'is-active': selectedOptionId === option.id }"
        role="tab"
        :aria-selected="selectedOptionId === option.id"
        @click="selectedOptionId = option.id"
      >
        {{ option.age }}
      </button>
    </div>
    <article class="course-matcher__result">
      <p>{{ selectedOption.tag }}</p>
      <h3>{{ selectedOption.title }}</h3>
      <span>{{ selectedOption.description }}</span>
      <div class="course-matcher__skills">
        <span v-for="skill in selectedOption.skills" :key="skill">{{ skill }}</span>
      </div>
      <div class="course-matcher__path"><b>Learning path:</b> {{ selectedOption.path }}</div>
      <AppButton class="course-matcher__cta" @click="emit('request-assessment')">
        ให้ครูช่วยประเมินจากการทดลองจริง
      </AppButton>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppButton from '@/components/landing/AppButton.vue';
import { resolveAssetUrl } from '@/utils/asset-helper';

interface CourseMatcherOption {
  id: 'little' | 'young' | 'challenge' | 'future';
  age: string;
  tag: string;
  title: string;
  description: string;
  skills: string[];
  path: string;
}

const emit = defineEmits<{
  'request-assessment': [];
}>();

const courseOptions: CourseMatcherOption[] = [
  {
    id: 'little',
    age: '3–5 ปี',
    tag: 'LITTLE BUILDER',
    title: 'เริ่มคิดแบบ Coding โดยไม่ต้องรอให้อ่านคล่อง',
    description:
      'ฝึกสมาธิ กล้ามเนื้อมัดเล็ก ลำดับ รูปทรง ทิศทาง และความสัมพันธ์ระหว่างเหตุ–ผล ผ่านการสร้างและเล่นอย่างมีเป้าหมาย',
    skills: ['Fine Motor', 'Sequence', 'Focus', 'Cause & Effect'],
    path: 'Beginner → Intermediate',
  },
  {
    id: 'young',
    age: '6–9 ปี',
    tag: 'YOUNG CREATOR',
    title: 'จากเด็กที่ชอบต่อของ สู่เด็กที่ควบคุมสิ่งที่สร้างได้',
    description:
      'เพิ่มความคิดสร้างสรรค์ การแก้ปัญหา และ Coding ผ่านหุ่นยนต์ที่เคลื่อนไหว ตอบสนอง และทำภารกิจได้จริง',
    skills: ['Mechanism', 'Sensor', 'Block Coding', 'Creative Build'],
    path: 'Intermediate → Creator',
  },
  {
    id: 'challenge',
    age: '10–12 ปี',
    tag: 'ROBOT CHALLENGER',
    title: 'ไม่ใช่แค่สร้างเสร็จ แต่ต้องทำให้หุ่นยนต์แก้ Mission ได้',
    description:
      'ฝึก Coding ที่เป็นระบบ การ Debug กลยุทธ์ภารกิจ และการนำเสนอ เพื่อรับโจทย์ที่ซับซ้อนขึ้น',
    skills: ['Algorithm', 'Navigation', 'Automation', 'Presentation'],
    path: 'Creator → Challenge → Competition',
  },
  {
    id: 'future',
    age: '13–16 ปี',
    tag: 'FUTURE DEVELOPER',
    title: 'เชื่อมหุ่นยนต์กับ Computing และ Engineering จริง',
    description:
      'ต่อยอดสู่ Micro:bit, Sensor, Algorithm, Control, Python และ Project Portfolio ที่ซับซ้อนขึ้น',
    skills: ['Micro:bit', 'Sensor', 'Control', 'Python'],
    path: 'Challenge → Micro:bit → Python / Portfolio',
  },
];

const selectedOptionId = ref<CourseMatcherOption['id']>('little');
const defaultOption = courseOptions[0]!;
const selectedOption = computed(
  () => courseOptions.find((option) => option.id === selectedOptionId.value) ?? defaultOption,
);
</script>
