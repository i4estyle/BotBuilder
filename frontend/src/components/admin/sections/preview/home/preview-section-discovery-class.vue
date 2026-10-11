<template>
  <section
    id="preview-section-discoveryClass"
    class="section discovery-class admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'discoveryClass')"
  >
    <div
      class="discovery-class__photo admin-image-hover-trigger"
      data-image-key="discoveryClass.photo"
      data-style-key="discoveryClass.photo"
    >
      <img
        :src="resolveAssetUrl('/src/assets/landing/playlearn.png')"
        alt="เด็กกำลังทดลองเรียนหุ่นยนต์ที่ BotBuilder"
      />
      <div class="discovery-class__photo-caption">
        <span>ROBOTICS DISCOVERY CLASS</span>
        <strong>ให้เด็กได้สร้าง ลอง และอธิบายด้วยตัวเอง</strong>
      </div>
      <div class="admin-image-hover-overlay">
        <q-icon name="photo_camera" size="28px" />
        <span>ปรับแต่งรูป</span>
      </div>
    </div>

    <div class="discovery-class__panel">
      <p class="section-kicker">ROBOTICS DISCOVERY CLASS</p>
      <h2>อย่าเดาว่าลูกเหมาะกับระดับไหน ให้เด็กได้ลองจริงก่อน</h2>
      <p class="discovery-class__lead">
        หลังทดลอง ผู้ปกครองจะได้รับ Feedback สั้น ๆ ว่าน้องสนใจอะไร ทำงานแบบไหน และ Learning Path
        ใดเหมาะที่สุด
      </p>

      <form class="discovery-class__form" @submit.prevent>
        <div class="discovery-class__form-grid">
          <label>
            อายุของน้อง
            <select aria-label="อายุของน้อง" disabled>
              <option>3–5 ปี</option>
              <option>6–9 ปี</option>
              <option>10–12 ปี</option>
              <option>13–16 ปี</option>
            </select>
          </label>
          <label>
            น้องสนใจอะไรที่สุด?
            <select aria-label="สิ่งที่น้องสนใจ" disabled>
              <option>ต่อของ / สร้างของ</option>
              <option>หุ่นยนต์ / เครื่องจักร</option>
              <option>เกม / Coding</option>
              <option>การแข่งขัน / ภารกิจ</option>
              <option>ยังไม่แน่ใจ</option>
            </select>
          </label>
          <label>
            ชื่อผู้ปกครอง
            <input type="text" placeholder="ชื่อ" disabled />
          </label>
          <label>
            LINE / เบอร์โทร
            <input type="text" placeholder="@LINE หรือเบอร์โทร" disabled />
          </label>
        </div>
        <AppButton class="discovery-class__cta"> รับคำแนะนำ + จอง Discovery Class </AppButton>
        <small>ทีมครูจะช่วยแนะนำจากสิ่งที่น้องได้ลองทำจริง</small>
      </form>
    </div>

    <AdminSectionBlockLayer section-id="discoveryClass" />
  </section>
</template>

<script setup lang="ts">
import AppButton from '@/components/landing/AppButton.vue';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { resolveAssetUrl } from '@/utils/asset-helper';

defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();
</script>
