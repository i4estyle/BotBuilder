<template>
  <div class="discovery-class__photo" data-reveal>
    <img
      :src="resolveAssetUrl('/src/assets/landing/playlearn.png')"
      alt="เด็กกำลังทดลองเรียนหุ่นยนต์ที่ BotBuilder"
    />
    <div class="discovery-class__photo-caption">
      <span>ROBOTICS DISCOVERY CLASS</span>
      <strong>ให้เด็กได้สร้าง ลอง และอธิบายด้วยตัวเอง</strong>
    </div>
  </div>
  <div class="discovery-class__panel" data-reveal>
    <p class="section-kicker">ROBOTICS DISCOVERY CLASS</p>
    <h2>อย่าเดาว่าลูกเหมาะกับระดับไหน ให้เด็กได้ลองจริงก่อน</h2>
    <p class="discovery-class__lead">
      หลังทดลอง ผู้ปกครองจะได้รับ Feedback สั้น ๆ ว่าน้องสนใจอะไร ทำงานแบบไหน และ Learning Path
      ใดเหมาะที่สุด
    </p>
    <form class="discovery-class__form">
      <div class="discovery-class__form-grid">
        <label>
          อายุของน้อง
          <select aria-label="อายุของน้อง">
            <option>3–5 ปี</option>
            <option>6–9 ปี</option>
            <option>10–12 ปี</option>
            <option>13–16 ปี</option>
          </select>
        </label>
        <label>
          น้องสนใจอะไรที่สุด?
          <select aria-label="สิ่งที่น้องสนใจ">
            <option>ต่อของ / สร้างของ</option>
            <option>หุ่นยนต์ / เครื่องจักร</option>
            <option>เกม / Coding</option>
            <option>การแข่งขัน / ภารกิจ</option>
            <option>ยังไม่แน่ใจ</option>
          </select>
        </label>
        <label>
          ชื่อผู้ปกครอง
          <input type="text" placeholder="ชื่อ" />
        </label>
        <label>
          LINE / เบอร์โทร
          <input type="text" placeholder="@LINE หรือเบอร์โทร" />
        </label>
      </div>
      <AppButton href="https://line.me/R/ti/p/@botbuilderthailand" class="discovery-class__cta">
        รับคำแนะนำ + จอง Discovery Class
      </AppButton>
      <small>ทีมครูจะช่วยแนะนำจากสิ่งที่น้องได้ลองทำจริง</small>
    </form>
  </div>
</template>

<script setup lang="ts">
import AppButton from '@/components/landing/AppButton.vue';
import { resolveAssetUrl } from '@/utils/asset-helper';
</script>
