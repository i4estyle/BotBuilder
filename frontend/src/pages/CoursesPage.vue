<template>
  <q-page class="landing-page">
    <SiteHeader />
    <main>
      <PageHero :eyebrow="t('courses.eyebrow')" :title="t('courses.title')">
        <p>{{ t('courses.paragraph') }}</p>
      </PageHero>
      <section class="section">
        <div class="courses-grid">
          <CourseCard v-for="(course, index) in courses" :key="index" v-bind="course" />
        </div>
      </section>
    </main>
    <SiteFooter />
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CourseCard from '@/components/landing/CourseCard.vue';
import PageHero from '@/components/landing/PageHero.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import explorerImage from '@/assets/landing/roboticcamp.png';
import masterImage from '@/assets/landing/precompete.png';
import starterImage from '@/assets/landing/playlearn.png';

const i18n = useI18n();
const { t } = i18n;

const courseImages = [starterImage, explorerImage, masterImage];
const courses = computed(() => {
  const items = i18n.tm('courses.items');
  return items.map((item, index) => ({ ...item, image: courseImages[index]! }));
});
</script>
