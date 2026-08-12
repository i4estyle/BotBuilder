<template>
  <q-page class="landing-page">
    <SiteHeader />
    <main>
      <PageHero :eyebrow="t('resources.eyebrow')" :title="t('resources.title')">
        <p>{{ t('resources.paragraph') }}</p>
      </PageHero>
      <section class="section">
        <div class="resource-grid">
          <article v-for="(resource, index) in resources" :key="index" class="resource-card">
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PageHero from '@/components/landing/PageHero.vue';
import SiteFooter from '@/components/landing/SiteFooter.vue';
import SiteHeader from '@/components/landing/SiteHeader.vue';

const i18n = useI18n();
const { t } = i18n;

const resourceIcons = ['article', 'extension', 'emoji_events'];
const resources = computed(() => {
  const items = i18n.tm('resources.items');
  return items.map((item, index) => ({ ...item, icon: resourceIcons[index]! }));
});
</script>
