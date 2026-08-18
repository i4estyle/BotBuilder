<template>
  <q-page class="landing-page resources-page">
    <main>
      <template v-for="item in navSections" :key="item.id">
        <SiteHeader v-if="item.id === 'header'" />
        <section v-else-if="item.id === 'resourcesHero'" style="position: relative">
          <PageHero
            :eyebrow="resourcesPageData.eyebrow"
            :title="resourcesPageData.title"
            :eyebrow-style="getStyleOverride('resourcesPage.eyebrow')"
            :title-style="getStyleOverride('resourcesPage.title')"
          >
            <p :style="getStyleOverride('resourcesPage.paragraph')">
              {{ resourcesPageData.paragraph }}
            </p>
          </PageHero>
          <AdminSectionBlockLayer section-id="resourcesHero" />
        </section>
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
          <AdminSectionBlockLayer section-id="resourcesList" />
        </section>
        <section
          v-else-if="item.isCustomPage"
          :id="item.id"
          class="section custom-section"
          data-reveal
        >
          <SectionHeading :title="item.title" />
          <div v-if="getCustomBlock(item.id)?.type === 'text'" class="custom-section__text">
            <p>{{ getCustomBlock(item.id)?.content }}</p>
          </div>
          <div v-else-if="getCustomBlock(item.id)?.type === 'image'" class="custom-section__image">
            <img
              :src="resolveAssetUrl(getCustomBlock(item.id)?.image || '')"
              :alt="item.title"
              style="max-width: 100%; border-radius: 12px"
            />
          </div>
          <AdminSectionBlockLayer :section-id="item.id" />
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
  resourcesPage: resourcesPageData,
  customBlocks,
  navSections,
  editorLocale,
  fetchPageData,
  getStyleOverride,
} = useWebsiteEditor();

function getCustomBlock(id: string) {
  return customBlocks.find((b) => b.id === id);
}

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
