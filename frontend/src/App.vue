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
let completionTimer: number | undefined;
let removeInitialLoaderTimer: number | undefined;
let maximumWaitTimer: number | undefined;

function isContentRoute(): boolean {
  return contentRoutes.has(route.path);
}

function releaseInitialLoader(): void {
  const initialLoader = document.getElementById('bb-initial-loader');
  if (!initialLoader) {
    document.documentElement.classList.remove('bb-loading-active');
    return;
  }
  if (initialLoader.dataset.releasing === 'true') return;

  initialLoader.dataset.releasing = 'true';
  initialLoader.classList.add('bb-initial-loader--ready');

  const progressFill = initialLoader.querySelector<HTMLElement>('.bb-initial-loader__fill');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const completionDuration = prefersReducedMotion ? 1 : 280;
  const fadeDuration = prefersReducedMotion ? 1 : 360;

  if (progressFill) {
    const currentTransform = window.getComputedStyle(progressFill).transform;
    progressFill.style.animation = 'none';
    progressFill.style.transform = currentTransform === 'none' ? 'scaleX(0.92)' : currentTransform;
    progressFill.getBoundingClientRect();
    progressFill.style.transition = `transform ${completionDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    progressFill.style.transform = 'scaleX(1)';
  }

  completionTimer = window.setTimeout(() => {
    document.documentElement.classList.remove('bb-loading-active');
    initialLoader.classList.add('bb-initial-loader--exit');
  }, completionDuration);

  removeInitialLoaderTimer = window.setTimeout(
    () => initialLoader.remove(),
    completionDuration + fadeDuration + 40,
  );
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
  if (completionTimer !== undefined) {
    window.clearTimeout(completionTimer);
  }
  if (removeInitialLoaderTimer !== undefined) {
    window.clearTimeout(removeInitialLoaderTimer);
  }
  if (maximumWaitTimer !== undefined) {
    window.clearTimeout(maximumWaitTimer);
  }
});
</script>
