<template>
  <section
    ref="layerRef"
    class="admin-block-layer"
    :class="{ 'admin-block-layer--ghost-active': !!ghostBlockType }"
    @pointerdown="onLayerPointerDown"
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
          <span class="text-h6 text-weight-bold">เลือกไอคอน</span>
          <q-space />
          <q-btn v-close-popup icon="close" flat round dense />
        </q-card-section>
        <q-card-section class="admin-icon-picker-grid">
          <div
            v-for="ic in availableIcons"
            :key="ic"
            class="admin-icon-picker-grid__item"
            @click="pickIcon(ic)"
          >
            <q-icon :name="ic" size="24px" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div
      v-for="block in blocks"
      :key="block.id"
      class="admin-free-block"
      :class="{
        'admin-free-block--selected': selectedBlockId === block.id,
        'admin-free-block--dragging': draggingBlockId === block.id,
      }"
      :style="blockStyle(block)"
      @pointerdown.stop="onBlockPointerDown($event, block)"
    >
      <div class="admin-free-block__content">
        <p v-if="block.type === 'text'" class="admin-free-block__text" :style="textStyle(block)">
          <span
            contenteditable="true"
            class="admin-inline-editable admin-free-block__text-inner"
            @blur="(e) => onTextBlur(e, block)"
            >{{ block.content }}</span
          >
        </p>

        <div v-else-if="block.type === 'image'" class="admin-free-block__image-wrap">
          <img
            :src="block.image"
            alt=""
            draggable="false"
            style="pointer-events: none; -webkit-user-drag: none; user-select: none"
          />
          <button
            v-if="selectedBlockId === block.id"
            class="admin-free-block__img-upload-btn"
            @pointerdown.stop
            @click.stop="triggerImageUpload(block)"
          >
            <q-icon name="photo_camera" size="13px" />
            <span>เปลี่ยนรูป</span>
          </button>
        </div>

        <div
          v-else-if="block.type === 'icon'"
          class="admin-free-block__bare-icon-wrap"
          @click.stop="handleIconClick(block)"
        >
          <q-icon
            :name="block.iconName || 'star'"
            class="admin-free-block__bare-icon"
            :style="{ color: block.iconColor || '#0284c7', pointerEvents: 'none' }"
          />
        </div>

        <div
          v-else-if="block.type === 'shape'"
          class="admin-free-block__shape-wrap"
          :style="shapeBlockStyle(block)"
        />
      </div>

      <!-- Floating Text Toolbar -->
      <div
        v-if="selectedBlockId === block.id && block.type === 'text'"
        class="admin-text-toolbar"
        @pointerdown.stop
      >
        <button
          class="admin-text-toolbar__btn"
          :class="{ 'admin-text-toolbar__btn--active': block.isBold }"
          @click="toggleBold(block)"
        >
          <b>B</b>
          <q-tooltip>ตัวหนา (Bold)</q-tooltip>
        </button>
        <button
          class="admin-text-toolbar__btn"
          :class="{ 'admin-text-toolbar__btn--active': block.isItalic }"
          @click="toggleItalic(block)"
        >
          <i>I</i>
          <q-tooltip>ตัวเอียง (Italic)</q-tooltip>
        </button>

        <div class="admin-text-toolbar__divider" />

        <div class="admin-text-toolbar__size-box">
          <button class="admin-text-toolbar__step-btn" @click="changeFontSize(block, -2)">
            <q-icon name="remove" size="10px" />
            <q-tooltip>ลดขนาด (-2px)</q-tooltip>
          </button>
          <input
            type="number"
            min="8"
            max="120"
            class="admin-text-toolbar__size-input"
            :value="block.fontSizePx || 14"
            @input="onFontSizeInput(block, $event)"
          />
          <button class="admin-text-toolbar__step-btn" @click="changeFontSize(block, 2)">
            <q-icon name="add" size="10px" />
            <q-tooltip>เพิ่มขนาด (+2px)</q-tooltip>
          </button>
        </div>

        <div class="admin-text-toolbar__divider" />

        <label class="admin-text-toolbar__color-picker-label">
          <input
            type="color"
            class="admin-text-toolbar__color-input"
            :value="block.textColor || '#1e293b'"
            @input="onColorInput(block, $event)"
          />
          <div class="admin-text-toolbar__rainbow-badge">
            <q-icon name="palette" size="14px" />
          </div>
          <q-tooltip>เลือกสีข้อความ (ทุกเฉดสี)</q-tooltip>
        </label>
      </div>

      <!-- Floating Icon Toolbar -->
      <div
        v-if="selectedBlockId === block.id && block.type === 'icon'"
        class="admin-text-toolbar"
        @pointerdown.stop
      >
        <button class="admin-text-toolbar__btn" @click="openIconPickerFor(block)">
          <q-icon name="grid_view" size="14px" />
          <span>เปลี่ยนไอคอน</span>
        </button>
        <div class="admin-text-toolbar__divider" />
        <label class="admin-text-toolbar__color-picker-label">
          <input
            type="color"
            class="admin-text-toolbar__color-input"
            :value="block.iconColor || '#0284c7'"
            @input="onIconColorInput(block, $event)"
          />
          <div class="admin-text-toolbar__rainbow-badge">
            <q-icon name="palette" size="14px" />
          </div>
          <q-tooltip>เปลี่ยนสีไอคอน</q-tooltip>
        </label>
      </div>

      <!-- Floating Shape Toolbar -->
      <div
        v-if="selectedBlockId === block.id && block.type === 'shape'"
        class="admin-text-toolbar"
        @pointerdown.stop
      >
        <button
          class="admin-text-toolbar__btn"
          :class="{
            'admin-text-toolbar__btn--active': (block.shapeType || 'rounded') === 'rounded',
          }"
          @click="setShapeType(block, 'rounded')"
        >
          มน
        </button>
        <button
          class="admin-text-toolbar__btn"
          :class="{ 'admin-text-toolbar__btn--active': block.shapeType === 'rect' }"
          @click="setShapeType(block, 'rect')"
        >
          เหลี่ยม
        </button>
        <button
          class="admin-text-toolbar__btn"
          :class="{ 'admin-text-toolbar__btn--active': block.shapeType === 'circle' }"
          @click="setShapeType(block, 'circle')"
        >
          วงกลม
        </button>
        <button
          class="admin-text-toolbar__btn"
          :class="{ 'admin-text-toolbar__btn--active': block.shapeType === 'badge' }"
          @click="setShapeType(block, 'badge')"
        >
          แคปซูล
        </button>

        <div class="admin-text-toolbar__divider" />

        <label class="admin-text-toolbar__color-picker-label">
          <input
            type="color"
            class="admin-text-toolbar__color-input"
            :value="block.bgColor || '#f1f5f9'"
            @input="onShapeBgColorInput(block, $event)"
          />
          <div class="admin-text-toolbar__rainbow-badge">
            <q-icon name="format_color_fill" size="14px" />
          </div>
          <q-tooltip>สีพื้นหลัง</q-tooltip>
        </label>

        <label class="admin-text-toolbar__color-picker-label">
          <input
            type="color"
            class="admin-text-toolbar__color-input"
            :value="block.borderColor || '#cbd5e1'"
            @input="onShapeBorderColorInput(block, $event)"
          />
          <div class="admin-text-toolbar__rainbow-badge">
            <q-icon name="border_color" size="14px" />
          </div>
          <q-tooltip>สีเส้นขอบ</q-tooltip>
        </label>
      </div>

      <div v-if="selectedBlockId === block.id" class="admin-free-block__actions">
        <button
          class="admin-free-block__btn admin-free-block__btn--confirm"
          @pointerdown.stop
          @click.stop="onConfirmBlock(block.id)"
        >
          <q-icon name="check" size="14px" />
          <q-tooltip>บันทึก</q-tooltip>
        </button>
        <button
          class="admin-free-block__btn admin-free-block__btn--delete"
          @pointerdown.stop
          @click.stop="onDeleteBlock(block.id)"
        >
          <q-icon name="close" size="14px" />
          <q-tooltip>ลบ</q-tooltip>
        </button>
      </div>

      <template v-if="selectedBlockId === block.id">
        <span
          class="admin-free-block__resize-handle admin-free-block__resize-handle--se"
          @pointerdown.stop="onResizePointerDown($event, block, 'se')"
        />
        <span
          class="admin-free-block__resize-handle admin-free-block__resize-handle--sw"
          @pointerdown.stop="onResizePointerDown($event, block, 'sw')"
        />
        <span
          class="admin-free-block__resize-handle admin-free-block__resize-handle--ne"
          @pointerdown.stop="onResizePointerDown($event, block, 'ne')"
        />
        <span
          class="admin-free-block__resize-handle admin-free-block__resize-handle--nw"
          @pointerdown.stop="onResizePointerDown($event, block, 'nw')"
        />
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue';
import { useWebsiteEditor, type SectionBlockItem } from '@/composables/use-website-editor';

const props = defineProps<{
  sectionId: string;
}>();

const {
  editMode,
  selectedBlockId,
  availableIcons,
  ghostBlockType,
  dropBlockAtSection,
  saveHistorySnapshot,
  getSectionBlocks,
  removeSectionBlock,
  updateBlockPosition,
  updateBlockSize,
  bringToFront,
} = useWebsiteEditor();

const layerRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const blocks = computed((): SectionBlockItem[] => getSectionBlocks(props.sectionId));

const draggingBlockId = ref<string>('');
let dragStartX = 0;
let dragStartY = 0;
let dragStartBlockX = 0;
let dragStartBlockY = 0;
let hasSavedDragSnapshot = false;

let resizingBlockId = '';
let resizeCorner = '';
let resizeStartX = 0;
let resizeStartY = 0;
let resizeStartW = 0;
let resizeStartH = 0;
let resizeStartBX = 0;
let resizeStartBY = 0;
let hasSavedResizeSnapshot = false;

let activeImageBlock: SectionBlockItem | null = null;
const showIconPicker = ref(false);
let activeIconBlock: SectionBlockItem | null = null;

function blockStyle(block: SectionBlockItem): Record<string, string> {
  return {
    left: `${block.x}%`,
    top: `${block.y}%`,
    width: `${block.w}%`,
    height: block.h > 0 ? `${block.h}px` : 'auto',
    zIndex: String(block.zIndex),
  };
}

function textStyle(block: SectionBlockItem): Record<string, string> {
  return {
    color: block.textColor || '#1e293b',
    fontSize: `${block.fontSizePx || 14}px`,
    fontWeight: block.isBold ? '700' : '400',
    fontStyle: block.isItalic ? 'italic' : 'normal',
  };
}

function onFontSizeInput(block: SectionBlockItem, event: Event): void {
  const target = event.target as HTMLInputElement;
  const val = parseInt(target.value, 10);
  if (!isNaN(val) && val >= 8 && val <= 120) {
    saveHistorySnapshot();
    block.fontSizePx = val;
  }
}

function changeFontSize(block: SectionBlockItem, delta: number): void {
  saveHistorySnapshot();
  const current = block.fontSizePx || 14;
  block.fontSizePx = Math.min(120, Math.max(8, current + delta));
}

function onColorInput(block: SectionBlockItem, event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target.value) {
    saveHistorySnapshot();
    block.textColor = target.value;
  }
}

function toggleBold(block: SectionBlockItem): void {
  saveHistorySnapshot();
  block.isBold = !block.isBold;
}

function toggleItalic(block: SectionBlockItem): void {
  saveHistorySnapshot();
  block.isItalic = !block.isItalic;
}

function getLayerRect(): DOMRect | null {
  return layerRef.value?.getBoundingClientRect() ?? null;
}

function onLayerPointerDown(event: PointerEvent): void {
  if (ghostBlockType.value) {
    event.stopPropagation();
    const rect = layerRef.value?.getBoundingClientRect();
    if (rect && rect.width > 0 && rect.height > 0) {
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;
      const pctX = (clickX / rect.width) * 100;
      const pctY = (clickY / rect.height) * 100;
      dropBlockAtSection(props.sectionId, ghostBlockType.value, pctX, pctY);
    }
    return;
  }
  selectedBlockId.value = '';
}

function onIconColorInput(block: SectionBlockItem, event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target.value) {
    saveHistorySnapshot();
    block.iconColor = target.value;
  }
}

function setShapeType(
  block: SectionBlockItem,
  shape: 'rounded' | 'rect' | 'circle' | 'badge',
): void {
  saveHistorySnapshot();
  block.shapeType = shape;
}

function onShapeBgColorInput(block: SectionBlockItem, event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target.value) {
    saveHistorySnapshot();
    block.bgColor = target.value;
  }
}

function onShapeBorderColorInput(block: SectionBlockItem, event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target.value) {
    saveHistorySnapshot();
    block.borderColor = target.value;
  }
}

function shapeBlockStyle(block: SectionBlockItem): Record<string, string> {
  const borderRadiusMap: Record<string, string> = {
    rounded: '14px',
    rect: '0px',
    circle: '50%',
    badge: '30px',
  };
  return {
    backgroundColor: block.bgColor || '#f1f5f9',
    borderColor: block.borderColor || '#cbd5e1',
    borderStyle: 'solid',
    borderWidth: '1.5px',
    borderRadius: borderRadiusMap[block.shapeType || 'rounded'] || '14px',
    width: '100%',
    height: '100%',
  };
}

function onConfirmBlock(blockId: string): void {
  if (selectedBlockId.value === blockId) {
    saveHistorySnapshot();
    selectedBlockId.value = '';
  }
}

let isDraggingMoved = false;
let activeCapturedEl: HTMLElement | null = null;
let activeCapturedPointerId: number | null = null;
let dragRafId: number | null = null;
let dragLatestX = 0;
let dragLatestY = 0;

function onDeleteBlock(blockId: string): void {
  removeSectionBlock(blockId);
}

function handleIconClick(block: SectionBlockItem): void {
  if (isDraggingMoved) return;
  openIconPickerFor(block);
}

function updateDragTransform(): void {
  dragRafId = null;
  if (!activeCapturedEl) return;

  const deltaX = dragLatestX - dragStartX;
  const deltaY = dragLatestY - dragStartY;

  activeCapturedEl.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
}

function onBlockPointerDown(event: PointerEvent, block: SectionBlockItem): void {
  if (editMode.value !== 'edit') return;
  selectedBlockId.value = block.id;
  bringToFront(block.id);

  const target = event.target as HTMLElement | null;
  if (
    target &&
    (target.classList.contains('admin-free-block__text-inner') || target.isContentEditable)
  ) {
    return;
  }

  const rect = getLayerRect();
  if (!rect) return;

  const currentEl = event.currentTarget as HTMLElement | null;
  if (currentEl) {
    if (currentEl.setPointerCapture) {
      try {
        currentEl.setPointerCapture(event.pointerId);
        activeCapturedEl = currentEl;
        activeCapturedPointerId = event.pointerId;
      } catch {
        // Ignore capture error
      }
    }
    currentEl.style.willChange = 'transform';
  }

  draggingBlockId.value = block.id;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragLatestX = event.clientX;
  dragLatestY = event.clientY;
  dragStartBlockX = block.x;
  dragStartBlockY = block.y;
  hasSavedDragSnapshot = false;
  isDraggingMoved = false;

  window.addEventListener('pointermove', onDragMove, { passive: false });
  window.addEventListener('pointerup', onDragEnd);
}

function onDragMove(event: PointerEvent): void {
  if (!draggingBlockId.value) return;
  event.preventDefault();

  dragLatestX = event.clientX;
  dragLatestY = event.clientY;

  const dist = Math.hypot(dragLatestX - dragStartX, dragLatestY - dragStartY);
  if (dist > 3) {
    isDraggingMoved = true;
  }

  if (!hasSavedDragSnapshot) {
    saveHistorySnapshot();
    hasSavedDragSnapshot = true;
  }

  if (dragRafId === null) {
    dragRafId = requestAnimationFrame(updateDragTransform);
  }
}

function onDragEnd(event?: PointerEvent): void {
  if (dragRafId !== null) {
    cancelAnimationFrame(dragRafId);
    dragRafId = null;
  }

  if (activeCapturedEl && draggingBlockId.value) {
    const rect = getLayerRect();
    if (rect && isDraggingMoved) {
      const deltaXPct = ((dragLatestX - dragStartX) / rect.width) * 100;
      const deltaYPct = ((dragLatestY - dragStartY) / rect.height) * 100;
      updateBlockPosition(
        draggingBlockId.value,
        dragStartBlockX + deltaXPct,
        dragStartBlockY + deltaYPct,
      );
    }

    activeCapturedEl.style.transform = '';
    activeCapturedEl.style.willChange = '';

    if (activeCapturedPointerId !== null) {
      try {
        if (event) activeCapturedEl.releasePointerCapture(event.pointerId);
        else activeCapturedEl.releasePointerCapture(activeCapturedPointerId);
      } catch {
        // Ignore
      }
    }
  }

  activeCapturedEl = null;
  activeCapturedPointerId = null;
  draggingBlockId.value = '';

  window.removeEventListener('pointermove', onDragMove);
  window.removeEventListener('pointerup', onDragEnd);
}

function onResizePointerDown(event: PointerEvent, block: SectionBlockItem, corner: string): void {
  if (editMode.value !== 'edit') return;

  resizingBlockId = block.id;
  resizeCorner = corner;
  resizeStartX = event.clientX;
  resizeStartY = event.clientY;
  resizeStartW = block.w;
  resizeStartH = block.h || 60;
  resizeStartBX = block.x;
  resizeStartBY = block.y;
  hasSavedResizeSnapshot = false;

  window.addEventListener('pointermove', onResizeMove);
  window.addEventListener('pointerup', onResizeEnd);
}

function onResizeMove(event: PointerEvent): void {
  const rect = getLayerRect();
  if (!rect || !resizingBlockId) return;

  if (!hasSavedResizeSnapshot) {
    saveHistorySnapshot();
    hasSavedResizeSnapshot = true;
  }

  const deltaXPct = ((event.clientX - resizeStartX) / rect.width) * 100;
  const deltaYPx = event.clientY - resizeStartY;

  let newW = resizeStartW;
  let newH = resizeStartH;
  let newX = resizeStartBX;
  const newY = resizeStartBY;

  if (resizeCorner === 'se') {
    newW = resizeStartW + deltaXPct;
    newH = resizeStartH + deltaYPx;
  } else if (resizeCorner === 'sw') {
    newW = resizeStartW - deltaXPct;
    newX = resizeStartBX + deltaXPct;
    newH = resizeStartH + deltaYPx;
  } else if (resizeCorner === 'ne') {
    newW = resizeStartW + deltaXPct;
    newH = resizeStartH - deltaYPx;
  } else if (resizeCorner === 'nw') {
    newW = resizeStartW - deltaXPct;
    newX = resizeStartBX + deltaXPct;
    newH = resizeStartH - deltaYPx;
  }

  updateBlockSize(resizingBlockId, newW, newH);
  updateBlockPosition(resizingBlockId, newX, newY);
}

function onResizeEnd(): void {
  resizingBlockId = '';
  window.removeEventListener('pointermove', onResizeMove);
  window.removeEventListener('pointerup', onResizeEnd);
}

function onTextBlur(event: Event, block: SectionBlockItem): void {
  const target = event.target as HTMLElement | null;
  if (!target) return;
  const newText = target.innerText.trim();
  if (newText && newText !== block.content) {
    saveHistorySnapshot();
    block.content = newText;
  }
}

function triggerImageUpload(block: SectionBlockItem): void {
  activeImageBlock = block;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
    fileInputRef.value.click();
  }
}

function onFilePicked(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0] && activeImageBlock) {
    saveHistorySnapshot();
    activeImageBlock.image = URL.createObjectURL(target.files[0]);
  }
}

function openIconPickerFor(block: SectionBlockItem): void {
  activeIconBlock = block;
  showIconPicker.value = true;
}

function pickIcon(iconName: string): void {
  if (activeIconBlock) {
    saveHistorySnapshot();
    activeIconBlock.iconName = iconName;
  }
  showIconPicker.value = false;
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onDragMove);
  window.removeEventListener('pointerup', onDragEnd);
  window.removeEventListener('pointermove', onResizeMove);
  window.removeEventListener('pointerup', onResizeEnd);
});
</script>
