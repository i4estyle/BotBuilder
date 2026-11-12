import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  APP_CONTENT_READY_EVENT,
  APP_LOADING_COMPLETE_EVENT,
  LOADING_CONFIG,
} from '@/constants/loading-constants';
import type { LoadingPhase } from '@/types/loading.types';

export function useAppLoading() {
  const route = useRoute();
  const currentProgress = ref(0);
  const phase = ref<LoadingPhase>('loading');
  const isVisible = ref(true);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fadeDurationMs = reducedMotion ? 0 : LOADING_CONFIG.fadeDurationMs;
  let contentReady = !LOADING_CONFIG.contentRoutes.includes(route.path);
  let animationFrameId: number | undefined;
  let finishTimer: number | undefined;
  let completionStartedAt: number | undefined;
  let completionStartedProgress = 0;

  const currentStep = computed(() =>
    LOADING_CONFIG.steps.find((step) => currentProgress.value <= step.threshold),
  );
  const currentStepLabelTh = computed(() => currentStep.value?.labelTh ?? '');
  const currentStepLabelEn = computed(() => currentStep.value?.labelEn ?? '');

  const handleContentReady = (): void => {
    contentReady = true;
  };

  window.addEventListener(APP_CONTENT_READY_EVENT, handleContentReady, { once: true });
  document.documentElement.classList.add('bb-loading-active');

  onMounted((): void => {
    const startedAt = performance.now();
    const tick = (now: number): void => {
      const elapsed = now - startedAt;
      if (
        completionStartedAt === undefined &&
        ((contentReady && elapsed >= LOADING_CONFIG.minDurationMs) ||
          elapsed >= LOADING_CONFIG.maxTimeoutMs)
      ) {
        completionStartedAt = now;
        completionStartedProgress = currentProgress.value;
      }

      if (completionStartedAt !== undefined) {
        const ratio = reducedMotion
          ? 1
          : Math.min((now - completionStartedAt) / LOADING_CONFIG.completionDurationMs, 1);
        const eased = ratio * ratio * (3 - 2 * ratio);
        currentProgress.value =
          completionStartedProgress + (100 - completionStartedProgress) * eased;
        if (ratio >= 1) {
          phase.value = 'completing';
          window.removeEventListener(APP_CONTENT_READY_EVENT, handleContentReady);
          finishTimer = window.setTimeout((): void => {
            phase.value = 'done';
            isVisible.value = false;
            document.documentElement.classList.remove('bb-loading-active');
            window.dispatchEvent(new Event(APP_LOADING_COMPLETE_EVENT));
          }, fadeDurationMs);
          return;
        }
      } else {
        currentProgress.value =
          LOADING_CONFIG.waitingProgress * (1 - Math.exp(-elapsed / LOADING_CONFIG.minDurationMs));
      }
      animationFrameId = requestAnimationFrame(tick);
    };
    animationFrameId = requestAnimationFrame(tick);
  });

  onBeforeUnmount((): void => {
    if (animationFrameId !== undefined) cancelAnimationFrame(animationFrameId);
    if (finishTimer !== undefined) window.clearTimeout(finishTimer);
    window.removeEventListener(APP_CONTENT_READY_EVENT, handleContentReady);
    document.documentElement.classList.remove('bb-loading-active');
  });

  return {
    currentProgress,
    phase,
    isVisible,
    currentStepLabelTh,
    currentStepLabelEn,
    fadeDurationMs,
  };
}
