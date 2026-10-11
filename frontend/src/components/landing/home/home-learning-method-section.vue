<template>
  <div class="learning-method__content">
    <div class="learning-method__copy" data-reveal>
      <p class="section-kicker">HOW BOTBUILDER TEACHES</p>
      <h2>Build. Code. Solve. Present.</h2>
      <p>
        เป้าหมายของหนึ่งคลาสไม่ใช่ “ต่อเสร็จ” แต่คือเด็กเข้าใจว่าทำไมมันจึงทำงาน
        และรู้ว่าจะทำอย่างไรเมื่อครั้งแรกยังไม่สำเร็จ
      </p>
    </div>
    <ol class="learning-method__steps" data-reveal>
      <li>
        <span>01</span>
        <h3>Build</h3>
        <p>เข้าใจโครงสร้าง กลไก เฟือง คาน ล้อ และการเคลื่อนไหวจากของจริง</p>
      </li>
      <li>
        <span>02</span>
        <h3>Code</h3>
        <p>ใช้ Event, Input, Decision และ Action เพื่อควบคุมสิ่งที่ตัวเองสร้าง</p>
      </li>
      <li>
        <span>03</span>
        <h3>Solve</h3>
        <p>Test → Fail → Fix เปลี่ยนทีละตัวแปร ทดลองซ้ำ และหาคำตอบจากผลจริง</p>
      </li>
      <li>
        <span>04</span>
        <h3>Present</h3>
        <p>อธิบายโจทย์ วิธีทำ ปัญหาที่เจอ และสิ่งที่ปรับแก้ด้วยเหตุผลของตัวเอง</p>
      </li>
    </ol>
  </div>
  <div class="learning-method__photo" data-reveal>
    <img
      :src="resolveAssetUrl('/src/assets/landing/Bot Builder-390.jpg')"
      alt="กระบวนการเรียนรู้ของ BotBuilder"
    />
  </div>
</template>

<script setup lang="ts">
import { resolveAssetUrl } from '@/utils/asset-helper';
</script>
