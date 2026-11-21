<template>
  <q-page class="admin-page">
    <AdminEditorToolbar />

    <AdminEditSectionModal
      v-model="showEditSectionModal"
      :editing-section="editingSection"
      @delete="editingSection = null"
    />

    <AdminQuizModal v-model="showQuizModal" />

    <AdminAddSectionModal v-model="showAddSectionModal" />

    <div class="admin-page__workspace">
      <AdminSidebarNav
        @open-quiz="openQuizModal"
        @open-edit-section="openEditSectionModal"
        @open-add-section="showAddSectionModal = true"
      />

      <section class="admin-page__preview-pane">
        <AdminPreviewFrame />
      </section>

      <div v-if="isMobileNavOpen" class="admin-page__mobile-backdrop" @click="toggleMobileNav" />

      <q-btn
        round
        color="primary"
        icon="layers"
        class="admin-page__mobile-floating-btn lt-md"
        aria-label="Toggle section navigation"
        @click="toggleMobileNav"
      >
        <q-tooltip anchor="top middle" self="bottom middle">โครงสร้างหน้าเว็บ</q-tooltip>
      </q-btn>
    </div>

    <q-inner-loading :showing="isLoading">
      <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import AdminAddSectionModal from '@/components/admin/modals/admin-add-section-modal.vue';
import { confirmDiscardChanges } from '@/utils/confirm-dialog';
import AdminEditorToolbar from '@/components/admin/layout/admin-editor-toolbar.vue';
import AdminSidebarNav from '@/components/admin/layout/admin-sidebar-nav.vue';
import AdminPreviewFrame from '@/components/admin/layout/admin-preview-frame.vue';
import AdminEditSectionModal from '@/components/admin/modals/admin-edit-section-modal.vue';
import AdminQuizModal from '@/components/admin/modals/admin-quiz-modal.vue';
import { useWebsiteEditor, type SectionNavItem } from '@/composables/use-website-editor';

const {
  ghostBlockType,
  cancelPlacingBlock,
  fetchPageData,
  activePage,
  editorLocale,
  isLoading,
  isMobileNavOpen,
  toggleMobileNav,
  editMode,
  isDirty,
  activeSectionId,
  selectedBlockId,
} = useWebsiteEditor();

const showEditSectionModal = ref(false);
const editingSection = ref<SectionNavItem | null>(null);
const showQuizModal = ref(false);
const showAddSectionModal = ref(false);

function openEditSectionModal(item: SectionNavItem): void {
  editingSection.value = item;
  showEditSectionModal.value = true;
}

function openQuizModal(): void {
  showEditSectionModal.value = false;
  showQuizModal.value = true;
}

function handleEscape(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    if (isMobileNavOpen.value) {
      toggleMobileNav();
    }
    if (ghostBlockType.value) {
      cancelPlacingBlock();
    }
  }
}

function handleBeforeUnload(e: BeforeUnloadEvent): void {
  if (!isDirty.value) return;
  e.preventDefault();
  // Required by some browsers to show the native "leave site?" prompt.
  e.returnValue = '';
}

onBeforeRouteLeave(async () => {
  if (isDirty.value && !(await confirmDiscardChanges())) return false;
  return true;
});

onMounted(async () => {
  window.addEventListener('keydown', handleEscape);
  window.addEventListener('beforeunload', handleBeforeUnload);
  editMode.value = 'edit';
  await fetchPageData(activePage.value, editorLocale.value);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
  window.removeEventListener('beforeunload', handleBeforeUnload);
  // The public site shares this state; leave it read-only and clean.
  editMode.value = 'view';
  isDirty.value = false;
  activeSectionId.value = '';
  selectedBlockId.value = '';
  cancelPlacingBlock();
});
</script>
