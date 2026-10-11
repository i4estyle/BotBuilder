<template>
  <aside
    class="admin-page__editor-sidebar"
    :class="{ 'admin-page__editor-sidebar--mobile-open': isMobileNavOpen }"
  >
    <div class="admin-sidebar-header">
      <span class="admin-sidebar-header__title">โครงสร้างหน้า</span>
    </div>

    <div class="admin-sidebar-page-switcher">
      <div class="admin-sidebar-page-switcher__grid">
        <button
          v-for="pageItem in pagesList"
          :key="pageItem.id"
          class="admin-page-switcher-btn"
          :class="{ 'admin-page-switcher-btn--active': activePage === pageItem.id }"
          @click="setActivePage(pageItem.id)"
        >
          <q-icon :name="pageItem.icon" size="14px" />
          <span>{{ pageItem.title }}</span>
        </button>
      </div>
    </div>

    <div class="admin-page__section-tree">
      <div
        v-for="(item, index) in navSections"
        :key="item.id"
        draggable="true"
        class="admin-nav-tree-item"
        :class="[
          { 'admin-nav-tree-item--active': activeSectionId === item.id },
          { 'admin-nav-tree-item--drag-over': dragOverNavIndex === index },
          `admin-nav-tree-item--${item.color}`,
        ]"
        @click="navigateToSection(item.id)"
        @dragstart="onNavDragStart($event, index)"
        @dragover.prevent="onNavDragOver($event, index)"
        @dragleave="onNavDragLeave(index)"
        @drop="onNavDrop($event, index)"
        @dragend="onNavDragEnd"
      >
        <div
          class="admin-nav-tree-item__drag-handle"
          @pointerdown="hideNavDragTooltip"
          @pointerup="showNavDragTooltip"
          @pointercancel="showNavDragTooltip"
        >
          <q-icon name="drag_indicator" size="14px" />
          <q-tooltip v-if="showNavDragTooltipValue">ลากเพื่อเปลี่ยนลำดับ</q-tooltip>
        </div>

        <div class="admin-nav-tree-item__icon-badge">
          <q-icon :name="item.icon" size="16px" />
        </div>

        <span class="admin-nav-tree-item__label">
          {{ item.title }}
        </span>

        <button
          class="admin-nav-tree-item__action-btn"
          @click.stop="$emit('openEditSection', item)"
        >
          <q-icon name="edit" size="13px" />
          <q-tooltip>แก้ไข</q-tooltip>
        </button>
      </div>
    </div>

    <div class="admin-sidebar-quiz-button-wrap">
      <button type="button" class="admin-sidebar-quiz-btn" @click="$emit('openQuiz')">
        <div class="admin-sidebar-quiz-btn__icon">
          <q-icon name="quiz" size="18px" />
        </div>
        <div class="admin-sidebar-quiz-btn__text">
          <span class="admin-sidebar-quiz-btn__title">จัดการข้อสอบ Quiz</span>
          <span class="admin-sidebar-quiz-btn__sub">แก้ไขโจทย์และคำตอบ</span>
        </div>
        <q-icon name="chevron_right" size="18px" class="admin-sidebar-quiz-btn__arrow" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  useWebsiteEditor,
  type SectionNavItem,
  type ActivePage,
} from '@/composables/use-website-editor';

defineEmits<{
  (e: 'openQuiz'): void;
  (e: 'openEditSection', item: SectionNavItem): void;
}>();

const {
  activePage,
  setActivePage,
  activeSectionId,
  navSections,
  reorderNavSections,
  isMobileNavOpen,
} = useWebsiteEditor();

const pagesList: Array<{ id: ActivePage; title: string; icon: string }> = [
  { id: 'home', title: 'หน้าหลัก', icon: 'home' },
  { id: 'promotions', title: 'โปรโมชั่น', icon: 'local_offer' },
  { id: 'courses', title: 'คอร์สเรียน', icon: 'school' },
  { id: 'resources', title: 'คลังความรู้', icon: 'menu_book' },
  { id: 'about', title: 'เกี่ยวกับเรา', icon: 'info' },
];

const draggedNavIndex = ref<number | null>(null);
const dragOverNavIndex = ref<number | null>(null);
const showNavDragTooltipValue = ref(true);

function hideNavDragTooltip(): void {
  showNavDragTooltipValue.value = false;
}

function showNavDragTooltip(): void {
  if (draggedNavIndex.value === null) {
    showNavDragTooltipValue.value = true;
  }
}

function onNavDragStart(event: DragEvent, index: number): void {
  hideNavDragTooltip();
  draggedNavIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
  }
}

function onNavDragOver(_event: DragEvent, index: number): void {
  if (draggedNavIndex.value !== null && draggedNavIndex.value !== index) {
    dragOverNavIndex.value = index;
  }
}

function onNavDragLeave(index: number): void {
  if (dragOverNavIndex.value === index) {
    dragOverNavIndex.value = null;
  }
}

function onNavDrop(event: DragEvent, dropIndex: number): void {
  event.preventDefault();
  if (draggedNavIndex.value !== null && draggedNavIndex.value !== dropIndex) {
    reorderNavSections(draggedNavIndex.value, dropIndex);
  }
  onNavDragEnd();
}

function onNavDragEnd(): void {
  draggedNavIndex.value = null;
  dragOverNavIndex.value = null;
  window.setTimeout(() => {
    showNavDragTooltipValue.value = true;
  }, 120);
}

function navigateToSection(sectionId: string): void {
  activeSectionId.value = sectionId;
}
</script>
