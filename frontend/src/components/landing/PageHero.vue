<template>
  <section class="page-hero">
    <p class="page-hero__eyebrow" :style="eyebrowStyle">{{ eyebrow }}</p>
    <h1 :style="titleStyle">{{ title }}</h1>
    <span />
    <div class="page-hero__subtitle"><slot /></div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow: string;
  title: string;
  eyebrowStyle?: Record<string, string | undefined>;
  titleStyle?: Record<string, string | undefined>;
}>();
</script>
