<template>
  <header class="admin-toolbar">
    <div class="admin-toolbar__brand">
      <RouterLink to="/home" class="admin-toolbar__home-link" aria-label="Go to main website">
        <q-icon name="arrow_back" size="18px" />
        <q-tooltip>กลับหน้าหลัก</q-tooltip>
      </RouterLink>
      <img :src="headerData.logo" alt="BotBuilder Logo" class="admin-toolbar__logo" />
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
          :aria-label="t('admin.viewportDesktop')"
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
          :aria-label="t('admin.viewportTablet')"
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
          :aria-label="t('admin.viewportMobile')"
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
          no-caps
          @click="saveAll"
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
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useWebsiteEditor, type EditorLocale } from '@/composables/use-website-editor';

const { t } = useI18n();
const $q = useQuasar();
const {
  header: headerData,
  navSections,
  themeSettings,
  viewportMode,
  editorLocale,
  setEditorLocale,
  saveCurrentStateToMap,
  contentStateMap,
  canUndo,
  canRedo,
  undo,
  redo,
  resetAll,
} = useWebsiteEditor();

function changeEditorLanguage(value: EditorLocale): void {
  setEditorLocale(value);
}

function saveAll(): void {
  saveCurrentStateToMap();

  localStorage.setItem(
    'botbuilder-admin-website-draft',
    JSON.stringify({
      savedAt: new Date().toISOString(),
      editorLocale: editorLocale.value,
      contentStateMap,
      navSections,
      themeSettings,
    }),
  );

  $q.notify({
    type: 'positive',
    icon: 'check_circle',
    message: `บันทึกข้อมูลเว็บไซต์ (${editorLocale.value === 'th-TH' ? 'ภาษาไทย' : 'ภาษาอังกฤษ'}) เรียบร้อยแล้ว`,
    position: 'top-right',
    timeout: 1800,
  });
}

function handleKeydown(event: KeyboardEvent): void {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
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
