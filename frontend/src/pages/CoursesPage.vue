<template>
  <q-page class="landing-page">
    <SiteHeader />
    <main>
      <PageHero :eyebrow="coursesPageData.eyebrow" :title="coursesPageData.title">
        <p>{{ coursesPageData.paragraph }}</p>
      </PageHero>
      <section class="section">
        <div class="courses-grid">
          <CourseCard
            v-for="(course, index) in coursesPageData.items"
            :key="index"
            v-bind="course"
            :button-text="coursesPageData.buttonText"
          />
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
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { coursesPage: coursesPageData } = useWebsiteEditor();
</script>
