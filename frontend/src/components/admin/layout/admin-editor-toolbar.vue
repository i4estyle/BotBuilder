<template>
  <header class="admin-toolbar">
    <div class="admin-toolbar__brand">
      <q-btn
        flat
        round
        dense
        size="md"
        :icon="isDrawerMini ? 'menu' : 'menu_open'"
        class="admin-toolbar__sidebar-toggle"
        :aria-label="isDrawerMini ? 'ขยายเมนูหลัก' : 'ย่อเมนูหลัก'"
        @click="toggleDrawer($q.screen.lt.lg)"
      >
        <q-tooltip anchor="bottom left" self="top left" :offset="[0, 8]">
          {{ isDrawerMini ? 'ขยายเมนูหลัก (Ctrl+B)' : 'ย่อเมนูหลัก (Ctrl+B)' }}
        </q-tooltip>
      </q-btn>

      <div class="admin-toolbar__title-group">
        <h1 class="admin-toolbar__title">จัดการเว็บไซต์</h1>
      </div>
    </div>

    <div class="admin-toolbar__actions">
      <div class="admin-toolbar__history-controls" role="group" aria-label="History actions">
        <q-btn
          flat
          dense
          icon="undo"
          class="admin-toolbar__btn"
          :disabled="!canUndo"
          aria-label="Undo action (Ctrl+Z)"
          @click="undo"
        >
          <q-tooltip>ย้อนกลับ (Ctrl+Z)</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          icon="redo"
          class="admin-toolbar__btn"
          :disabled="!canRedo"
          aria-label="Redo action (Ctrl+Y)"
          @click="redo"
        >
          <q-tooltip>ทำซ้ำ (Ctrl+Y)</q-tooltip>
        </q-btn>
      </div>

      <div class="admin-toolbar__viewports" role="group" aria-label="Viewport size selector">
        <q-btn
          flat
          dense
          icon="desktop_mac"
          class="admin-toolbar__btn"
          :class="{ 'admin-toolbar__btn--active': viewportMode === 'desktop' }"
          aria-label="Desktop viewport"
          @click="viewportMode = 'desktop'"
        >
          <q-tooltip>คอมพิวเตอร์</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          icon="tablet_mac"
          class="admin-toolbar__btn"
          :class="{ 'admin-toolbar__btn--active': viewportMode === 'tablet' }"
          aria-label="Tablet viewport"
          @click="viewportMode = 'tablet'"
        >
          <q-tooltip>แท็บเล็ต</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          icon="smartphone"
          class="admin-toolbar__btn"
          :class="{ 'admin-toolbar__btn--active': viewportMode === 'mobile' }"
          aria-label="Mobile viewport"
          @click="viewportMode = 'mobile'"
        >
          <q-tooltip>มือถือ</q-tooltip>
        </q-btn>
      </div>

      <div class="admin-toolbar__lang" role="group" aria-label="Language selector">
        <q-btn
          flat
          dense
          label="TH"
          class="admin-toolbar__btn"
          :class="{ 'admin-toolbar__btn--active': editorLocale === 'th-TH' }"
          @click="changeEditorLanguage('th-TH')"
        >
          <q-tooltip>ภาษาไทย</q-tooltip>
        </q-btn>
        <span class="admin-toolbar__divider">|</span>
        <q-btn
          flat
          dense
          label="EN"
          class="admin-toolbar__btn"
          :class="{ 'admin-toolbar__btn--active': editorLocale === 'en-US' }"
          @click="changeEditorLanguage('en-US')"
        >
          <q-tooltip>ภาษาอังกฤษ</q-tooltip>
        </q-btn>
      </div>

      <div class="admin-toolbar__commit-actions" role="group" aria-label="Save and reset actions">
        <q-btn
          flat
          dense
          icon="open_in_new"
          href="/home"
          target="_blank"
          class="admin-toolbar__btn admin-toolbar__preview-btn"
          aria-label="Preview live site"
        >
          <q-tooltip>เปิดดูเว็บไซต์จริง (แท็บใหม่)</q-tooltip>
        </q-btn>
        <q-btn
          unelevated
          icon="restart_alt"
          label="คืนค่าเริ่มต้น"
          class="admin-toolbar__commit-btn admin-toolbar__commit-btn--reset"
          no-caps
          @click="resetAll"
        >
          <q-tooltip>คืนค่าเริ่มต้น</q-tooltip>
        </q-btn>
        <q-btn
          unelevated
          icon="save"
          label="บันทึกทั้งหมด"
          class="admin-toolbar__commit-btn admin-toolbar__commit-btn--save"
          :loading="isSaving"
          no-caps
          @click="handleSaveAll"
        >
          <q-tooltip>บันทึก (Ctrl+S)</q-tooltip>
        </q-btn>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { Notify, useQuasar } from 'quasar';
import { useWebsiteEditor, type EditorLocale } from '@/composables/use-website-editor';
import { useAdminDrawer } from '@/composables/use-admin-drawer';

const $q = useQuasar();
const { isDrawerMini, toggleDrawer } = useAdminDrawer();

const {
  viewportMode,
  editorLocale,
  setEditorLocale,
  canUndo,
  canRedo,
  undo,
  redo,
  resetAll,
  saveToBackend,
  isSaving,
} = useWebsiteEditor();

async function changeEditorLanguage(value: EditorLocale): Promise<void> {
  await setEditorLocale(value);
}

async function handleSaveAll(): Promise<void> {
  if (isSaving.value) return;
  const success = await saveToBackend();
  if (success) {
    Notify.create({
      type: 'positive',
      icon: 'check_circle',
      message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
      caption: 'อัปเดตข้อมูลขึ้นระบบแบบ Real-time ทันที',
      position: 'top',
      timeout: 1800,
      progress: true,
    });
  } else {
    Notify.create({
      type: 'negative',
      icon: 'error',
      message: 'เกิดข้อผิดพลาดในการบันทึก',
      caption: 'กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่อีกครั้ง',
      position: 'top',
      timeout: 3000,
      progress: true,
    });
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
    event.preventDefault();
    toggleDrawer($q.screen.lt.lg);
  } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    void handleSaveAll();
  } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
    event.preventDefault();
    if (event.shiftKey) {
      redo();
    } else {
      undo();
    }
  } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
    event.preventDefault();
    redo();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>
