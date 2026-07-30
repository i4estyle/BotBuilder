<template>
  <q-page class="landing-page">
    <SiteHeader />
    <main>
      <PageHero
        eyebrow="ABOUT BOT BUILDER"
        title="เราเชื่อว่าการเรียนรู้ที่ดีที่สุด คือการได้ลงมือสร้าง"
      >
        <p>
          Bot Builder สร้างพื้นที่การเรียนรู้ที่เด็ก ๆ ได้ทดลอง คิด และเติบโตไปพร้อมกับเทคโนโลยี
        </p>
      </PageHero>
      <section class="section section--muted about-grid">
        <div>
          <SectionHeading title="พันธกิจของเรา" :centered="false" />
          <p>
            เราพัฒนาทักษะแห่งอนาคตผ่านการเรียนรู้ด้านวิทยาศาสตร์ เทคโนโลยี วิศวกรรมศาสตร์
            และคณิตศาสตร์อย่างสนุกสนาน
          </p>
        </div>
        <img :src="heroImage" alt="เด็ก ๆ ทำกิจกรรมกับ Bot Builder" />
      </section>
    </main>
    <SiteFooter />
  </q-page>
</template>

<script setup lang="ts">
import PageHero from '@/components/landing/PageHero.vue';
import SectionHeading from '@/components/landing/SectionHeading.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import heroImage from '@/assets/landing/hero.jpeg';
</script>
