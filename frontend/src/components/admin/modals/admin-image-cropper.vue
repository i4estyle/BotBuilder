<template>
  <q-dialog
    v-model="isOpen"
    transition-show="none"
    transition-hide="none"
    persistent
    class="admin-crop-dialog-root"
    @show="onDialogShow"
  >
    <div class="admin-crop-modal">
      <!-- Clean White Header -->
      <div class="admin-crop-modal__header">
        <div class="admin-crop-modal__icon-badge">
          <q-icon name="crop" size="20px" />
        </div>
        <div class="admin-crop-modal__titles">
          <h3 class="admin-crop-modal__title">ปรับแต่งและครอบตัดรูปภาพ</h3>
          <span class="admin-crop-modal__subtitle">
            {{ blockLabel || 'ปรับตำแหน่งและขนาดรูปภาพ' }} • {{ recommendedWidth }} ×
            {{ recommendedHeight }} px
          </span>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense color="grey-6" @click="onCancel" />
      </div>

      <!-- Clean Light Viewport Body -->
      <div class="admin-crop-modal__body">
        <div
          ref="containerRef"
          class="admin-crop-viewport-container"
          @pointerdown="onPointerDown"
          @wheel.prevent="onWheel"
        >
          <div class="admin-crop-viewport" :style="viewportStyle">
            <!-- Main Render Canvas -->
            <canvas ref="canvasRef" class="admin-crop-canvas" />

            <!-- Rule of Thirds Overlay & Corner Accents -->
            <div class="admin-crop-grid-overlay">
              <span class="admin-crop-grid-line admin-crop-grid-line--h1" />
              <span class="admin-crop-grid-line admin-crop-grid-line--h2" />
              <span class="admin-crop-grid-line admin-crop-grid-line--v1" />
              <span class="admin-crop-grid-line admin-crop-grid-line--v2" />

              <span class="admin-crop-corner admin-crop-corner--tl" />
              <span class="admin-crop-corner admin-crop-corner--tr" />
              <span class="admin-crop-corner admin-crop-corner--bl" />
              <span class="admin-crop-corner admin-crop-corner--br" />
            </div>
          </div>
        </div>

        <!-- Controls Toolbar -->
        <div class="admin-crop-controls">
          <div class="admin-crop-zoom-group">
            <button
              type="button"
              class="admin-crop-icon-btn"
              :disabled="zoom <= minZoom"
              title="ย่อขนาด"
              @click="zoomStep(-1)"
            >
              <q-icon name="remove" size="14px" />
            </button>

            <q-slider
              v-model="zoom"
              :min="minZoom"
              :max="maxZoom"
              :step="0.01"
              color="positive"
              class="admin-crop-slider"
              @update:model-value="onSliderChange"
            />

            <button
              type="button"
              class="admin-crop-icon-btn"
              :disabled="zoom >= maxZoom"
              title="ขยายขนาด"
              @click="zoomStep(1)"
            >
              <q-icon name="add" size="14px" />
            </button>

            <span class="admin-crop-zoom-text">{{ Math.round(zoom * 100) }}%</span>
          </div>

          <div class="admin-crop-preset-btns">
            <button
              type="button"
              class="admin-crop-btn admin-crop-btn--secondary"
              title="รีเซ็ตตำแหน่ง"
              @click="resetCrop"
            >
              <q-icon name="restart_alt" size="14px" />
              <span>รีเซ็ต</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer: Single Line Hint & Icon-Free Save Button -->
      <div class="admin-crop-modal__footer">
        <span class="admin-crop-modal__hint">
          ลากรูปภาพเพื่อปรับตำแหน่ง หรือใช้ Scroll Mouse เพื่อย่อ/ขยาย
        </span>
        <q-space />
        <div class="admin-crop-modal__footer-actions">
          <button type="button" class="admin-crop-btn admin-crop-btn--cancel" @click="onCancel">
            ยกเลิก
          </button>
          <button type="button" class="admin-crop-btn admin-crop-btn--confirm" @click="onConfirm">
            บันทึก
          </button>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, type CSSProperties } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    imageSrc: string;
    recommendedWidth?: number;
    recommendedHeight?: number;
    blockLabel?: string;
  }>(),
  {
    recommendedWidth: 800,
    recommendedHeight: 600,
    blockLabel: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm', croppedDataUrl: string): void;
  (e: 'cancel'): void;
}>();

const isOpen = computed({
  get: (): boolean => props.modelValue,
  set: (val: boolean): void => emit('update:modelValue', val),
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);

const loadedImage = ref<HTMLImageElement | null>(null);
const zoom = ref<number>(1);
const minZoom = ref<number>(0.05);
const maxZoom = ref<number>(5);

let currentPanX = 0;
let currentPanY = 0;
let currentZoom = 1;
let rafId: number | null = null;

const targetAspect = computed((): number => props.recommendedWidth / props.recommendedHeight);

const viewportStyle = computed<CSSProperties>(() => {
  const aspect = targetAspect.value;
  if (aspect >= 1) {
    return {
      width: '100%',
      aspectRatio: `${props.recommendedWidth} / ${props.recommendedHeight}`,
      maxHeight: '380px',
    };
  }
  return {
    height: '350px',
    aspectRatio: `${props.recommendedWidth} / ${props.recommendedHeight}`,
    maxWidth: '100%',
  };
});

let isDragging = false;
let startPointerX = 0;
let startPointerY = 0;
let startPanX = 0;
let startPanY = 0;

function requestRedraw(): void {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    redraw();
  });
}

function onDialogShow(): void {
  currentZoom = 1;
  currentPanX = 0;
  currentPanY = 0;
  zoom.value = 1;

  if (props.imageSrc) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = (): void => {
      loadedImage.value = img;
      initDimensions();
      void nextTick(() => {
        requestRedraw();
      });
    };
    img.src = props.imageSrc;
  }
}

watch(
  () => props.imageSrc,
  (newSrc: string): void => {
    if (newSrc && isOpen.value) {
      onDialogShow();
    }
  },
);

watch([() => props.recommendedWidth, () => props.recommendedHeight], (): void => {
  if (isOpen.value && loadedImage.value) {
    initDimensions();
    requestRedraw();
  }
});

function initDimensions(): void {
  if (!loadedImage.value || !canvasRef.value) return;
  const canvas = canvasRef.value;
  canvas.width = props.recommendedWidth;
  canvas.height = props.recommendedHeight;

  const img = loadedImage.value;
  const scaleW = props.recommendedWidth / img.width;
  const scaleH = props.recommendedHeight / img.height;
  const baseScale = Math.max(scaleW, scaleH);

  minZoom.value = Math.max(0.02, baseScale * 0.3);
  maxZoom.value = Math.max(5, baseScale * 6);
  currentZoom = baseScale;
  zoom.value = baseScale;
  currentPanX = (props.recommendedWidth - img.width * baseScale) / 2;
  currentPanY = (props.recommendedHeight - img.height * baseScale) / 2;
}

function redraw(): void {
  if (!canvasRef.value || !loadedImage.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = loadedImage.value;
  ctx.drawImage(img, currentPanX, currentPanY, img.width * currentZoom, img.height * currentZoom);
}

function applyZoomAtPoint(newZoom: number, focalX: number, focalY: number): void {
  const clampedZoom = Math.min(maxZoom.value, Math.max(minZoom.value, newZoom));
  if (clampedZoom === currentZoom) return;

  const scaleChange = clampedZoom / currentZoom;
  currentPanX = focalX - (focalX - currentPanX) * scaleChange;
  currentPanY = focalY - (focalY - currentPanY) * scaleChange;
  currentZoom = clampedZoom;

  zoom.value = clampedZoom;
  requestRedraw();
}

function zoomStep(direction: number): void {
  const factor = direction > 0 ? 1.15 : 1 / 1.15;
  const centerX = props.recommendedWidth / 2;
  const centerY = props.recommendedHeight / 2;
  applyZoomAtPoint(currentZoom * factor, centerX, centerY);
}

function onSliderChange(val: number | null): void {
  if (val === null) return;
  const centerX = props.recommendedWidth / 2;
  const centerY = props.recommendedHeight / 2;
  applyZoomAtPoint(val, centerX, centerY);
}

function resetCrop(): void {
  initDimensions();
  requestRedraw();
}

function onWheel(e: WheelEvent): void {
  if (!canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const scaleRatio = props.recommendedWidth / rect.width;

  const focalX = (e.clientX - rect.left) * scaleRatio;
  const focalY = (e.clientY - rect.top) * scaleRatio;

  const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
  applyZoomAtPoint(currentZoom * factor, focalX, focalY);
}

function onPointerDown(e: PointerEvent): void {
  isDragging = true;
  startPointerX = e.clientX;
  startPointerY = e.clientY;
  startPanX = currentPanX;
  startPanY = currentPanY;

  const target = e.currentTarget as HTMLElement;
  target.setPointerCapture(e.pointerId);

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
}

function onPointerMove(e: PointerEvent): void {
  if (!isDragging || !canvasRef.value) return;
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  const scaleRatio = props.recommendedWidth / rect.width;

  const dx = (e.clientX - startPointerX) * scaleRatio;
  const dy = (e.clientY - startPointerY) * scaleRatio;

  currentPanX = startPanX + dx;
  currentPanY = startPanY + dy;
  requestRedraw();
}

function onPointerUp(): void {
  isDragging = false;
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
}

function onCancel(): void {
  emit('cancel');
  isOpen.value = false;
}

function onConfirm(): void {
  if (!loadedImage.value) return;
  const img = loadedImage.value;

  const srcX = (0 - currentPanX) / currentZoom;
  const srcY = (0 - currentPanY) / currentZoom;
  const srcWidth = props.recommendedWidth / currentZoom;
  const srcHeight = props.recommendedHeight / currentZoom;

  const baseWidth = props.recommendedWidth;
  const baseHeight = props.recommendedHeight;
  const exportScale = Math.min(Math.max(2, img.width / srcWidth), 2400 / baseWidth);

  const exportW = Math.round(baseWidth * exportScale);
  const exportH = Math.round(baseHeight * exportScale);

  const offscreen = document.createElement('canvas');
  offscreen.width = exportW;
  offscreen.height = exportH;

  const ctx = offscreen.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, exportW, exportH);
  }

  const croppedDataUrl = offscreen.toDataURL('image/png', 0.95);
  emit('confirm', croppedDataUrl);
  isOpen.value = false;
}
</script>

<style lang="scss">
.admin-crop-modal {
  width: min(700px, 92vw);
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
    background: #ffffff;
  }

  &__icon-badge {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__titles {
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    line-height: 1.3;
  }

  &__subtitle {
    font-size: 12px;
    color: #64748b;
  }

  &__body {
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    background: #ffffff;
  }

  &__footer {
    display: flex;
    align-items: center;
    padding: 14px 20px;
    border-top: 1px solid #f1f5f9;
    background: #ffffff;
    gap: 12px;
  }

  &__hint {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__footer-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
}

.admin-crop-viewport-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  touch-action: none;
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
}

.admin-crop-viewport {
  position: relative;
  border: 2px solid #16a34a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.admin-crop-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.admin-crop-grid-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.admin-crop-grid-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.35);

  &--h1 {
    top: 33.33%;
    left: 0;
    right: 0;
    height: 1px;
  }
  &--h2 {
    top: 66.66%;
    left: 0;
    right: 0;
    height: 1px;
  }
  &--v1 {
    left: 33.33%;
    top: 0;
    bottom: 0;
    width: 1px;
  }
  &--v2 {
    left: 66.66%;
    top: 0;
    bottom: 0;
    width: 1px;
  }
}

.admin-crop-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: #16a34a;
  border-style: solid;

  &--tl {
    top: 0;
    left: 0;
    border-width: 3px 0 0 3px;
    border-top-left-radius: 3px;
  }
  &--tr {
    top: 0;
    right: 0;
    border-width: 3px 3px 0 0;
    border-top-right-radius: 3px;
  }
  &--bl {
    bottom: 0;
    left: 0;
    border-width: 0 0 3px 3px;
    border-bottom-left-radius: 3px;
  }
  &--br {
    bottom: 0;
    right: 0;
    border-width: 0 3px 3px 0;
    border-bottom-right-radius: 3px;
  }
}

.admin-crop-controls {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.admin-crop-zoom-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 320px;
}

.admin-crop-slider {
  flex: 1;
}

.admin-crop-zoom-text {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  min-width: 36px;
  text-align: right;
}

.admin-crop-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 160ms ease;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #f8fafc;
    color: #0f172a;
    border-color: #94a3b8;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.admin-crop-preset-btns {
  display: flex;
  align-items: center;
  gap: 6px;
}

.admin-crop-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 160ms ease;

  &--secondary {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    color: #334155;

    &:hover {
      background: #f8fafc;
      color: #0f172a;
      border-color: #94a3b8;
    }
  }

  &--cancel {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #cbd5e1;

    &:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
  }

  &--confirm {
    background: linear-gradient(135deg, #15803d 0%, #16a34a 100%);
    color: #ffffff;
    box-shadow: 0 3px 10px rgba(22, 163, 74, 0.25);

    &:hover {
      background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
      box-shadow: 0 5px 14px rgba(22, 163, 74, 0.35);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}
</style>
