<template>
  <q-page class="landing-page">
    <SiteHeader />
    <main>
      <PageHero :eyebrow="t('about.eyebrow')" :title="t('about.title')">
        <p>{{ t('about.intro') }}</p>
      </PageHero>
      <section class="section section--muted about-grid">
        <div>
          <SectionHeading :title="t('about.missionHeading')" :centered="false" />
          <p>{{ t('about.missionText') }}</p>
        </div>
        <img :src="heroImage" :alt="t('about.imageAlt')" />
      </section>
    </main>
    <SiteFooter />
  </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import PageHero from '@/components/landing/PageHero.vue';
import SectionHeading from '@/components/landing/SectionHeading.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import heroImage from '@/assets/landing/hero.jpeg';

const { t } = useI18n();
</script>
