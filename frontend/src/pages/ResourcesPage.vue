<template>
  <q-page class="landing-page resources-page">
    <main>
      <template v-for="item in navSections" :key="item.id">
        <SiteHeader v-if="item.id === 'header'" />
        <PageHero
          v-else-if="item.id === 'resourcesHero'"
          :eyebrow="resourcesPageData.eyebrow"
          :title="resourcesPageData.title"
          :style="getStyleOverride('resourcesPage.hero')"
        >
          <p :style="getStyleOverride('resourcesPage.paragraph')">
            {{ resourcesPageData.paragraph }}
          </p>
        </PageHero>
        <section v-else-if="item.id === 'resourcesList'" class="section">
          <div class="resource-grid">
            <article
              v-for="(resource, index) in resourcesPageData.items"
              :key="index"
              class="resource-card"
            >
              <q-icon
                :name="resource.icon || 'article'"
                :style="getStyleOverride(`resourcesPage.items.${index}.icon`)"
              />
              <h2 :style="getStyleOverride(`resourcesPage.items.${index}.title`)">
                {{ resource.title }}
              </h2>
              <p :style="getStyleOverride(`resourcesPage.items.${index}.text`)">
                {{ resource.text }}
              </p>
            </article>
          </div>
          <AdminSectionBlockLayer section-id="resources" />
        </section>
        <SiteFooter v-else-if="item.id === 'footer'" />
      </template>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue';
import PageHero from '@/components/landing/PageHero.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const {
  resourcesPage: resourcesPageData,
  navSections,
  editorLocale,
  fetchPageData,
  getStyleOverride,
} = useWebsiteEditor();

let liveSyncChannel: BroadcastChannel | null = null;

onMounted(async () => {
  await fetchPageData('resources', editorLocale.value);

  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    liveSyncChannel = new BroadcastChannel('botbuilder-live-sync');
    liveSyncChannel.onmessage = async (ev) => {
      if (ev.data?.type === 'content-saved') {
        await fetchPageData('resources', editorLocale.value);
      }
    };
  }
});

watch(editorLocale, async (newLoc) => {
  await fetchPageData('resources', newLoc);
});

onBeforeUnmount(() => {
  liveSyncChannel?.close();
});
</script>
