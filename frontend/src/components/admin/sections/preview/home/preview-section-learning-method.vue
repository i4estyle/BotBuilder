<template>
  <section
    id="preview-section-learningMethod"
    class="section learning-method section--muted admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'learningMethod')"
  >
    <div class="learning-method__content">
      <div class="learning-method__copy">
        <p class="section-kicker">HOW BOTBUILDER TEACHES</p>
        <h2>Build. Code. Solve. Present.</h2>
        <p>
          เป้าหมายของหนึ่งคลาสไม่ใช่ “ต่อเสร็จ” แต่คือเด็กเข้าใจว่าทำไมมันจึงทำงาน
          และรู้ว่าจะทำอย่างไรเมื่อครั้งแรกยังไม่สำเร็จ
        </p>
      </div>

      <ol class="learning-method__steps">
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

    <div
      class="learning-method__photo admin-image-hover-trigger"
      data-image-key="learningMethod.photo"
      data-style-key="learningMethod.photo"
    >
      <img
        :src="resolveAssetUrl('/src/assets/landing/Bot Builder-390.jpg')"
        alt="กระบวนการเรียนรู้ของ BotBuilder"
      />
      <div class="admin-image-hover-overlay">
        <q-icon name="photo_camera" size="28px" />
        <span>ปรับแต่งรูป</span>
      </div>
    </div>

    <AdminSectionBlockLayer section-id="learningMethod" />
  </section>
</template>

<script setup lang="ts">
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { resolveAssetUrl } from '@/utils/asset-helper';

defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();
</script>
