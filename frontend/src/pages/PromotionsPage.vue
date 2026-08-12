<template>
  <q-page class="landing-page promotions-page">
    <SiteHeader />

    <main>
      <section class="promotions-hero">
        <p class="promotions-hero__eyebrow">{{ t('promotions.eyebrow') }}</p>
        <h1>{{ t('promotions.title') }}</h1>
        <span class="promotions-hero__line" />
        <p>{{ t('promotions.subtitle') }}</p>
      </section>

      <section class="promotion-list" aria-labelledby="promotion-list-title">
        <h2 id="promotion-list-title">{{ t('promotions.listHeading') }}</h2>
      </section>

      <section
        v-for="(promotion, index) in promotions"
        :key="index"
        class="promotion-course"
        :class="{ 'promotion-course--alt': index % 2 === 1 }"
      >
        <div class="promotion-course__inner">
          <div class="promotion-course__image">
            <img :src="promotion.image" :alt="promotion.title" />
          </div>
          <div class="promotion-course__content">
            <span>{{ promotion.label }}</span>
            <h3>{{ promotion.title }}</h3>
            <p v-for="(line, i) in promotion.description" :key="i">{{ line }}</p>
            <ul v-if="promotion.details" class="promotion-course__details">
              <li v-for="detail in promotion.details" :key="detail">{{ detail }}</li>
            </ul>
            <p v-if="promotion.likeUrl" class="promotion-course__like">
              {{ promotion.likeText }}
              <a :href="promotion.likeUrl" target="_blank" rel="noopener">{{ promotion.likeLabel }}</a>
            </p>
            <p v-if="promotion.price" class="promotion-course__price">{{ promotion.price }}</p>
            <p v-if="promotion.note" class="promotion-course__note">{{ promotion.note }}</p>
          </div>
        </div>
      </section>

      <section class="promotion-cta">
        <div>
          <p>{{ t('promotions.cta.eyebrow') }}</p>
          <h2>{{ t('promotions.cta.heading') }}</h2>
        </div>
        <a href="https://www.facebook.com/BotBuilderThailand/" target="_blank" class="promotion-cta__button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path
              d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z"
            />
          </svg>
          {{ t('promotions.cta.button') }}
        </a>
      </section>
    </main>

    <SiteFooter />
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import promotionImage from '@/assets/landing/promotions.png';
import happyPlayTimeImage from '@/assets/landing/happyplaytime.png';
import exploringSpaceImage from '@/assets/landing/exploringspace.png';
import takeawayMicrobitImage from '@/assets/landing/takeaway.png';
import takeawayPythonImage from '@/assets/landing/takegreen.png';

const i18n = useI18n();
const { t } = i18n;

const promotionImages = [
  promotionImage,
  happyPlayTimeImage,
  exploringSpaceImage,
  takeawayMicrobitImage,
  takeawayPythonImage,
];
const promotionExtras: { likeUrl?: string }[] = [
  { likeUrl: 'https://www.facebook.com/BotBuilderThailand/' },
  {},
  {},
  {},
  {},
];
const promotions = computed(() => {
  const items = i18n.tm('promotions.items');
  return items.map((item, index) => ({
    ...item,
    image: promotionImages[index]!,
    ...promotionExtras[index]!,
  }));
});
</script>

<style scoped lang="scss">
@use '@/css/pages/promotions';
</style>
