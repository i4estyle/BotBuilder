<template>
  <div class="section-heading" :class="{ 'section-heading--centered': centered }">
    <h2>{{ title }}</h2>
    <span class="section-heading__line" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title: string; centered?: boolean }>(), { centered: true });
</script>
