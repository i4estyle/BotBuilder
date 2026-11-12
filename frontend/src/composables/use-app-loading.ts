import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { APP_CONTENT_READY_EVENT, LOADING_CONFIG } from '@/constants/loading-constants';
import type { LoadingPhase, LoadingStepConfig } from '@/types/loading.types';

const currentProgress = ref<number>(0);
const phase = ref<LoadingPhase>('loading');
const isVisible = ref<boolean>(true);

const fallbackStep: LoadingStepConfig = {
  threshold: 100,
  labelTh: '',
  labelEn: '',
};

export function useAppLoading() {
  let animationFrameId: number | undefined;
  let safetyTimer: number | undefined;
  let finishTimer: number | undefined;
  let contentReady = false;

  const currentStepLabelTh = computed<string>((): string => {
    const matched = LOADING_CONFIG.steps.find((step) => currentProgress.value <= step.threshold);
    const finalStep = LOADING_CONFIG.steps[LOADING_CONFIG.steps.length - 1] ?? fallbackStep;
    return matched ? matched.labelTh : finalStep.labelTh;
  });

  const currentStepLabelEn = computed<string>((): string => {
    const matched = LOADING_CONFIG.steps.find((step) => currentProgress.value <= step.threshold);
    const finalStep = LOADING_CONFIG.steps[LOADING_CONFIG.steps.length - 1] ?? fallbackStep;
    return matched ? matched.labelEn : finalStep.labelEn;
  });

  const finishLoading = (): void => {
    if (phase.value !== 'loading') return;

    if (animationFrameId !== undefined) cancelAnimationFrame(animationFrameId);
    if (safetyTimer !== undefined) window.clearTimeout(safetyTimer);
    window.removeEventListener(APP_CONTENT_READY_EVENT, handleContentReady);

    currentProgress.value = 100;
    phase.value = 'completing';

    finishTimer = window.setTimeout((): void => {
      phase.value = 'done';
      isVisible.value = false;
    }, 380);
  };

  const handleContentReady = (): void => {
    contentReady = true;
  };

  const startProgressEngine = (): void => {
    phase.value = 'loading';
    currentProgress.value = 0;
    isVisible.value = true;
    contentReady = false;

    window.addEventListener(APP_CONTENT_READY_EVENT, handleContentReady, { once: true });

    const startTime = performance.now();

    safetyTimer = window.setTimeout((): void => {
      finishLoading();
    }, LOADING_CONFIG.maxTimeoutMs);

    const tick = (now: number): void => {
      const elapsed = now - startTime;
      const linearRatio = Math.min(elapsed / LOADING_CONFIG.minDurationMs, 1);
      const easeProgress = Math.round(Math.sin((linearRatio * Math.PI) / 2) * 92);

      currentProgress.value = Math.max(currentProgress.value, easeProgress);

      if (contentReady && linearRatio >= 1) {
        finishLoading();
      } else if (phase.value === 'loading') {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        animationFrameId = undefined;
      }
    };

    animationFrameId = requestAnimationFrame(tick);
  };

  onMounted((): void => {
    startProgressEngine();
  });

  onBeforeUnmount((): void => {
    if (animationFrameId !== undefined) cancelAnimationFrame(animationFrameId);
    if (safetyTimer !== undefined) window.clearTimeout(safetyTimer);
    if (finishTimer !== undefined) window.clearTimeout(finishTimer);
    window.removeEventListener(APP_CONTENT_READY_EVENT, handleContentReady);
  });

  return {
    currentProgress,
    phase,
    isVisible,
    currentStepLabelTh,
    currentStepLabelEn,
    startProgressEngine,
  };
}
