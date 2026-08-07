<template>
  <q-page class="landing-page">
    <SiteHeader />
    <main>
      <PageHero eyebrow="BOT BUILDER COURSES" title="หลักสูตรที่ออกแบบมาเพื่อเด็กแต่ละช่วงวัย">
        <p>เลือกเส้นทางการเรียนรู้ที่เหมาะกับความสนใจและระดับทักษะของบุตรหลาน</p>
      </PageHero>
      <section class="section">
        <div class="courses-grid">
          <CourseCard v-for="course in courses" :key="course.title" v-bind="course" />
        </div>
      </section>
    </main>
    <SiteFooter />
  </q-page>
</template>

<script setup lang="ts">
import CourseCard from '@/components/landing/CourseCard.vue';
import PageHero from '@/components/landing/PageHero.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import explorerImage from '@/assets/landing/roboticcamp.png';
import masterImage from '@/assets/landing/precompete.png';
import starterImage from '@/assets/landing/playlearn.png';

const courses = [
  {
    image: starterImage,
    title: 'Starter Coders',
    badge: '12 บทเรียน',
    description: 'ปูพื้นฐานการประกอบหุ่นยนต์และการใช้ Block-based coding แบบง่าย',
  },
  {
    image: explorerImage,
    title: 'Explorer Bots',
    badge: '24 บทเรียน',
    description: 'เรียนรู้การใช้งานเซนเซอร์ การเขียนโปรแกรม และการออกแบบหุ่นยนต์',
  },
  {
    image: masterImage,
    title: 'Master Engineers',
    badge: '36 บทเรียน',
    description: 'ยกระดับไอเดียด้วยการสร้างหุ่นยนต์อัตโนมัติและแก้โจทย์จากโลกจริง',
  },
];
</script>
