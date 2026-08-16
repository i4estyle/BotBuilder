<template>
  <q-page class="landing-page promotions-page">
    <main>
      <template v-for="item in navSections" :key="item.id">
        <SiteHeader v-if="item.id === 'header'" />
        <section v-else-if="item.id === 'promotionsHero'" class="promotions-hero">
          <p class="promotions-hero__eyebrow" :style="getStyleOverride('promotionsPage.eyebrow')">
            {{ promotionsPageData.eyebrow }}
          </p>
          <h1 :style="getStyleOverride('promotionsPage.title')">{{ promotionsPageData.title }}</h1>
          <span class="promotions-hero__line" />
          <p :style="getStyleOverride('promotionsPage.subtitle')">
            {{ promotionsPageData.subtitle }}
          </p>
          <AdminSectionBlockLayer section-id="promotionsHero" />
        </section>

        <div v-else-if="item.id === 'promotionsList'" class="promotion-list-wrapper">
          <section class="promotion-list" aria-labelledby="promotion-list-title">
            <h2 id="promotion-list-title" :style="getStyleOverride('promotionsPage.listHeading')">
              {{ promotionsPageData.listHeading }}
            </h2>
          </section>

          <section
            v-for="(promotion, index) in promotionsPageData.items"
            :key="index"
            class="promotion-course"
            :class="{ 'promotion-course--alt': index % 2 === 1 }"
          >
            <div class="promotion-course__inner">
              <div class="promotion-course__image">
                <img :src="resolveAssetUrl(promotion.image)" :alt="promotion.title" />
              </div>
              <div class="promotion-course__content">
                <span :style="getStyleOverride(`promotionsPage.items.${index}.label`)">{{
                  promotion.label
                }}</span>
                <h3 :style="getStyleOverride(`promotionsPage.items.${index}.title`)">
                  {{ promotion.title }}
                </h3>
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
        </div>

        <section v-else-if="item.id === 'promotionsCta'" class="promotion-cta">
          <div>
            <p :style="getStyleOverride('promotionsPage.cta.eyebrow')">
              {{ promotionsPageData.cta.eyebrow }}
            </p>
            <h2 :style="getStyleOverride('promotionsPage.cta.heading')">
              {{ promotionsPageData.cta.heading }}
            </h2>
          </div>
          <a
            href="https://www.facebook.com/BotBuilderThailand/"
            target="_blank"
            class="promotion-cta__button"
            :style="getStyleOverride('promotionsPage.cta.button')"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path
                d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z"
              />
            </svg>
            {{ promotionsPageData.cta.button }}
          </a>
          <AdminSectionBlockLayer section-id="promotionsCta" />
        </section>

        <SiteFooter v-else-if="item.id === 'footer'" />
      </template>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';

const {
  promotionsPage: promotionsPageData,
  navSections,
  editorLocale,
  fetchPageData,
  getStyleOverride,
} = useWebsiteEditor();

let liveSyncChannel: BroadcastChannel | null = null;

onMounted(async () => {
  await fetchPageData('promotions', editorLocale.value);

  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    liveSyncChannel = new BroadcastChannel('botbuilder-live-sync');
    liveSyncChannel.onmessage = async (ev) => {
      if (ev.data?.type === 'content-saved') {
        await fetchPageData('promotions', editorLocale.value);
      }
    };
  }
});

watch(editorLocale, async (newLoc) => {
  await fetchPageData('promotions', newLoc);
});

onBeforeUnmount(() => {
  liveSyncChannel?.close();
});
</script>

<style scoped lang="scss">
@use '@/css/pages/promotions';
</style>
