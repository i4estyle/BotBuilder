<template>
  <section
    id="preview-section-studentProjects"
    class="section student-projects admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'studentProjects')"
  >
    <div class="student-projects__intro">
      <p class="section-kicker">STUDENT WORK AS EVIDENCE</p>
      <h2>ผลงานไม่ใช่แค่ “ของที่ทำเสร็จ” แต่คือหลักฐานของวิธีคิด</h2>
      <p>
        ภาพเด็กและผลงานจริงควรเล่าโจทย์ การทดลอง และสิ่งที่เด็กแก้ไข มากกว่าการวางภาพโมเดลแบบ
        catalog
      </p>
    </div>

    <div class="student-projects__grid">
      <article class="student-projects__feature">
        <div
          class="admin-image-hover-trigger"
          data-image-key="studentProjects.feature"
          data-style-key="studentProjects.feature"
          style="width: 100%; height: 100%"
        >
          <img
            :src="resolveAssetUrl('/src/assets/landing/exploringspace.png')"
            alt="เด็กกำลังโชว์ผลงานหุ่นยนต์"
          />
          <div class="admin-image-hover-overlay">
            <q-icon name="photo_camera" size="28px" />
            <span>ปรับแต่งรูป</span>
          </div>
        </div>
        <div class="student-projects__overlay">
          <span>STUDENT PROJECT</span>
          <h3>Build something you can explain</h3>
          <p>เด็กควรรู้ว่าชิ้นส่วนแต่ละส่วนทำอะไร และอธิบายเหตุผลของวิธีสร้างตัวเองได้</p>
        </div>
      </article>

      <div class="student-projects__stack">
        <article>
          <div
            class="admin-image-hover-trigger"
            data-image-key="studentProjects.stack1"
            data-style-key="studentProjects.stack1"
            style="width: 100%; height: 100%"
          >
            <img
              :src="resolveAssetUrl('/src/assets/landing/playlearn.png')"
              alt="เด็กกำลังประกอบโมเดล"
            />
            <div class="admin-image-hover-overlay">
              <q-icon name="photo_camera" size="24px" />
              <span>ปรับแต่งรูป</span>
            </div>
          </div>
          <div class="student-projects__overlay">
            <span>PROCESS</span>
            <h3>From parts to idea</h3>
          </div>
        </article>

        <article>
          <div
            class="admin-image-hover-trigger"
            data-image-key="studentProjects.stack2"
            data-style-key="studentProjects.stack2"
            style="width: 100%; height: 100%"
          >
            <img
              :src="resolveAssetUrl('/src/assets/landing/roboticcamp.png')"
              alt="บรรยากาศสนามหุ่นยนต์"
            />
            <div class="admin-image-hover-overlay">
              <q-icon name="photo_camera" size="24px" />
              <span>ปรับแต่งรูป</span>
            </div>
          </div>
          <div class="student-projects__overlay">
            <span>MISSION</span>
            <h3>Make it work in the real field</h3>
          </div>
        </article>
      </div>
    </div>

    <AdminSectionBlockLayer section-id="studentProjects" />
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
