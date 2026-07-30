<template>
  <section class="page-hero">
    <p>{{ eyebrow }}</p>
    <h1>{{ title }}</h1>
    <span />
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{ eyebrow: string; title: string }>();
</script>
