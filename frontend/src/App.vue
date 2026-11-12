<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { APP_CONTENT_READY_EVENT } from '@/constants/loading-constants';

const route = useRoute();
const contentRoutes = new Set(['/', '/promotions', '/courses', '/resources', '/about-us']);

const minimumSettleMs = 180;
const maximumWaitMs = 4500;

let appMountedAt = 0;
let contentReady = false;
let releaseScheduled = false;
let releaseDelayTimer: number | undefined;
let removeInitialLoaderTimer: number | undefined;
let maximumWaitTimer: number | undefined;

function isContentRoute(): boolean {
  return contentRoutes.has(route.path);
}

function releaseInitialLoader(): void {
  const initialLoader = document.getElementById('bb-initial-loader');
  if (!initialLoader || initialLoader.dataset.releasing === 'true') return;

  initialLoader.dataset.releasing = 'true';
  initialLoader.classList.add('bb-initial-loader--ready');

  window.setTimeout(() => {
    initialLoader.classList.add('bb-initial-loader--exit');
  }, 140);

  removeInitialLoaderTimer = window.setTimeout(() => initialLoader.remove(), 360);
}

function scheduleRelease(force = false): void {
  if (!appMountedAt || releaseScheduled) return;
  if (!force && isContentRoute() && !contentReady) return;

  releaseScheduled = true;
  const elapsedSinceMount = performance.now() - appMountedAt;
  const remainingSettleTime = Math.max(0, minimumSettleMs - elapsedSinceMount);

  releaseDelayTimer = window.setTimeout(releaseInitialLoader, remainingSettleTime);
}

function handleContentReady(): void {
  contentReady = true;
  scheduleRelease();
}

window.addEventListener(APP_CONTENT_READY_EVENT, handleContentReady);

onMounted(() => {
  appMountedAt = performance.now();
  scheduleRelease();
  maximumWaitTimer = window.setTimeout(() => scheduleRelease(true), maximumWaitMs);
});

onBeforeUnmount(() => {
  window.removeEventListener(APP_CONTENT_READY_EVENT, handleContentReady);
  if (releaseDelayTimer !== undefined) {
    window.clearTimeout(releaseDelayTimer);
  }
  if (removeInitialLoaderTimer !== undefined) {
    window.clearTimeout(removeInitialLoaderTimer);
  }
  if (maximumWaitTimer !== undefined) {
    window.clearTimeout(maximumWaitTimer);
  }
});
</script>
