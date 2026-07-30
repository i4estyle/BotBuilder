<template>
  <button class="app-button" :class="`app-button--${variant}`" type="button">
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'red' | 'green' | 'outline' }>(), {
  variant: 'red',
});
</script>
