<template>
  <q-page class="landing-page">
    <SiteHeader />
    <main>
      <PageHero eyebrow="LEARN & EXPLORE" title="แหล่งเรียนรู้สำหรับนักสร้างตัวน้อย">
        <p>บทความ กิจกรรม และโจทย์สนุก ๆ ที่ช่วยต่อยอดการเรียนรู้ด้านหุ่นยนต์</p>
      </PageHero>
      <section class="section">
        <div class="resource-grid">
          <article v-for="resource in resources" :key="resource.title" class="resource-card">
            <q-icon :name="resource.icon" />
            <h2>{{ resource.title }}</h2>
            <p>{{ resource.text }}</p>
          </article>
        </div>
      </section>
    </main>
    <SiteFooter />
  </q-page>
</template>

<script setup lang="ts">
import PageHero from '@/components/landing/PageHero.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';

const resources = [
  { icon: 'article', title: 'บทความและเคล็ดลับ', text: 'แนวคิดสนุก ๆ สำหรับผู้ปกครองและนักเรียน' },
  { icon: 'extension', title: 'กิจกรรมที่บ้าน', text: 'ฝึกคิด ฝึกสร้าง และสนุกได้ทุกวัน' },
  { icon: 'emoji_events', title: 'การแข่งขัน', text: 'เตรียมตัวสู่สนามแข่งขันหุ่นยนต์' },
];
</script>
