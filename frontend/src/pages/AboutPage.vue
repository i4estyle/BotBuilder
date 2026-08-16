<template>
  <q-page class="landing-page about-page">
    <main>
      <template v-for="item in navSections" :key="item.id">
        <SiteHeader v-if="item.id === 'header'" />
        <PageHero
          v-else-if="item.id === 'aboutHero'"
          :eyebrow="aboutPageData.eyebrow"
          :title="aboutPageData.title"
          :style="getStyleOverride('aboutPage.hero')"
        >
          <p :style="getStyleOverride('aboutPage.intro')">{{ aboutPageData.intro }}</p>
        </PageHero>
        <section v-else-if="item.id === 'aboutMission'" class="section section--muted about-grid">
          <div>
            <SectionHeading
              :title="aboutPageData.missionHeading"
              :centered="false"
              :style="getStyleOverride('aboutPage.missionHeading')"
            />
            <p :style="getStyleOverride('aboutPage.missionText')">
              {{ aboutPageData.missionText }}
            </p>
          </div>
          <img
            :src="resolveAssetUrl(aboutPageData.image)"
            :alt="aboutPageData.imageAlt"
            :style="getStyleOverride('aboutPage.image')"
          />
          <AdminSectionBlockLayer section-id="about" />
        </section>
        <SiteFooter v-else-if="item.id === 'footer'" />
      </template>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue';
import PageHero from '@/components/landing/PageHero.vue';
import SectionHeading from '@/components/landing/SectionHeading.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';

const {
  aboutPage: aboutPageData,
  navSections,
  editorLocale,
  fetchPageData,
  getStyleOverride,
} = useWebsiteEditor();

let liveSyncChannel: BroadcastChannel | null = null;

onMounted(async () => {
  await fetchPageData('about', editorLocale.value);

  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    liveSyncChannel = new BroadcastChannel('botbuilder-live-sync');
    liveSyncChannel.onmessage = async (ev) => {
      if (ev.data?.type === 'content-saved') {
        await fetchPageData('about', editorLocale.value);
      }
    };
  }
});

watch(editorLocale, async (newLoc) => {
  await fetchPageData('about', newLoc);
});

onBeforeUnmount(() => {
  liveSyncChannel?.close();
});
</script>
