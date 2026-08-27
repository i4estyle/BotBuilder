<template>
  <header class="admin-toolbar">
    <div class="admin-toolbar__brand">
      <RouterLink to="/home" class="admin-toolbar__home-link" aria-label="Go to main website">
        <q-icon name="arrow_back" size="18px" />
        <q-tooltip>กลับหน้าหลัก</q-tooltip>
      </RouterLink>
      <img
        :src="resolveAssetUrl(headerData.logo)"
        alt="BotBuilder Logo"
        class="admin-toolbar__logo"
      />
      <div class="admin-toolbar__title-group">
        <h1 class="admin-toolbar__title">ระบบจัดการเนื้อหาเว็บไซต์</h1>
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
          <q-tooltip>ย้อนกลับ</q-tooltip>
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
          <q-tooltip>ทำซ้ำ</q-tooltip>
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
          unelevated
          icon="save"
          label="บันทึกทั้งหมด"
          class="admin-toolbar__commit-btn admin-toolbar__commit-btn--save"
          :loading="isSaving"
          no-caps
          @click="handleSaveAll"
        >
          <q-tooltip>บันทึก</q-tooltip>
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
          flat
          dense
          icon="logout"
          class="admin-toolbar__btn"
          aria-label="Log out"
          @click="handleLogout"
        >
          <q-tooltip>ออกจากระบบ</q-tooltip>
        </q-btn>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { useWebsiteEditor, type EditorLocale } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';
import { useAuthStore } from '@/stores/auth-store';

const router = useRouter();
const authStore = useAuthStore();

const {
  header: headerData,
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

function handleLogout(): void {
  authStore.logout();
  void router.replace('/login');
}

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
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
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
