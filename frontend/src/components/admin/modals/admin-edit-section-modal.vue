<template>
  <q-dialog
    :model-value="modelValue"
    transition-show="fade"
    transition-hide="fade"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @hide="confirmingDelete = false"
  >
    <div v-if="editingSection" class="admin-edit-modal">
      <transition name="admin-modal-step-fade" mode="out-in">
        <div
          v-if="!confirmingDelete"
          key="modal-settings-step"
          class="admin-edit-modal__step-content"
        >
          <div class="admin-edit-modal__header">
            <div class="admin-edit-modal__icon-badge">
              <q-icon :name="editingSection.icon" size="22px" />
            </div>
            <div>
              <h3 class="admin-edit-modal__title">แก้ไขและตั้งค่าหน้า</h3>
              <span class="admin-edit-modal__subtitle">ID: {{ editingSection.id }}</span>
            </div>
            <q-space />
            <q-btn v-close-popup icon="close" flat round dense color="grey-6" />
          </div>

          <div class="admin-edit-modal__body">
            <div class="admin-edit-form-group">
              <label class="admin-edit-form-label">ชื่อหน้า / ส่วนเนื้อหา</label>
              <q-input
                :model-value="editTitleInput"
                outlined
                dense
                placeholder="พิมพ์ชื่อส่วนงาน..."
                class="admin-edit-input"
                @update:model-value="onTitleInputChange"
              />
            </div>

            <div class="admin-edit-form-group">
              <label class="admin-edit-form-label">เลือกไอคอนสัญลักษณ์</label>
              <div class="admin-icon-picker-mini-grid">
                <div
                  v-for="iconName in availableIcons"
                  :key="iconName"
                  class="admin-icon-picker-mini-grid__item"
                  :class="{
                    'admin-icon-picker-mini-grid__item--selected': editingSection.icon === iconName,
                  }"
                  @click="selectSectionIcon(iconName)"
                >
                  <q-icon :name="iconName" size="20px" />
                </div>
              </div>
            </div>
          </div>

          <div class="admin-edit-modal__footer">
            <q-btn
              unelevated
              color="negative"
              label="ลบ"
              no-caps
              style="border-radius: 8px; font-weight: 600; padding: 6px 14px"
              @click="confirmingDelete = true"
            />
            <q-space />
            <q-btn
              v-close-popup
              unelevated
              color="positive"
              label="บันทึก"
              no-caps
              style="border-radius: 8px; font-weight: 700; padding: 6px 22px"
            />
          </div>
        </div>

        <div v-else key="modal-delete-step" class="admin-edit-modal__step-content">
          <div class="admin-edit-modal__header">
            <div class="admin-edit-modal__icon-badge" style="background: #dc2626; color: #fff">
              <q-icon name="warning" size="24px" />
            </div>
            <div>
              <h3 class="admin-edit-modal__title text-negative">ยืนยันการลบหน้า</h3>
              <span class="admin-edit-modal__subtitle">การลบนี้ไม่สามารถย้อนกลับได้</span>
            </div>
          </div>

          <div class="admin-edit-modal__body">
            <div class="admin-delete-alert-card">
              คุณต้องการลบหน้า
              <strong>"{{ editingSection.title }}"</strong> ออกจากเว็บไซต์ใช่หรือไม่?
            </div>
          </div>

          <div class="admin-edit-modal__footer">
            <q-btn
              unelevated
              color="grey-3"
              text-color="grey-9"
              label="ยกเลิก"
              no-caps
              style="border-radius: 8px; font-weight: 600"
              @click="confirmingDelete = false"
            />
            <q-space />
            <q-btn
              unelevated
              color="negative"
              label="ยืนยัน"
              no-caps
              style="border-radius: 8px; font-weight: 700; padding: 6px 20px"
              @click="executeDeletePage"
            />
          </div>
        </div>
      </transition>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useWebsiteEditor, type SectionNavItem } from '@/composables/use-website-editor';

const props = defineProps<{
  modelValue: boolean;
  editingSection: SectionNavItem | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'delete'): void;
}>();

const { updateSectionTitle, updateSectionIcon, removeSection, availableIcons } = useWebsiteEditor();

const editTitleInput = ref('');
const confirmingDelete = ref(false);

watch(
  () => props.editingSection,
  (newVal) => {
    if (newVal) {
      editTitleInput.value = newVal.title;
      confirmingDelete.value = false;
    }
  },
  { immediate: true },
);

function onTitleInputChange(newTitle: string | number | null): void {
  if (typeof newTitle === 'string') {
    editTitleInput.value = newTitle;
    if (props.editingSection && newTitle.trim()) {
      updateSectionTitle(props.editingSection.id, newTitle.trim());
    }
  }
}

function selectSectionIcon(iconName: string): void {
  if (props.editingSection) {
    updateSectionIcon(props.editingSection.id, iconName);
  }
}

function executeDeletePage(): void {
  if (props.editingSection) {
    removeSection(props.editingSection.id);
    emit('update:modelValue', false);
    confirmingDelete.value = false;
    emit('delete');
  }
}
</script>
