<template>
  <aside
    v-if="isVisible"
    class="bb-loading-screen"
    :class="{ 'bb-loading-screen--exit': phase === 'completing' }"
    :style="screenStyle"
    :aria-busy="phase === 'loading'"
    aria-label="Loading BotBuilder Thailand"
  >
    <section
      class="bb-loader"
      role="progressbar"
      aria-label="Loading website"
      :aria-valuemin="0"
      :aria-valuemax="100"
      :aria-valuenow="Math.round(currentProgress)"
    >
      <section class="bb-loader__robot" aria-hidden="true">
        <span class="bb-loader__aura">
          <span class="bb-loader__aura-light" />
          <span class="bb-loader__aura-light bb-loader__aura-light--green" />
        </span>
        <svg class="bb-loader__water" viewBox="0 0 200 200">
          <defs>
            <clipPath :id="clipId">
              <rect x="26" y="44" width="148" height="120" rx="32" />
            </clipPath>
            <clipPath :id="faceClipId">
              <rect x="43" y="66" width="114" height="76" rx="24" />
            </clipPath>
            <linearGradient :id="scanGradientId" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" :stop-color="LOADING_CONFIG.theme.waveGreen" stop-opacity="0" />
              <stop offset="0.5" :stop-color="LOADING_CONFIG.theme.waveGreen" stop-opacity="0.18" />
              <stop offset="1" :stop-color="LOADING_CONFIG.theme.waveGreen" stop-opacity="0" />
            </linearGradient>
            <linearGradient :id="gradientId" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" :stop-color="LOADING_CONFIG.theme.waveRed" />
              <stop offset="0.42" :stop-color="LOADING_CONFIG.theme.waveRed" />
              <stop offset="0.7" :stop-color="LOADING_CONFIG.theme.waveGreen" />
              <stop offset="1" :stop-color="LOADING_CONFIG.theme.waveGreen" />
            </linearGradient>
          </defs>
          <path class="bb-loader__antenna-stem" d="M100 44V28" />
          <circle class="bb-loader__antenna-tip" cx="100" cy="20" r="8" />
          <rect
            class="bb-loader__ear bb-loader__ear--red"
            x="12"
            y="80"
            width="20"
            height="42"
            rx="9"
          />
          <rect
            class="bb-loader__ear bb-loader__ear--green"
            x="168"
            y="80"
            width="20"
            height="42"
            rx="9"
          />
          <rect class="bb-loader__chassis" x="26" y="49" width="148" height="120" rx="32" />
          <rect class="bb-loader__rim" x="26" y="44" width="148" height="120" rx="32" />
          <g :clip-path="`url(#${clipId})`">
            <rect class="bb-loader__basin" x="26" y="44" width="148" height="120" rx="32" />
            <g :style="waterStyle">
              <path
                class="bb-loader__wave bb-loader__wave--back"
                :fill="`url(#${gradientId})`"
                d="M-200 0 Q-175 -10 -150 0 T-100 0 T-50 0 T0 0 T50 0 T100 0 T150 0 T200 0 T250 0 T300 0 T350 0 T400 0 V440 H-200 Z"
              />
              <path
                class="bb-loader__wave"
                :fill="`url(#${gradientId})`"
                d="M-200 0 Q-175 8 -150 0 T-100 0 T-50 0 T0 0 T50 0 T100 0 T150 0 T200 0 T250 0 T300 0 T350 0 T400 0 V440 H-200 Z"
              />
            </g>
            <ellipse class="bb-loader__reflection" cx="66" cy="54" rx="26" ry="6" />
          </g>
          <g class="bb-loader__face">
            <rect class="bb-loader__face-screen" x="43" y="66" width="114" height="76" rx="24" />
            <rect class="bb-loader__eye" x="69" y="86" width="12" height="18" rx="6" />
            <rect class="bb-loader__eye" x="119" y="86" width="12" height="18" rx="6" />
            <ellipse
              class="bb-loader__cheek bb-loader__cheek--red"
              cx="62"
              cy="111"
              rx="8"
              ry="4"
            />
            <ellipse
              class="bb-loader__cheek bb-loader__cheek--green"
              cx="138"
              cy="111"
              rx="8"
              ry="4"
            />
            <path class="bb-loader__smile" d="M87 114Q100 127 113 114" />
          </g>
          <g :clip-path="`url(#${faceClipId})`">
            <rect
              class="bb-loader__scan"
              x="43"
              y="0"
              width="114"
              height="28"
              :fill="`url(#${scanGradientId})`"
            />
          </g>
          <path class="bb-loader__spark" d="M179 43V53M174 48H184" />
          <path class="bb-loader__spark bb-loader__spark--red" d="M21 51V59M17 55H25" />
        </svg>
      </section>
      <section class="bb-loader__details" :style="progressStyle" aria-hidden="true">
        <p class="bb-loader__wordmark" :data-label="LOADING_CONFIG.title">
          {{ LOADING_CONFIG.title }}
        </p>
        <section class="bb-loader__progress">
          <span class="bb-loader__progress-track">
            <span class="bb-loader__progress-fill" />
          </span>
          <span class="bb-loader__percent">{{ Math.round(currentProgress) }}%</span>
        </section>
      </section>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { LOADING_CONFIG } from '@/constants/loading-constants';
import { useAppLoading } from '@/composables/use-app-loading';

const { isVisible, phase, currentProgress, fadeDurationMs } = useAppLoading();
const instanceId = useId();
const clipId = `${instanceId}-water-clip`;
const gradientId = `${instanceId}-water-gradient`;
const faceClipId = `${instanceId}-face-clip`;
const scanGradientId = `${instanceId}-scan-gradient`;
const screenStyle = {
  backgroundColor: LOADING_CONFIG.theme.backdropColor,
  '--loader-fade': `${fadeDurationMs}ms`,
  '--loader-red': LOADING_CONFIG.theme.waveRed,
  '--loader-green': LOADING_CONFIG.theme.waveGreen,
  '--loader-border': LOADING_CONFIG.theme.badgeBorder,
  '--loader-soft': LOADING_CONFIG.theme.badgeBg,
  '--loader-glow': LOADING_CONFIG.theme.barGlow,
  '--loader-surface': LOADING_CONFIG.theme.cardBackground,
  '--loader-ink': LOADING_CONFIG.theme.textPrimary,
  '--loader-track': LOADING_CONFIG.theme.barTrackColor,
  '--loader-gradient': LOADING_CONFIG.theme.barFillGradient,
  '--loader-muted': LOADING_CONFIG.theme.textSecondary,
};
const progressStyle = computed(() => ({
  '--loader-progress': `${currentProgress.value}%`,
  '--loader-scale': String(currentProgress.value / 100),
}));
const waterStyle = computed(() => ({
  transform: `translateY(${174 - 140 * (currentProgress.value / 100)}px)`,
}));
</script>

<style lang="scss">
html {
  scrollbar-gutter: stable;
}

html.bb-loading-active,
html.bb-loading-active body {
  overflow: hidden;
  overscroll-behavior: none;
}
</style>

<style scoped lang="scss">
.bb-loading-screen {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: max(24px, env(safe-area-inset-top)) max(24px, env(safe-area-inset-right))
    max(24px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left));
  box-sizing: border-box;
  transition: opacity var(--loader-fade) ease-in-out;

  &--exit {
    opacity: 0;
  }
}

.bb-loader {
  --aura-gap: clamp(20px, 5vw, 28px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(var(--aura-gap) + 16px);
  width: min(352px, 100%);
}

.bb-loader__robot {
  position: relative;
  isolation: isolate;
  width: clamp(184px, 48vw, 248px);
  max-width: calc(100% - var(--aura-gap) - var(--aura-gap));
  aspect-ratio: 1;
  flex: none;
  border-radius: 50%;
  perspective: 800px;

  &::before {
    content: '';
    position: absolute;
    inset: -24px;
    z-index: -1;
    border-radius: inherit;
    background: radial-gradient(circle, var(--loader-glow), transparent 70%);
    opacity: 0.5;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 5%;
    left: 24%;
    width: 52%;
    height: 8%;
    border-radius: 50%;
    background: radial-gradient(ellipse, var(--loader-ink), transparent 70%);
    opacity: 0.12;
    animation: bb-hover-shadow 5.6s ease-in-out infinite;
    pointer-events: none;
  }
}

.bb-loader__aura {
  position: absolute;
  inset: calc(-1 * var(--aura-gap));
  z-index: 1;
  border: 1px solid var(--loader-track);
  border-radius: 50%;
  transform: rotateX(16deg) rotateY(-10deg);
  pointer-events: none;
}

.bb-loader__aura-light {
  --aura-color: var(--loader-red);
  position: absolute;
  inset: 0;
  border-radius: inherit;
  animation: bb-aura-orbit 8.4s linear infinite;

  &--green {
    --aura-color: var(--loader-green);
    animation-delay: -4.2s;
  }

  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    background: conic-gradient(
      from 90deg,
      transparent 0deg 285deg,
      var(--aura-color) 352deg,
      var(--loader-surface) 360deg
    );
    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0);
    mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0);
  }

  &::after {
    content: '';
    position: absolute;
    top: calc(50% - 2px);
    right: -2px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--loader-surface);
    box-shadow:
      0 0 0 1px var(--aura-color),
      0 0 10px 2px var(--aura-color);
  }
}

.bb-loader__scan {
  animation: bb-scan 4.8s ease-in-out infinite;
}

.bb-loader__spark {
  fill: none;
  stroke: var(--loader-green);
  stroke-width: 1.6;
  stroke-linecap: round;
  animation: bb-spark 3.6s ease-in-out infinite;

  &--red {
    stroke: var(--loader-red);
    animation-delay: -1.8s;
  }
}

.bb-loader__details {
  display: grid;
  justify-items: center;
  gap: 14px;
  width: min(224px, 100%);
}

.bb-loader__wordmark {
  position: relative;
  width: fit-content;
  max-width: 100%;
  margin: 0;
  color: var(--loader-muted);
  font-size: clamp(1.1rem, 4vw, 1.25rem);
  font-weight: 500;
  line-height: 1.7;
  letter-spacing: 0.2em;
  text-indent: 0.2em;
  text-align: center;

  &::after {
    content: attr(data-label);
    position: absolute;
    inset: 0;
    color: transparent;
    background: var(--loader-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    clip-path: inset(0 calc(100% - var(--loader-progress)) 0 0);
    pointer-events: none;
  }
}

.bb-loader__progress {
  display: grid;
  justify-items: center;
  gap: 10px;
  width: 100%;
}

.bb-loader__progress-track {
  display: block;
  width: 100%;
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--loader-track);
}

.bb-loader__progress-fill {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: var(--loader-gradient);
  transform: scaleX(var(--loader-scale));
  transform-origin: left center;
  will-change: transform;
}

.bb-loader__percent {
  flex: none;
  min-width: 4ch;
  color: var(--loader-muted);
  font-size: 0.75rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1.4;
  text-align: center;
}

.bb-loader__water {
  position: relative;
  z-index: 2;
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  animation: bb-robot-hover 5.6s ease-in-out infinite;
}

.bb-loader__rim {
  fill: var(--loader-surface);
  stroke: var(--loader-border);
  stroke-width: 0.7;
}

.bb-loader__basin {
  fill: var(--loader-soft);
}

.bb-loader__wave {
  animation: bb-wave 3.6s linear infinite;
  opacity: 0.94;

  &--back {
    animation-direction: reverse;
    animation-duration: 5.4s;
    opacity: 0.34;
  }
}

.bb-loader__reflection {
  fill: var(--loader-surface);
  opacity: 0.55;
  transform: rotate(-24deg);
  transform-origin: 66px 54px;
  animation: bb-reflection 6s ease-in-out infinite;
}

.bb-loader__chassis {
  fill: var(--loader-track);
}

.bb-loader__antenna-stem {
  fill: none;
  stroke: var(--loader-ink);
  stroke-width: 5;
  stroke-linecap: round;
}

.bb-loader__antenna-tip {
  fill: var(--loader-red);
  animation: bb-antenna-glow 2.4s ease-in-out infinite;
}

.bb-loader__ear {
  stroke: var(--loader-surface);
  stroke-width: 2;

  &--red {
    fill: var(--loader-red);
  }
  &--green {
    fill: var(--loader-green);
  }
}

.bb-loader__face-screen {
  fill: var(--loader-surface);
  stroke: var(--loader-border);
  stroke-width: 0.7;
}

.bb-loader__eye {
  fill: var(--loader-ink);
  transform-box: fill-box;
  transform-origin: center;
  animation: bb-robot-blink 4.8s ease-in-out infinite;
}

.bb-loader__cheek {
  opacity: 0.4;

  &--red {
    fill: var(--loader-red);
  }
  &--green {
    fill: var(--loader-green);
  }
}

.bb-loader__smile {
  fill: none;
  stroke: var(--loader-ink);
  stroke-width: 3.5;
  stroke-linecap: round;
}

@keyframes bb-robot-blink {
  0%,
  43%,
  47%,
  100% {
    transform: scaleY(1);
  }
  45% {
    transform: scaleY(0.1);
  }
}

@keyframes bb-antenna-glow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

@keyframes bb-scan {
  0% {
    transform: translateY(42px);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(144px);
    opacity: 0;
  }
}

@keyframes bb-spark {
  0%,
  100% {
    transform: translateY(2px);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-3px);
    opacity: 0.75;
  }
}

@keyframes bb-reflection {
  0%,
  100% {
    opacity: 0.35;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes bb-wave {
  to {
    transform: translateX(-100px);
  }
}

@keyframes bb-aura-orbit {
  to {
    transform: rotate(360deg);
  }
}

@keyframes bb-robot-hover {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes bb-hover-shadow {
  0%,
  100% {
    transform: scaleX(1);
    opacity: 0.12;
  }
  50% {
    transform: scaleX(0.85);
    opacity: 0.08;
  }
}

@media (max-height: 520px) {
  .bb-loader__robot {
    width: 156px;
  }
  .bb-loader__details {
    gap: 10px;
  }
  .bb-loader__wordmark {
    font-size: 1.1rem;
    line-height: 1.4;
  }
  .bb-loader__progress {
    gap: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bb-loader__wave,
  .bb-loader__scan,
  .bb-loader__spark,
  .bb-loader__reflection,
  .bb-loader__eye,
  .bb-loader__antenna-tip,
  .bb-loader__water,
  .bb-loader__aura-light,
  .bb-loader__robot::after {
    animation: none;
  }
  .bb-loader__scan {
    opacity: 0;
  }
  .bb-loading-screen {
    transition: none;
  }
}
</style>
