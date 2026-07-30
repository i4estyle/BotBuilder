<template>
  <q-page class="landing-page">
    <SiteHeader />
    <main>
      <PageHero eyebrow="SPECIAL OFFERS" title="โปรโมชั่นและกิจกรรม">
        <p>ติดตามสิทธิพิเศษสำหรับคอร์สเรียน เวิร์กช็อป และกิจกรรมหุ่นยนต์ของ Bot Builder</p>
      </PageHero>
      <section class="section section--muted">
        <div class="content-card content-card--center">
          <q-icon name="campaign" />
          <h2>รับสิทธิ์ทดลองเรียนฟรี</h2>
          <p>นัดหมายคลาสทดลองเพื่อค้นหาคอร์สที่เหมาะกับน้อง ๆ ได้แล้ววันนี้</p>
          <AppButton>BOOK YOUR FREE TRIAL</AppButton>
        </div>
      </section>
    </main>
    <SiteFooter />
  </q-page>
</template>

<script setup lang="ts">
import AppButton from '@/components/landing/AppButton.vue';
import PageHero from '@/components/landing/PageHero.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
</script>
