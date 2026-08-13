<template>
  <q-page class="landing-page promotions-page">
    <SiteHeader />

    <main>
      <section class="promotions-hero">
        <p class="promotions-hero__eyebrow">{{ promotionsPageData.eyebrow }}</p>
        <h1>{{ promotionsPageData.title }}</h1>
        <span class="promotions-hero__line" />
        <p>{{ promotionsPageData.subtitle }}</p>
      </section>

      <section class="promotion-list" aria-labelledby="promotion-list-title">
        <h2 id="promotion-list-title">{{ promotionsPageData.listHeading }}</h2>
      </section>

      <section
        v-for="(promotion, index) in promotionsPageData.items"
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
              <a :href="promotion.likeUrl" target="_blank" rel="noopener">{{
                promotion.likeLabel
              }}</a>
            </p>
            <p v-if="promotion.price" class="promotion-course__price">{{ promotion.price }}</p>
            <p v-if="promotion.note" class="promotion-course__note">{{ promotion.note }}</p>
          </div>
        </div>
      </section>

      <section class="promotion-cta">
        <div>
          <p>{{ promotionsPageData.cta.eyebrow }}</p>
          <h2>{{ promotionsPageData.cta.heading }}</h2>
        </div>
        <a
          href="https://www.facebook.com/BotBuilderThailand/"
          target="_blank"
          class="promotion-cta__button"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path
              d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z"
            />
          </svg>
          {{ promotionsPageData.cta.button }}
        </a>
      </section>
    </main>

    <SiteFooter />
  </q-page>
</template>

<script setup lang="ts">
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { promotionsPage: promotionsPageData } = useWebsiteEditor();
</script>

<style scoped lang="scss">
@use '@/css/pages/promotions';
</style>
