<template>
  <aside
    v-if="isVisible"
    class="bb-loading-screen"
    :class="{ 'bb-loading-screen--exit': phase === 'completing' || phase === 'done' }"
    :style="screenRootStyle"
    role="status"
    aria-live="polite"
    aria-label="Loading BotBuilder Thailand"
  >
    <section class="bb-loader-stage">
      <figure class="bb-loader__logo-wrap">
        <img
          :src="resolveAssetUrl(LOADING_CONFIG.logoAssetKey)"
          alt="BotBuilder Thailand"
          class="bb-loader__logo"
        />
      </figure>

      <section class="bb-loader__progress-box">
        <section class="bb-loader__track" :style="trackStyle">
          <section class="bb-loader__fill" :style="fillStyle">
            <span class="bb-loader__shimmer" />
            <span class="bb-loader__pin" />
          </section>
        </section>
      </section>

      <section class="bb-loader__info">
        <h1 class="bb-loader__title" :style="titleStyle">
          {{ LOADING_CONFIG.title }}
        </h1>
        <span class="bb-loader__badge" :style="badgeStyle">
          {{ LOADING_CONFIG.badgeTextTh }}
        </span>
      </section>

      <p class="bb-loader__status" :style="statusStyle">
        {{ currentStepLabelTh }} ({{ currentProgress }}%)
      </p>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { LOADING_CONFIG } from '@/constants/loading-constants';
import { useAppLoading } from '@/composables/use-app-loading';
import { resolveAssetUrl } from '@/utils/asset-helper';

const { isVisible, phase, currentProgress, currentStepLabelTh } = useAppLoading();

const screenRootStyle = computed<Record<string, string>>(() => ({
  backgroundColor: LOADING_CONFIG.theme.backdropColor,
}));

const trackStyle = computed<Record<string, string>>(() => ({
  backgroundColor: LOADING_CONFIG.theme.barTrackColor,
}));

const fillStyle = computed<Record<string, string>>(() => ({
  width: `${currentProgress.value}%`,
  background: LOADING_CONFIG.theme.barFillGradient,
  boxShadow: `0 0 10px ${LOADING_CONFIG.theme.barGlow}`,
}));

const titleStyle = computed<Record<string, string>>(() => ({
  color: LOADING_CONFIG.theme.textPrimary,
}));

const badgeStyle = computed<Record<string, string>>(() => ({
  backgroundColor: LOADING_CONFIG.theme.badgeBg,
  color: LOADING_CONFIG.theme.badgeText,
  borderColor: LOADING_CONFIG.theme.badgeBorder,
}));

const statusStyle = computed<Record<string, string>>(() => ({
  color: LOADING_CONFIG.theme.textSecondary,
}));
</script>

<style scoped lang="scss">
.bb-loading-screen {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition:
    opacity 450ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 450ms cubic-bezier(0.16, 1, 0.3, 1),
    filter 450ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform, filter;

  &--exit {
    opacity: 0;
    transform: scale(1.02);
    filter: blur(4px);
    pointer-events: none;
  }
}

.bb-loader-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  max-width: 440px;
  width: 100%;
  animation: bb-stage-rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.bb-loader__logo-wrap {
  margin: 0 0 28px 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 800px;
}

.bb-loader__logo {
  height: 58px;
  width: auto;
  max-width: 240px;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.06));
  animation: bb-float 3s ease-in-out infinite;
}

.bb-loader__progress-box {
  width: 100%;
  max-width: 380px;
  margin-bottom: 18px;
  display: flex;
  justify-content: center;
}

.bb-loader__track {
  position: relative;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  overflow: hidden;
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(255, 255, 255, 0.9);
}

.bb-loader__fill {
  position: relative;
  height: 100%;
  border-radius: 999px;
  transition: width 90ms cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: width;
}

.bb-loader__shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  animation: bb-shimmer-pass 1.6s infinite;
}

.bb-loader__pin {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 6px #ffffff;
}

.bb-loader__info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.bb-loader__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.bb-loader__badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
  border-width: 1px;
  border-style: solid;
  line-height: 1.4;
  white-space: nowrap;
}

.bb-loader__status {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

@keyframes bb-float {
  0%,
  100% {
    transform: translateY(0) rotateX(0deg);
  }
  50% {
    transform: translateY(-4px) rotateX(4deg);
  }
}

@keyframes bb-stage-rise {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bb-shimmer-pass {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}
</style>
