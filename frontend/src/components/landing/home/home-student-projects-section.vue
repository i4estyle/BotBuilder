<template>
  <div class="student-projects__intro" data-reveal>
    <p class="section-kicker">STUDENT WORK AS EVIDENCE</p>
    <h2>ผลงานไม่ใช่แค่ “ของที่ทำเสร็จ” แต่คือหลักฐานของวิธีคิด</h2>
    <p>
      ภาพเด็กและผลงานจริงควรเล่าโจทย์ การทดลอง และสิ่งที่เด็กแก้ไข มากกว่าการวางภาพโมเดลแบบ catalog
    </p>
  </div>
  <div class="student-projects__grid" data-reveal>
    <article class="student-projects__feature">
      <img
        :src="resolveAssetUrl('/src/assets/landing/exploringspace.png')"
        alt="เด็กกำลังโชว์ผลงานหุ่นยนต์"
      />
      <div class="student-projects__overlay">
        <span>STUDENT PROJECT</span>
        <h3>Build something you can explain</h3>
        <p>เด็กควรรู้ว่าชิ้นส่วนแต่ละส่วนทำอะไร และอธิบายเหตุผลของวิธีสร้างตัวเองได้</p>
      </div>
    </article>
    <div class="student-projects__stack">
      <article>
        <img
          :src="resolveAssetUrl('/src/assets/landing/playlearn.png')"
          alt="เด็กกำลังประกอบโมเดล"
        />
        <div class="student-projects__overlay">
          <span>PROCESS</span>
          <h3>From parts to idea</h3>
        </div>
      </article>
      <article>
        <img
          :src="resolveAssetUrl('/src/assets/landing/roboticcamp.png')"
          alt="บรรยากาศสนามหุ่นยนต์"
        />
        <div class="student-projects__overlay">
          <span>MISSION</span>
          <h3>Make it work in the real field</h3>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { resolveAssetUrl } from '@/utils/asset-helper';
</script>
