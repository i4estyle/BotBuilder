<template>
  <q-page class="admin-page">
    <AdminEditorToolbar />

    <AdminEditSectionModal
      v-model="showEditSectionModal"
      :editing-section="editingSection"
      @delete="editingSection = null"
    />

    <AdminQuizModal v-model="showQuizModal" />

    <div class="admin-page__workspace">
      <AdminSidebarNav @open-quiz="openQuizModal" @open-edit-section="openEditSectionModal" />

      <section class="admin-page__preview-pane">
        <AdminPreviewFrame />
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import AdminEditorToolbar from '@/components/admin/layout/admin-editor-toolbar.vue';
import AdminSidebarNav from '@/components/admin/layout/admin-sidebar-nav.vue';
import AdminPreviewFrame from '@/components/admin/layout/admin-preview-frame.vue';
import AdminEditSectionModal from '@/components/admin/modals/admin-edit-section-modal.vue';
import AdminQuizModal from '@/components/admin/modals/admin-quiz-modal.vue';
import { useWebsiteEditor, type SectionNavItem } from '@/composables/use-website-editor';

const { ghostBlockType, cancelPlacingBlock } = useWebsiteEditor();

const showEditSectionModal = ref(false);
const editingSection = ref<SectionNavItem | null>(null);
const showQuizModal = ref(false);

function openEditSectionModal(item: SectionNavItem): void {
  editingSection.value = item;
  showEditSectionModal.value = true;
}

function openQuizModal(): void {
  showEditSectionModal.value = false;
  showQuizModal.value = true;
}

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ghostBlockType.value) {
      cancelPlacingBlock();
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ghostBlockType.value) {
      cancelPlacingBlock();
    }
  });
});
</script>
