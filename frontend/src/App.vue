<template>
  <router-view />
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted } from 'vue';

let removeInitialLoaderTimer: number | undefined;

function releaseInitialLoader(): void {
  const initialLoader = document.getElementById('bb-initial-loader');
  if (!initialLoader || initialLoader.dataset.releasing === 'true') return;

  initialLoader.dataset.releasing = 'true';
  initialLoader.classList.add('bb-initial-loader--exit');
  removeInitialLoaderTimer = window.setTimeout(() => initialLoader.remove(), 200);
}

onMounted(() => {
  void nextTick(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(releaseInitialLoader);
    });
  });
});

onBeforeUnmount(() => {
  if (removeInitialLoaderTimer !== undefined) {
    window.clearTimeout(removeInitialLoaderTimer);
  }
});
</script>
