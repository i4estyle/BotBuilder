<template>
  <div class="faq__intro" data-reveal>
    <p class="section-kicker">PARENT FAQ</p>
    <h2>คำถามก่อนเริ่มเรียน</h2>
    <p>เรื่องที่ผู้ปกครองมักสงสัยก่อนพาเด็ก ๆ มาลองสร้าง คิด และเขียนโค้ดจริง</p>
  </div>
  <div class="faq__items" data-reveal>
    <article
      v-for="(item, index) in faqItems"
      :key="item.question"
      class="faq__item"
      :class="{ 'is-open': openItemIndex === index }"
    >
      <button
        type="button"
        class="faq__question"
        :aria-expanded="openItemIndex === index"
        @click="toggleItem(index)"
      >
        <strong>{{ item.question }}</strong
        ><i aria-hidden="true" />
      </button>
      <div class="faq__answer">
        <p>{{ item.answer }}</p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: 'ลูกยังอ่านไม่คล่อง เริ่ม Coding ได้ไหม?',
    answer:
      'ได้ครับ ระดับเริ่มต้นเรียนผ่านการสร้าง การเรียงลำดับ และ visual logic ก่อนเพิ่มความซับซ้อนของภาษาโปรแกรม',
  },
  {
    question: 'ต้องเก่งคณิตศาสตร์ก่อนหรือไม่?',
    answer:
      'ไม่จำเป็น เราเริ่มจากการคิดเป็นขั้นตอน ทดลอง และแก้ปัญหา แล้วจึงค่อยเชื่อมความรู้ STEM เข้ากับภารกิจ',
  },
  {
    question: 'ต่างจากการต่อ LEGO เล่นอย่างไร?',
    answer:
      'ทุกกิจกรรมมีโจทย์ การทดสอบ และการสะท้อนผล เด็กต้องทำให้สิ่งที่สร้างทำงานและอธิบายเหตุผลของตัวเองได้',
  },
  {
    question: 'ถ้าลูกเรียนเร็วกว่าอายุล่ะ?',
    answer: 'ครูจะเพิ่มความยากของโจทย์ โค้ด หรือฮาร์ดแวร์ตามความสามารถจริงของน้อง',
  },
];

const openItemIndex = ref<number | null>(null);

function toggleItem(index: number): void {
  openItemIndex.value = openItemIndex.value === index ? null : index;
}
</script>
