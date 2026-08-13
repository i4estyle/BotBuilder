<template>
  <q-page class="landing-page">
    <SiteHeader />
    <main>
      <PageHero :eyebrow="resourcesPageData.eyebrow" :title="resourcesPageData.title">
        <p>{{ resourcesPageData.paragraph }}</p>
      </PageHero>
      <section class="section">
        <div class="resource-grid">
          <article
            v-for="(resource, index) in resourcesPageData.items"
            :key="index"
            class="resource-card"
          >
            <q-icon :name="resource.icon" />
            <h2>{{ resource.title }}</h2>
            <p>{{ resource.text }}</p>
          </article>
        </div>
      </section>
    </main>
    <SiteFooter />
  </q-page>
</template>

<script setup lang="ts">
import PageHero from '@/components/landing/PageHero.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';

const { resourcesPage: resourcesPageData } = useWebsiteEditor();
</script>
