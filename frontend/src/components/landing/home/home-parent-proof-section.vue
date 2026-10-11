<template>
  <div class="parent-proof__photos" data-reveal>
    <img
      :src="resolveAssetUrl('/src/assets/landing/inside1.jpg')"
      alt="ครูและนักเรียนในคลาส BotBuilder"
    />
    <img
      :src="resolveAssetUrl('/src/assets/landing/exploringspace.png')"
      alt="เด็กกับผลงานหุ่นยนต์"
    />
    <img
      :src="resolveAssetUrl('/src/assets/landing/roboticcamp.png')"
      alt="เด็กทดลองหุ่นยนต์บนสนาม"
    />
  </div>
  <div class="parent-proof__copy" data-reveal>
    <p class="section-kicker">PROOF OVER CLAIMS</p>
    <h2>สิ่งที่ผู้ปกครองควรเห็นหลังเรียน</h2>
    <p class="parent-proof__lead">
      แทนคำว่า “พัฒนาความคิดสร้างสรรค์” เว็บไซต์ควรแสดงหลักฐานของพัฒนาการ เป็นเรื่องราวที่ดูได้จริง
    </p>
    <ul class="parent-proof__list">
      <li>
        <b>01</b>
        <span
          ><strong>Student Project Case</strong><br />โจทย์ → วิธีออกแบบ → ปัญหา → วิธีแก้ →
          ผลลัพธ์</span
        >
      </li>
      <li>
        <b>02</b>
        <span
          ><strong>Progress Feedback</strong><br />Focus · Sequence · Problem Solving · Creativity ·
          Coding Level</span
        >
      </li>
      <li>
        <b>03</b>
        <span
          ><strong>Before / After</strong><br />เทียบผลงานแรกกับผลงานปัจจุบัน
          เพื่อให้เห็นพัฒนาการจริง</span
        >
      </li>
      <li>
        <b>04</b>
        <span
          ><strong>Student Voice</strong><br />ให้เด็กเป็นคนอธิบายผลงาน
          ไม่ใช่ให้แบรนด์พูดแทนทั้งหมด</span
        >
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { resolveAssetUrl } from '@/utils/asset-helper';
</script>
