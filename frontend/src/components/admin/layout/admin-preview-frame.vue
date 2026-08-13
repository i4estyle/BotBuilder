<template>
  <div
    ref="previewContainerRef"
    class="admin-preview-container"
    :class="`admin-preview-container--${viewportMode}`"
  >
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="onFilePicked"
    />

    <q-dialog v-model="showIconPicker">
      <q-card style="min-width: 320px; border-radius: 14px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">เลือกไอคอนใหม่</div>
          <q-space />
          <q-btn v-close-popup icon="close" flat round dense />
        </q-card-section>

        <q-card-section class="admin-icon-picker-grid">
          <div
            v-for="iconName in availableIcons"
            :key="iconName"
            class="admin-icon-picker-grid__item"
            @click="selectNewIcon(iconName)"
          >
            <q-icon :name="iconName" size="24px" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div
      ref="previewScaleWrapperRef"
      class="admin-preview-scale-wrapper"
      :style="scaleWrapperStyle"
    >
      <div
        ref="previewScrollRoot"
        :class="[
          'admin-preview-scroll-wrapper',
          `admin-preview-scroll-wrapper--${viewportMode}`,
          'landing-page',
          activePage === 'promotions'
            ? 'promotions-page'
            : activePage === 'courses'
              ? 'courses-page'
              : activePage === 'resources'
                ? 'resources-page'
                : activePage === 'about'
                  ? 'about-page'
                  : '',
        ]"
      >
        <template v-for="item in navSections" :key="item.id">
          <PreviewSectionHeader
            v-if="item.id === 'header'"
            :is-active="activeSectionId === 'header'"
            @select="selectSection"
          />
          <PreviewSectionHero
            v-else-if="item.id === 'hero'"
            :is-active="activeSectionId === 'hero'"
            @select="selectSection"
          />
          <PreviewSectionBenefits
            v-else-if="item.id === 'benefits'"
            :is-active="activeSectionId === 'benefits'"
            @select="selectSection"
          />
          <PreviewSectionActivityFormats
            v-else-if="item.id === 'activityFormats'"
            :is-active="activeSectionId === 'activityFormats'"
            @select="selectSection"
          />
          <PreviewSectionGallery
            v-else-if="item.id === 'gallery'"
            :is-active="activeSectionId === 'gallery'"
            @select="selectSection"
          />
          <PreviewSectionActivityGallery
            v-else-if="item.id === 'activityGallery'"
            :is-active="activeSectionId === 'activityGallery'"
            @select="selectSection"
          />
          <PreviewSectionQuiz
            v-else-if="item.id === 'quiz'"
            :is-active="activeSectionId === 'quiz'"
            @select="selectSection"
          />
          <PreviewSectionBranches
            v-else-if="item.id === 'branches'"
            :is-active="activeSectionId === 'branches'"
            @select="selectSection"
          />
          <PreviewSectionCta
            v-else-if="item.id === 'cta'"
            :is-active="activeSectionId === 'cta'"
            @select="selectSection"
          />
          <PreviewSectionPromotionsHero
            v-else-if="item.id === 'promotionsHero'"
            :is-active="activeSectionId === 'promotionsHero'"
            @select="selectSection"
          />
          <PreviewSectionPromotionsList
            v-else-if="item.id === 'promotionsList'"
            :is-active="activeSectionId === 'promotionsList'"
            @select="selectSection"
          />
          <PreviewSectionPromotionsCta
            v-else-if="item.id === 'promotionsCta'"
            :is-active="activeSectionId === 'promotionsCta'"
            @select="selectSection"
          />
          <PreviewSectionCoursesHero
            v-else-if="item.id === 'coursesHero'"
            :is-active="activeSectionId === 'coursesHero'"
            @select="selectSection"
          />
          <PreviewSectionCoursesList
            v-else-if="item.id === 'coursesList'"
            :is-active="activeSectionId === 'coursesList'"
            @select="selectSection"
          />
          <PreviewSectionResourcesHero
            v-else-if="item.id === 'resourcesHero'"
            :is-active="activeSectionId === 'resourcesHero'"
            @select="selectSection"
          />
          <PreviewSectionResourcesList
            v-else-if="item.id === 'resourcesList'"
            :is-active="activeSectionId === 'resourcesList'"
            @select="selectSection"
            @open-icon-picker="openIconPicker"
          />
          <PreviewSectionAboutHero
            v-else-if="item.id === 'aboutHero'"
            :is-active="activeSectionId === 'aboutHero'"
            @select="selectSection"
          />
          <PreviewSectionAboutMission
            v-else-if="item.id === 'aboutMission'"
            :is-active="activeSectionId === 'aboutMission'"
            @select="selectSection"
          />
          <PreviewSectionFooter
            v-else-if="item.id === 'footer'"
            :is-active="activeSectionId === 'footer'"
            @select="selectSection"
          />
          <PreviewSectionCustomBlock
            v-else-if="getCustomBlock(item.id)"
            :block-id="item.id"
            :is-active="activeSectionId === item.id"
            @select="selectSection"
          />
        </template>
      </div>
    </div>

    <teleport to="body">
      <div
        v-if="activeInlineEl && !isAnyModalOpen"
        ref="inlineOverlayRef"
        class="admin-active-inline-overlay"
        :style="activeInlineOverlayStyle"
        @pointerdown="onOverlayPointerDown"
      >
        <div
          v-if="inlineElType === 'text'"
          class="admin-text-toolbar"
          style="position: absolute; bottom: calc(100% + 8px); left: 0"
          @pointerdown.stop
        >
          <div
            class="admin-text-toolbar__drag-handle"
            title="ลากย้ายตำแหน่ง"
            @pointerdown.stop="startInlineDrag"
          >
            <q-icon name="open_with" size="12px" />
            <span>ย้าย</span>
          </div>

          <div class="admin-text-toolbar__divider" />
          <button
            class="admin-text-toolbar__btn"
            :class="{ 'admin-text-toolbar__btn--active': inlineElStyle.isBold }"
            title="ตัวหนา"
            @click="toggleInlineBold"
          >
            <strong>B</strong>
          </button>
          <button
            class="admin-text-toolbar__btn"
            :class="{ 'admin-text-toolbar__btn--active': inlineElStyle.isItalic }"
            title="ตัวเอียง"
            @click="toggleInlineItalic"
          >
            <em>I</em>
          </button>

          <div class="admin-text-toolbar__divider" />

          <div class="admin-text-toolbar__size-box">
            <button class="admin-text-toolbar__step-btn" @click="stepInlineFontSize(-2)">
              <q-icon name="remove" size="10px" />
            </button>
            <input
              type="number"
              min="8"
              max="120"
              class="admin-text-toolbar__size-input"
              :value="inlineElStyle.fontSizePx"
              @input="onInlineFontSizeInput"
            />
            <button class="admin-text-toolbar__step-btn" @click="stepInlineFontSize(2)">
              <q-icon name="add" size="10px" />
            </button>
          </div>

          <div class="admin-text-toolbar__divider" />

          <label class="admin-text-toolbar__color-picker-label">
            <input
              type="color"
              class="admin-text-toolbar__color-input"
              :value="inlineElStyle.textColor"
              @input="onInlineColorInput"
            />
            <div
              class="admin-text-toolbar__rainbow-badge"
              :style="{ background: inlineElStyle.textColor }"
            >
              <q-icon name="palette" size="14px" />
            </div>
          </label>
        </div>

        <div
          v-else-if="inlineElType === 'image'"
          class="admin-text-toolbar admin-text-toolbar--image"
          style="position: absolute; bottom: calc(100% + 8px); left: 0"
          @pointerdown.stop
        >
          <div
            class="admin-text-toolbar__drag-handle"
            title="ลากย้ายตำแหน่ง"
            @pointerdown.stop="startInlineDrag"
          >
            <q-icon name="open_with" size="12px" />
            <span>ย้าย</span>
          </div>
          <div class="admin-text-toolbar__divider" />
          <button
            class="admin-free-block__img-upload-btn"
            style="position: relative; top: 0; left: 0"
            @click="triggerImageForActiveInline"
          >
            <q-icon name="photo_camera" size="13px" />
            <span>เปลี่ยนรูป</span>
          </button>
          <template v-if="activeImageSize">
            <div class="admin-text-toolbar__divider" />
            <div
              class="admin-img-size-badge"
              style="
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: 600;
                color: #0284c7;
                background: #e0f2fe;
                border-radius: 6px;
              "
            >
              <q-icon name="aspect_ratio" size="13px" />
              <span>ขนาด {{ activeImageSize.width }} × {{ activeImageSize.height }} px</span>
            </div>
          </template>
        </div>

        <div
          v-else-if="inlineElType === 'icon'"
          class="admin-text-toolbar"
          style="position: absolute; bottom: calc(100% + 8px); left: 0"
          @pointerdown.stop
        >
          <div
            class="admin-text-toolbar__drag-handle"
            title="ลากย้ายตำแหน่ง"
            @pointerdown.stop="startInlineDrag"
          >
            <q-icon name="open_with" size="12px" />
            <span>ย้าย</span>
          </div>
          <div class="admin-text-toolbar__divider" />
          <button class="admin-text-toolbar__btn" @click="triggerIconForActiveInline">
            <q-icon name="grid_view" size="14px" />
            <span>เปลี่ยนไอคอน</span>
          </button>
          <div class="admin-text-toolbar__divider" />
          <label class="admin-text-toolbar__color-picker-label">
            <input
              type="color"
              class="admin-text-toolbar__color-input"
              :value="inlineElStyle.textColor"
              @input="onInlineColorInput"
            />
            <div class="admin-text-toolbar__rainbow-badge">
              <q-icon name="palette" size="14px" />
            </div>
            <q-tooltip>เปลี่ยนสีไอคอน</q-tooltip>
          </label>
        </div>

        <div class="admin-free-block__actions admin-inline-actions" @pointerdown.stop>
          <button
            class="admin-free-block__btn admin-free-block__btn--confirm"
            @click="confirmActiveInline"
          >
            <q-icon name="check" size="14px" />
            <q-tooltip>บันทึก</q-tooltip>
          </button>
          <button
            class="admin-free-block__btn admin-free-block__btn--delete"
            @click="deleteActiveInline"
          >
            <q-icon name="close" size="14px" />
            <q-tooltip>ลบ</q-tooltip>
          </button>
        </div>

        <span
          class="admin-free-block__resize-handle admin-free-block__resize-handle--se"
          @pointerdown.stop="onInlineResizeDown($event, 'se')"
        />
        <span
          class="admin-free-block__resize-handle admin-free-block__resize-handle--sw"
          @pointerdown.stop="onInlineResizeDown($event, 'sw')"
        />
        <span
          class="admin-free-block__resize-handle admin-free-block__resize-handle--ne"
          @pointerdown.stop="onInlineResizeDown($event, 'ne')"
        />
        <span
          class="admin-free-block__resize-handle admin-free-block__resize-handle--nw"
          @pointerdown.stop="onInlineResizeDown($event, 'nw')"
        />
      </div>
    </teleport>

    <AdminImageCropper
      v-model="showCropDialog"
      :image-src="cropImageSrc"
      :recommended-width="cropRecommendedWidth"
      :recommended-height="cropRecommendedHeight"
      :block-label="cropBlockLabel"
      @confirm="onCropConfirm"
      @cancel="onCropCancel"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  nextTick,
  computed,
  reactive,
  onMounted,
  onUnmounted,
  type CSSProperties,
} from 'vue';
import AdminImageCropper from '@/components/admin/modals/admin-image-cropper.vue';
import PreviewSectionHeader from '@/components/admin/sections/preview/home/preview-section-header.vue';
import PreviewSectionHero from '@/components/admin/sections/preview/home/preview-section-hero.vue';
import PreviewSectionBenefits from '@/components/admin/sections/preview/home/preview-section-benefits.vue';
import PreviewSectionActivityFormats from '@/components/admin/sections/preview/home/preview-section-activity-formats.vue';
import PreviewSectionGallery from '@/components/admin/sections/preview/home/preview-section-gallery.vue';
import PreviewSectionActivityGallery from '@/components/admin/sections/preview/home/preview-section-activity-gallery.vue';
import PreviewSectionQuiz from '@/components/admin/sections/preview/home/preview-section-quiz.vue';
import PreviewSectionBranches from '@/components/admin/sections/preview/home/preview-section-branches.vue';
import PreviewSectionCta from '@/components/admin/sections/preview/home/preview-section-cta.vue';
import PreviewSectionPromotionsHero from '@/components/admin/sections/preview/promotions/preview-section-promotions-hero.vue';
import PreviewSectionPromotionsList from '@/components/admin/sections/preview/promotions/preview-section-promotions-list.vue';
import PreviewSectionPromotionsCta from '@/components/admin/sections/preview/promotions/preview-section-promotions-cta.vue';
import PreviewSectionCoursesHero from '@/components/admin/sections/preview/courses/preview-section-courses-hero.vue';
import PreviewSectionCoursesList from '@/components/admin/sections/preview/courses/preview-section-courses-list.vue';
import PreviewSectionResourcesHero from '@/components/admin/sections/preview/resources/preview-section-resources-hero.vue';
import PreviewSectionResourcesList from '@/components/admin/sections/preview/resources/preview-section-resources-list.vue';
import PreviewSectionAboutHero from '@/components/admin/sections/preview/about/preview-section-about-hero.vue';
import PreviewSectionAboutMission from '@/components/admin/sections/preview/about/preview-section-about-mission.vue';
import PreviewSectionFooter from '@/components/admin/sections/preview/home/preview-section-footer.vue';
import PreviewSectionCustomBlock from '@/components/admin/sections/preview/custom/preview-section-custom-block.vue';
import { useWebsiteEditor, type InlineDomState } from '@/composables/use-website-editor';

const {
  activePage,
  header: headerData,
  hero: heroData,
  gallery: galleryData,
  activityFormats: activityFormatsData,
  activityGallery: activityGalleryData,
  promotionsPage: promotionsPageData,
  coursesPage: coursesPageData,
  aboutPage: aboutPageData,
  customBlocks,
  navSections,
  activeSectionId,
  viewportMode,
  availableIcons,
  imageBlockSizes,
  getDefaultImageSrcs,
  saveHistorySnapshot,
} = useWebsiteEditor();

function getCustomBlock(id: string) {
  return customBlocks.find((b) => b.id === id);
}

const previewScrollRoot = ref<HTMLElement | null>(null);
const previewContainerRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
let activeImageCallback: ((url: string) => void) | null = null;
const activeImageKey = ref<string>('');

const showCropDialog = ref<boolean>(false);
const cropImageSrc = ref<string>('');
const cropRecommendedWidth = ref<number>(800);
const cropRecommendedHeight = ref<number>(600);
const cropBlockLabel = ref<string>('');

const containerWidth = ref(1200);
let resizeObserver: ResizeObserver | null = null;

function updateContainerWidth(): void {
  if (previewContainerRef.value) {
    containerWidth.value = previewContainerRef.value.clientWidth;
  }
}

watch(
  () => activeSectionId.value,
  async (newId) => {
    if (!newId) return;
    await nextTick();
    const kebabId = newId.replace(/([A-Z])/g, '-$1').toLowerCase();
    const targetEl =
      document.getElementById(`preview-section-${kebabId}`) ||
      document.getElementById(`preview-section-${newId}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },
  { immediate: true },
);

const targetWidth = computed(() => {
  if (viewportMode.value === 'mobile') return 390;
  if (viewportMode.value === 'tablet') return 768;
  return containerWidth.value || 1200;
});

const scaleRatio = computed(() => {
  if (viewportMode.value === 'desktop') return 1;
  const avail = (containerWidth.value || 1200) - 16;
  if (avail <= 0) return 1;
  return Math.min(1, avail / targetWidth.value);
});

const scaleWrapperStyle = computed<CSSProperties>(() => {
  if (viewportMode.value === 'desktop') {
    return {
      width: '100%',
      height: '100%',
      transform: 'none',
    };
  }
  const ratio = scaleRatio.value;
  return {
    width: `${targetWidth.value}px`,
    height: `${100 / ratio}%`,
    transform: `scale(${ratio})`,
    transformOrigin: 'top center',
  };
});

const showIconPicker = ref(false);
const isAnyModalOpen = computed((): boolean => showCropDialog.value || showIconPicker.value);
let activeIconCallback: ((iconName: string) => void) | null = null;

function openIconPicker(callback: (iconName: string) => void): void {
  activeInlineEl.value = null;
  activeIconCallback = callback;
  showIconPicker.value = true;
}

function selectNewIcon(iconName: string): void {
  if (activeIconCallback) {
    saveHistorySnapshot();
    activeIconCallback(iconName);
  }
  showIconPicker.value = false;
}

function selectSection(sectionId: string): void {
  activeSectionId.value = sectionId;
}

function triggerImageUpload(callback: (url: string) => void, imageKey?: string): void {
  activeImageCallback = callback;
  if (imageKey) {
    activeImageKey.value = imageKey;
  }
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
    fileInputRef.value.click();
  }
}

function onFilePicked(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0] && activeImageCallback) {
    const file = target.files[0];
    cropImageSrc.value = URL.createObjectURL(file);

    const activeEl = activeInlineEl.value;
    const keyEl = activeImageKey.value
      ? document.querySelector<HTMLElement>(`[data-image-key="${activeImageKey.value}"]`)
      : null;
    const targetEl = activeEl || keyEl;

    let targetW = 0;
    let targetH = 0;

    if (targetEl) {
      const imgEl =
        targetEl.querySelector('img') || (targetEl instanceof HTMLImageElement ? targetEl : null);
      const measuredEl = imgEl || targetEl;

      const styleW = parseFloat(measuredEl.style.width || targetEl.style.width);
      const styleH = parseFloat(measuredEl.style.height || targetEl.style.height);

      if (!isNaN(styleW) && styleW > 0 && !isNaN(styleH) && styleH > 0) {
        targetW = Math.round(styleW);
        targetH = Math.round(styleH);
      } else {
        const rect = measuredEl.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const ratio = scaleRatio.value || 1;
          targetW = Math.round(rect.width / ratio);
          targetH = Math.round(rect.height / ratio);
        }
      }
    }

    const spec = activeImageKey.value ? imageBlockSizes[activeImageKey.value] : undefined;

    if (targetW > 0 && targetH > 0) {
      cropRecommendedWidth.value = targetW;
      cropRecommendedHeight.value = targetH;
      cropBlockLabel.value = spec?.label || 'ปรับขนาดรูปภาพ';
    } else if (spec) {
      cropRecommendedWidth.value = spec.width;
      cropRecommendedHeight.value = spec.height;
      cropBlockLabel.value = spec.label;
    } else {
      cropRecommendedWidth.value = 800;
      cropRecommendedHeight.value = 600;
      cropBlockLabel.value = 'รูปภาพ';
    }

    showCropDialog.value = true;
  }
}

function onCropConfirm(croppedDataUrl: string): void {
  if (activeImageCallback) {
    saveHistorySnapshot();
    activeImageCallback(croppedDataUrl);
  }
  showCropDialog.value = false;
  activeImageCallback = null;
  activeImageKey.value = '';
  cropImageSrc.value = '';
}

function onCropCancel(): void {
  showCropDialog.value = false;
  activeImageCallback = null;
  activeImageKey.value = '';
  cropImageSrc.value = '';
}

const activeInlineEl = ref<HTMLElement | null>(null);
const inlineOverlayRef = ref<HTMLElement | null>(null);
const inlineElType = ref<'text' | 'image' | 'icon'>('text');
const inlineOverlayPos = reactive({ top: 0, left: 0, width: 0, height: 0 });
const inlineElDimensions = reactive({ width: 0, height: 0 });

const inlineElStyle = reactive({
  fontSizePx: 16,
  textColor: '#1e293b',
  isBold: false,
  isItalic: false,
});

function colorToHex(color: string): string {
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;

  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!rgbMatch) return '#1e293b';

  return [rgbMatch[1], rgbMatch[2], rgbMatch[3]]
    .map((channel) =>
      Math.max(0, Math.min(255, Number(channel)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
    .padStart(6, '0')
    .replace(/^/, '#');
}

function syncInlineElStyle(el: HTMLElement): void {
  const comp = window.getComputedStyle(el);
  const parsedSize = parseInt(comp.fontSize, 10);
  const parsedWeight = parseInt(comp.fontWeight, 10);
  const fontSize = isNaN(parsedSize) ? 16 : parsedSize;
  const textColor = colorToHex(comp.color || '#1e293b');

  inlineElStyle.fontSizePx = fontSize;
  inlineElStyle.textColor = textColor;
  inlineElStyle.isBold =
    comp.fontWeight === 'bold' || (!isNaN(parsedWeight) && parsedWeight >= 700);
  inlineElStyle.isItalic = comp.fontStyle === 'italic';
  el.style.setProperty('--admin-inline-active-color', textColor);
  el.style.setProperty('--admin-inline-active-font-size', `${fontSize}px`);
}

function updateInlineOverlayPos(): void {
  if (!activeInlineEl.value) return;
  const rect = activeInlineEl.value.getBoundingClientRect();
  inlineOverlayPos.top = rect.top;
  inlineOverlayPos.left = rect.left;
  inlineOverlayPos.width = rect.width;
  inlineOverlayPos.height = rect.height;

  if (inlineOverlayRef.value) {
    inlineOverlayRef.value.style.top = `${rect.top}px`;
    inlineOverlayRef.value.style.left = `${rect.left}px`;
    inlineOverlayRef.value.style.width = `${rect.width}px`;
    inlineOverlayRef.value.style.height = `${rect.height}px`;
  }

  const ratio = scaleRatio.value || 1;
  const targetEl =
    activeInlineEl.value.querySelector<HTMLImageElement>('img') ||
    (activeInlineEl.value instanceof HTMLImageElement
      ? activeInlineEl.value
      : activeInlineEl.value);
  const targetRect = targetEl.getBoundingClientRect();

  if (targetRect.width > 0 && targetRect.height > 0) {
    inlineElDimensions.width = Math.round(targetRect.width / ratio);
    inlineElDimensions.height = Math.round(targetRect.height / ratio);
  }

  syncInlineElStyle(activeInlineEl.value);
}

const activeInlineOverlayStyle = computed<CSSProperties>(() => {
  const isNonText = inlineElType.value !== 'text';
  return {
    position: 'fixed',
    top: `${inlineOverlayPos.top}px`,
    left: `${inlineOverlayPos.left}px`,
    width: `${inlineOverlayPos.width}px`,
    height: `${inlineOverlayPos.height}px`,
    border: '1.5px solid #16a34a',
    borderRadius: '6px',
    boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.9), 0 0 0 4px rgba(22, 163, 74, 0.2)',
    pointerEvents: isNonText ? 'auto' : 'none',
    cursor: isNonText ? 'grab' : 'default',
    willChange: 'transform',
    zIndex: 99990,
  };
});

watch(activeInlineEl, (newEl, oldEl) => {
  oldEl?.classList.remove('admin-inline-editable--active');
  if (newEl?.classList.contains('admin-inline-editable')) {
    newEl.classList.add('admin-inline-editable--active');
  }
});

function onOverlayPointerDown(e: PointerEvent): void {
  const target = e.target as HTMLElement | null;
  if (
    target?.closest('.admin-text-toolbar') ||
    target?.closest('.admin-free-block__actions') ||
    target?.closest('.admin-free-block__resize-handle')
  ) {
    return;
  }
  startInlineDrag(e);
}

let inlineResizeRafId: number | null = null;

function startInlineDrag(e: PointerEvent): void {
  if (!activeInlineEl.value) return;
  e.preventDefault();
  saveHistorySnapshot();
  const targetEl = activeInlineEl.value;
  const overlayEl = inlineOverlayRef.value;
  const pointerTarget = e.target as HTMLElement;

  pointerTarget.setPointerCapture(e.pointerId);

  const startX = e.clientX;
  const startY = e.clientY;
  let latestX = e.clientX;
  let latestY = e.clientY;
  let rafId: number | null = null;

  const parentEl = targetEl.parentElement;
  const origTransition = targetEl.style.transition;
  const origParentTransition = parentEl ? parentEl.style.transition : '';

  targetEl.style.transition = 'none';
  targetEl.style.willChange = 'transform';
  if (parentEl) parentEl.style.transition = 'none';

  const elMatrix = new DOMMatrix(window.getComputedStyle(targetEl).transform);
  const initElDx = elMatrix.m41;
  const initElDy = elMatrix.m42;

  function renderDrag(): void {
    rafId = null;
    const dx = latestX - startX;
    const dy = latestY - startY;

    targetEl.style.transform = `translate3d(${initElDx + dx}px, ${initElDy + dy}px, 0)`;

    const ov = inlineOverlayRef.value ?? overlayEl;
    if (ov) ov.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  }

  function onMove(ev: PointerEvent): void {
    ev.preventDefault();
    latestX = ev.clientX;
    latestY = ev.clientY;
    if (rafId === null) rafId = requestAnimationFrame(renderDrag);
  }

  function onUp(ev: PointerEvent): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    pointerTarget.releasePointerCapture(ev.pointerId);
    targetEl.style.willChange = '';
    targetEl.style.transition = origTransition;
    if (parentEl) parentEl.style.transition = origParentTransition;
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);

    const ov = inlineOverlayRef.value ?? overlayEl;
    if (ov) ov.style.transform = '';

    const finalRect = targetEl.getBoundingClientRect();
    inlineOverlayPos.top = finalRect.top;
    inlineOverlayPos.left = finalRect.left;
    inlineOverlayPos.width = finalRect.width;
    inlineOverlayPos.height = finalRect.height;

    saveHistorySnapshot();
  }

  window.addEventListener('pointermove', onMove, { passive: false });
  window.addEventListener('pointerup', onUp);
}

function onInlineResizeDown(e: PointerEvent, corner: string): void {
  if (!activeInlineEl.value) return;
  e.preventDefault();
  saveHistorySnapshot();
  const targetEl = activeInlineEl.value;
  const resizeTarget = e.target as HTMLElement | null;
  resizeTarget?.setPointerCapture?.(e.pointerId);

  const startX = e.clientX;
  const startY = e.clientY;
  let latestX = e.clientX;
  let latestY = e.clientY;
  const startW = targetEl.offsetWidth;
  const startH = targetEl.offsetHeight;

  targetEl.style.willChange = 'width, height';

  function renderInlineResize(): void {
    inlineResizeRafId = null;
    const dx = latestX - startX;
    const dy = latestY - startY;

    let newW = startW;
    let newH = startH;

    if (corner.includes('e')) newW = Math.max(30, startW + dx);
    if (corner.includes('w')) newW = Math.max(30, startW - dx);
    if (corner.includes('s')) newH = Math.max(20, startH + dy);
    if (corner.includes('n')) newH = Math.max(20, startH - dy);

    targetEl.style.width = `${newW}px`;
    targetEl.style.height = `${newH}px`;

    inlineElDimensions.width = Math.round(newW);
    inlineElDimensions.height = Math.round(newH);

    const rect = targetEl.getBoundingClientRect();
    inlineOverlayPos.top = rect.top;
    inlineOverlayPos.left = rect.left;
    inlineOverlayPos.width = rect.width;
    inlineOverlayPos.height = rect.height;

    if (inlineOverlayRef.value) {
      inlineOverlayRef.value.style.top = `${rect.top}px`;
      inlineOverlayRef.value.style.left = `${rect.left}px`;
      inlineOverlayRef.value.style.width = `${rect.width}px`;
      inlineOverlayRef.value.style.height = `${rect.height}px`;
    }
  }

  function onPointerMove(moveEvent: PointerEvent): void {
    moveEvent.preventDefault();
    latestX = moveEvent.clientX;
    latestY = moveEvent.clientY;

    if (inlineResizeRafId === null) {
      inlineResizeRafId = requestAnimationFrame(renderInlineResize);
    }
  }

  function onPointerUp(upEvent: PointerEvent): void {
    if (inlineResizeRafId !== null) {
      cancelAnimationFrame(inlineResizeRafId);
      inlineResizeRafId = null;
    }

    resizeTarget?.releasePointerCapture?.(upEvent.pointerId);
    targetEl.style.willChange = '';

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);

    updateInlineOverlayPos();
  }

  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp);
}

function toggleInlineBold(): void {
  if (!activeInlineEl.value) return;
  saveHistorySnapshot();
  inlineElStyle.isBold = !inlineElStyle.isBold;
  activeInlineEl.value.style.fontWeight = inlineElStyle.isBold ? '700' : '400';
  syncInlineElStyle(activeInlineEl.value);
}

function toggleInlineItalic(): void {
  if (!activeInlineEl.value) return;
  saveHistorySnapshot();
  inlineElStyle.isItalic = !inlineElStyle.isItalic;
  activeInlineEl.value.style.fontStyle = inlineElStyle.isItalic ? 'italic' : 'normal';
  syncInlineElStyle(activeInlineEl.value);
}

function stepInlineFontSize(delta: number): void {
  if (!activeInlineEl.value) return;
  saveHistorySnapshot();
  const current = inlineElStyle.fontSizePx || 16;
  const newSize = Math.min(120, Math.max(8, current + delta));
  activeInlineEl.value.style.fontSize = `${newSize}px`;
  activeInlineEl.value.style.setProperty('--admin-inline-active-font-size', `${newSize}px`);
  inlineElStyle.fontSizePx = newSize;
  updateInlineOverlayPos();
}

function onInlineFontSizeInput(e: Event): void {
  const target = e.target as HTMLInputElement;
  const val = parseInt(target.value, 10);
  if (!isNaN(val) && activeInlineEl.value) {
    saveHistorySnapshot();
    const clamped = Math.min(120, Math.max(8, val));
    activeInlineEl.value.style.fontSize = `${clamped}px`;
    activeInlineEl.value.style.setProperty('--admin-inline-active-font-size', `${clamped}px`);
    inlineElStyle.fontSizePx = clamped;
    updateInlineOverlayPos();
  }
}

function onInlineColorInput(e: Event): void {
  const target = e.target as HTMLInputElement;
  if (target.value && activeInlineEl.value) {
    saveHistorySnapshot();
    activeInlineEl.value.style.color = target.value;
    activeInlineEl.value.style.setProperty('--admin-inline-active-color', target.value);
    inlineElStyle.textColor = target.value;
  }
}

const activeImageSize = computed(() => {
  if (!activeInlineEl.value || inlineElType.value !== 'image') return null;
  if (inlineElDimensions.width > 0 && inlineElDimensions.height > 0) {
    return {
      width: inlineElDimensions.width,
      height: inlineElDimensions.height,
      label: 'ขนาดปัจจุบัน',
    };
  }
  const key =
    activeInlineEl.value.getAttribute('data-image-key') ||
    activeInlineEl.value.closest('[data-image-key]')?.getAttribute('data-image-key');
  if (key && imageBlockSizes[key]) {
    return imageBlockSizes[key];
  }
  return null;
});

function triggerImageForActiveInline(): void {
  const el = activeInlineEl.value;
  if (!el) return;

  const targetEl = el.getAttribute('data-image-key')
    ? el
    : el.closest<HTMLElement>('[data-image-key]') || el;

  const key = targetEl.getAttribute('data-image-key');

  triggerImageUpload((url) => {
    const savedTargetW = targetEl.style.width;
    const savedTargetH = targetEl.style.height;
    const img =
      targetEl.querySelector('img') || (targetEl instanceof HTMLImageElement ? targetEl : null);
    const savedImgW = img?.style.width;
    const savedImgH = img?.style.height;

    if (img) img.src = url;

    if (key === 'header.logo') {
      headerData.logo = url;
    } else if (key === 'hero.image') {
      heroData.image = url;
    } else if (key === 'gallery.certificateImage') {
      galleryData.certificateImage = url;
    } else if (key === 'aboutPage.image') {
      aboutPageData.image = url;
    } else if (key === 'activityFormats.item') {
      const idxAttr = targetEl.getAttribute('data-image-index');
      if (idxAttr !== null) {
        const idx = parseInt(idxAttr, 10);
        if (activityFormatsData.items[idx]) {
          activityFormatsData.items[idx].image = url;
        }
      }
    } else if (key === 'activityGallery.photo') {
      const gIdxAttr = targetEl.getAttribute('data-group-index');
      const pIdxAttr = targetEl.getAttribute('data-photo-index');
      if (gIdxAttr !== null && pIdxAttr !== null) {
        const gIdx = parseInt(gIdxAttr, 10);
        const pIdx = parseInt(pIdxAttr, 10);
        if (activityGalleryData.groups[gIdx]?.photos[pIdx]) {
          activityGalleryData.groups[gIdx].photos[pIdx].src = url;
        }
      }
    } else if (key === 'promotionsPage.item') {
      const pIdxAttr = targetEl.getAttribute('data-promo-index');
      if (pIdxAttr !== null) {
        const pIdx = parseInt(pIdxAttr, 10);
        if (promotionsPageData.items[pIdx]) {
          promotionsPageData.items[pIdx].image = url;
        }
      }
    } else if (key === 'coursesPage.item') {
      const cIdxAttr = targetEl.getAttribute('data-course-index');
      if (cIdxAttr !== null) {
        const cIdx = parseInt(cIdxAttr, 10);
        if (coursesPageData.items[cIdx]) {
          coursesPageData.items[cIdx].image = url;
        }
      }
    } else if (key === 'customBlock') {
      const bId = targetEl.getAttribute('data-block-id');
      if (bId) {
        const cb = getCustomBlock(bId);
        if (cb) cb.image = url;
      }
    }

    void nextTick(() => {
      if (savedTargetW) targetEl.style.width = savedTargetW;
      if (savedTargetH) targetEl.style.height = savedTargetH;
      if (img) {
        if (savedImgW) img.style.width = savedImgW;
        if (savedImgH) img.style.height = savedImgH;
      }
      setTimeout(() => {
        if (savedTargetW) targetEl.style.width = savedTargetW;
        if (savedTargetH) targetEl.style.height = savedTargetH;
        if (img) {
          if (savedImgW) img.style.width = savedImgW;
          if (savedImgH) img.style.height = savedImgH;
        }
        updateInlineOverlayPos();
      }, 30);
    });
  }, key || undefined);
}

function triggerIconForActiveInline(): void {
  openIconPicker((iconName) => {
    if (activeInlineEl.value) {
      const qIcon =
        activeInlineEl.value.querySelector<HTMLElement>('.q-icon') || activeInlineEl.value;
      if (qIcon) {
        qIcon.setAttribute('name', iconName);
      }
    }
  });
}

interface InlineElBackup {
  transform: string;
  width: string;
  height: string;
  fontSize: string;
  color: string;
  fontWeight: string;
  fontStyle: string;
  display: string;
  src?: string | undefined;
  iconName?: string | null | undefined;
  text?: string | undefined;
}

let inlineBackup: InlineElBackup | null = null;

function createInlineBackup(el: HTMLElement): InlineElBackup {
  const img =
    el.querySelector<HTMLImageElement>('img') || (el instanceof HTMLImageElement ? el : null);
  const qIcon =
    el.querySelector<HTMLElement>('.q-icon') || (el.classList.contains('q-icon') ? el : null);
  return {
    transform: el.style.transform,
    width: el.style.width,
    height: el.style.height,
    fontSize: el.style.fontSize,
    color: el.style.color,
    fontWeight: el.style.fontWeight,
    fontStyle: el.style.fontStyle,
    display: el.style.display,
    src: img?.src,
    iconName: qIcon?.getAttribute('name'),
    text: el.isContentEditable ? el.innerText : undefined,
  };
}

function cancelActiveInline(): void {
  if (activeInlineEl.value && inlineBackup) {
    const el = activeInlineEl.value;
    el.style.transform = inlineBackup.transform;
    el.style.width = inlineBackup.width;
    el.style.height = inlineBackup.height;
    el.style.fontSize = inlineBackup.fontSize;
    el.style.color = inlineBackup.color;
    el.style.fontWeight = inlineBackup.fontWeight;
    el.style.fontStyle = inlineBackup.fontStyle;
    el.style.display = inlineBackup.display;

    if (inlineBackup.fontSize) {
      el.style.setProperty('--admin-inline-active-font-size', inlineBackup.fontSize);
    } else {
      el.style.removeProperty('--admin-inline-active-font-size');
    }

    if (inlineBackup.color) {
      el.style.setProperty('--admin-inline-active-color', inlineBackup.color);
    } else {
      el.style.removeProperty('--admin-inline-active-color');
    }

    if (inlineBackup.src) {
      const img =
        el.querySelector<HTMLImageElement>('img') || (el instanceof HTMLImageElement ? el : null);
      if (img) img.src = inlineBackup.src;
    }

    if (inlineBackup.iconName !== undefined) {
      const qIcon =
        el.querySelector<HTMLElement>('.q-icon') || (el.classList.contains('q-icon') ? el : null);
      if (qIcon && inlineBackup.iconName) qIcon.setAttribute('name', inlineBackup.iconName);
    }

    if (inlineBackup.text !== undefined && el.isContentEditable) {
      el.innerText = inlineBackup.text;
    }
  }
  activeInlineEl.value?.classList.remove('admin-inline-editable--active');
  activeInlineEl.value = null;
  inlineBackup = null;
}

function confirmActiveInline(): void {
  activeInlineEl.value?.classList.remove('admin-inline-editable--active');
  activeInlineEl.value = null;
  inlineBackup = null;
}

function deleteActiveInline(): void {
  if (activeInlineEl.value) {
    saveHistorySnapshot();
    activeInlineEl.value.style.display = 'none';
  }
  activeInlineEl.value?.classList.remove('admin-inline-editable--active');
  activeInlineEl.value = null;
  inlineBackup = null;
}

function handleGlobalPointerDown(e: PointerEvent): void {
  const target = e.target as HTMLElement | null;
  if (!target) return;

  const inlineTarget = target.closest<HTMLElement>(
    '.admin-inline-editable, .admin-image-hover-trigger, .admin-icon-clickable',
  );

  if (inlineTarget) {
    if (inlineTarget !== activeInlineEl.value) {
      if (activeInlineEl.value) {
        cancelActiveInline();
      }
      saveHistorySnapshot();
    }
    activeInlineEl.value?.classList.remove('admin-inline-editable--active');
    if (inlineTarget.classList.contains('admin-inline-editable')) {
      syncInlineElStyle(inlineTarget);
    }
    activeInlineEl.value = inlineTarget;
    inlineBackup = createInlineBackup(inlineTarget);

    if (inlineTarget.classList.contains('admin-image-hover-trigger')) {
      inlineElType.value = 'image';
    } else if (inlineTarget.classList.contains('admin-icon-clickable')) {
      inlineElType.value = 'icon';
    } else {
      inlineElType.value = 'text';
    }
    updateInlineOverlayPos();

    if (inlineElType.value !== 'text') {
      startInlineDrag(e);
    }
  } else if (!target.closest('.admin-active-inline-overlay, .admin-text-toolbar')) {
    cancelActiveInline();
  }
}

const inlineEditableSelector =
  '.admin-inline-editable, .admin-image-hover-trigger, .admin-icon-clickable';

function clearInlineDomOverrides(): void {
  activeInlineEl.value = null;
  document.querySelectorAll<HTMLElement>(inlineEditableSelector).forEach((el) => {
    el.style.display = '';
    el.style.transform = '';
    el.style.width = '';
    el.style.height = '';
    el.style.fontSize = '';
    el.style.color = '';
    el.style.fontWeight = '';
    el.style.fontStyle = '';
    el.style.removeProperty('--admin-inline-active-color');
    el.style.removeProperty('--admin-inline-active-font-size');
  });
}

function applyInlineDomStates(states: InlineDomState[]): void {
  activeInlineEl.value = null;
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(`.admin-preview-container ${inlineEditableSelector}`),
  );

  elements.forEach((el) => {
    el.style.display = '';
    el.style.transform = '';
    el.style.width = '';
    el.style.height = '';
    el.style.fontSize = '';
    el.style.color = '';
    el.style.fontWeight = '';
    el.style.fontStyle = '';
    el.style.removeProperty('--admin-inline-active-color');
    el.style.removeProperty('--admin-inline-active-font-size');
  });

  states.forEach((state) => {
    const el = elements[state.index];
    if (!el) return;

    if (typeof state.text === 'string' && el.isContentEditable) {
      el.innerText = state.text;
    }

    if (state.imageSrc) {
      const img = el.querySelector<HTMLImageElement>('img') || (el as HTMLImageElement);
      if (img instanceof HTMLImageElement) img.src = state.imageSrc;
    }

    if (state.iconName) {
      const qIcon = el.querySelector<HTMLElement>('.q-icon') || el;
      qIcon.setAttribute('name', state.iconName);
    }

    el.style.display = state.display;
    el.style.transform = state.transform;
    el.style.width = state.width;
    el.style.height = state.height;
    el.style.fontSize = state.fontSize;
    el.style.color = state.color;
    el.style.fontWeight = state.fontWeight;
    el.style.fontStyle = state.fontStyle;

    if (state.color) el.style.setProperty('--admin-inline-active-color', state.color);
    if (state.fontSize) el.style.setProperty('--admin-inline-active-font-size', state.fontSize);
  });
}

function handleEditorReset(): void {
  clearInlineDomOverrides();
  const defaultSrcs = getDefaultImageSrcs();
  document.querySelectorAll<HTMLElement>('[data-image-key]').forEach((el) => {
    const key = el.getAttribute('data-image-key');
    if (key && defaultSrcs[key]) {
      const img =
        el.querySelector<HTMLImageElement>('img') || (el instanceof HTMLImageElement ? el : null);
      if (img) img.src = defaultSrcs[key];
    }
  });
}

function handleEditorRestored(event: Event): void {
  const detail = (event as CustomEvent<{ inlineDomStates?: InlineDomState[] }>).detail;
  if (detail?.inlineDomStates) {
    applyInlineDomStates(detail.inlineDomStates);
  } else {
    clearInlineDomOverrides();
  }
}

onMounted(() => {
  window.addEventListener('pointerdown', handleGlobalPointerDown);
  window.addEventListener('scroll', updateInlineOverlayPos, true);
  window.addEventListener('editor-state-reset', handleEditorReset);
  window.addEventListener('editor-state-restored', handleEditorRestored);

  if (previewContainerRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      updateContainerWidth();
      updateInlineOverlayPos();
    });
    resizeObserver.observe(previewContainerRef.value);
  }
  updateContainerWidth();
});

onUnmounted(() => {
  window.removeEventListener('pointerdown', handleGlobalPointerDown);
  window.removeEventListener('scroll', updateInlineOverlayPos, true);
  window.removeEventListener('editor-state-reset', handleEditorReset);
  window.removeEventListener('editor-state-restored', handleEditorRestored);
});

watch(
  activeSectionId,
  async (newSectionId) => {
    if (!newSectionId || !previewScrollRoot.value) return;
    await nextTick();
    setTimeout(() => {
      if (!previewScrollRoot.value) return;
      const target = previewScrollRoot.value.querySelector<HTMLElement>(
        `#preview-section-${newSectionId}`,
      );
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  },
  { immediate: true },
);
</script>
