import { computed, onMounted, ref } from 'vue';
import { LOADING_CONFIG } from '@/constants/loading-constants';
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
    currentProgress.value = 100;
    phase.value = 'completing';

    window.setTimeout((): void => {
      phase.value = 'done';
      window.setTimeout((): void => {
        isVisible.value = false;
      }, 550);
    }, 220);
  };

  const startProgressEngine = (): void => {
    phase.value = 'loading';
    currentProgress.value = 0;
    isVisible.value = true;

    const startTime = performance.now();
    let animFrameId: number;

    const safetyTimer = window.setTimeout((): void => {
      cancelAnimationFrame(animFrameId);
      finishLoading();
    }, LOADING_CONFIG.maxTimeoutMs);

    const tick = (now: number): void => {
      const elapsed = now - startTime;
      const linearRatio = Math.min(elapsed / LOADING_CONFIG.minDurationMs, 1);
      const easeProgress = Math.round(Math.sin((linearRatio * Math.PI) / 2) * 100);

      currentProgress.value = Math.max(currentProgress.value, easeProgress);

      if (linearRatio < 1 && phase.value === 'loading') {
        animFrameId = requestAnimationFrame(tick);
      } else {
        window.clearTimeout(safetyTimer);
        finishLoading();
      }
    };

    animFrameId = requestAnimationFrame(tick);
  };

  onMounted((): void => {
    startProgressEngine();
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
