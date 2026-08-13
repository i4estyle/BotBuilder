<template>
  <section class="page-hero">
    <p class="page-hero__eyebrow">{{ eyebrow }}</p>
    <h1>{{ title }}</h1>
    <span />
    <div class="page-hero__subtitle"><slot /></div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ eyebrow: string; title: string }>();
</script>
