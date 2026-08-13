<template>
  <q-page class="landing-page">
    <SiteHeader />
    <main>
      <PageHero :eyebrow="aboutPageData.eyebrow" :title="aboutPageData.title">
        <p>{{ aboutPageData.intro }}</p>
      </PageHero>
      <section class="section section--muted about-grid">
        <div>
          <SectionHeading :title="aboutPageData.missionHeading" :centered="false" />
          <p>{{ aboutPageData.missionText }}</p>
        </div>
        <img :src="aboutPageData.image" :alt="aboutPageData.imageAlt" />
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
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { aboutPage: aboutPageData } = useWebsiteEditor();
</script>
