<template>
  <q-page class="landing-page courses-page">
    <main>
      <template v-for="item in visibleNavSections" :key="item.id">
        <SiteHeader v-if="item.id === 'header'" />
        <section v-else-if="item.id === 'coursesHero'" style="position: relative">
          <PageHero
            :eyebrow="coursesPageData.eyebrow"
            :title="coursesPageData.title"
            :eyebrow-style="getStyleOverride('coursesPage.eyebrow')"
            :title-style="getStyleOverride('coursesPage.title')"
          >
            <p :style="getStyleOverride('coursesPage.paragraph')">
              {{ coursesPageData.paragraph }}
            </p>
          </PageHero>
          <AdminSectionBlockLayer section-id="coursesHero" />
        </section>
        <section v-else-if="item.id === 'coursesList'" class="section">
          <div class="courses-grid">
            <CourseCard
              v-for="(course, index) in coursesPageData.items"
              :key="index"
              v-bind="course"
              :index="index"
              :button-text="coursesPageData.buttonText"
            />
          </div>
          <AdminSectionBlockLayer section-id="coursesList" />
        </section>
        <CustomSection
          v-else-if="item.isCustomPage && getCustomBlock(item.id)"
          :id="item.id"
          :block="getCustomBlock(item.id)!"
          data-reveal
        >
          <AdminSectionBlockLayer :section-id="item.id" />
        </CustomSection>
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
import CustomSection from '@/components/landing/CustomSection.vue';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const {
  coursesPage: coursesPageData,
  customBlocks,
  visibleNavSections,
  editorLocale,
  fetchPageData,
  getStyleOverride,
} = useWebsiteEditor();

function getCustomBlock(id: string) {
  return customBlocks.find((b) => b.id === id);
}

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
