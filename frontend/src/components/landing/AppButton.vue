<template>
  <a
    v-if="href"
    :href="href"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    class="app-button"
    :class="`app-button--${variant}`"
  >
    <slot />
  </a>
  <button
    v-else
    class="app-button"
    :class="`app-button--${variant}`"
    type="button"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'red' | 'green' | 'outline';
    href?: string;
    target?: string;
    disabled?: boolean;
  }>(),
  {
    variant: 'red',
    target: '_blank',
    disabled: false,
  },
);
</script>
