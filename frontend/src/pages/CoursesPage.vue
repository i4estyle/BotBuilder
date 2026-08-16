<template>
  <q-page class="landing-page courses-page">
    <main>
      <template v-for="item in navSections" :key="item.id">
        <SiteHeader v-if="item.id === 'header'" />
        <PageHero
          v-else-if="item.id === 'coursesHero'"
          :eyebrow="coursesPageData.eyebrow"
          :title="coursesPageData.title"
          :style="getStyleOverride('coursesPage.hero')"
        >
          <p :style="getStyleOverride('coursesPage.paragraph')">{{ coursesPageData.paragraph }}</p>
        </PageHero>
        <section v-else-if="item.id === 'coursesList'" class="section">
          <div class="courses-grid">
            <CourseCard
              v-for="(course, index) in coursesPageData.items"
              :key="index"
              v-bind="course"
              :button-text="coursesPageData.buttonText"
              :style="getStyleOverride(`coursesPage.items.${index}`)"
            />
          </div>
          <AdminSectionBlockLayer section-id="courses" />
        </section>
        <SiteFooter v-else-if="item.id === 'footer'" />
      </template>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue';
import CourseCard from '@/components/landing/CourseCard.vue';
import PageHero from '@/components/landing/PageHero.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const {
  coursesPage: coursesPageData,
  navSections,
  editorLocale,
  fetchPageData,
  getStyleOverride,
} = useWebsiteEditor();

let liveSyncChannel: BroadcastChannel | null = null;

onMounted(async () => {
  await fetchPageData('courses', editorLocale.value);

  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    liveSyncChannel = new BroadcastChannel('botbuilder-live-sync');
    liveSyncChannel.onmessage = async (ev) => {
      if (ev.data?.type === 'content-saved') {
        await fetchPageData('courses', editorLocale.value);
      }
    };
  }
});

watch(editorLocale, async (newLoc) => {
  await fetchPageData('courses', newLoc);
});

onBeforeUnmount(() => {
  liveSyncChannel?.close();
});
</script>
