<template>
  <q-dialog
    :model-value="modelValue"
    transition-show="fade"
    transition-hide="fade"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @show="onShow"
    @hide="confirmingDelete = false"
  >
    <div v-if="navItem" class="admin-edit-modal">
      <transition name="admin-modal-step-fade" mode="out-in">
        <div
          v-if="!confirmingDelete"
          key="modal-settings-step"
          class="admin-edit-modal__step-content"
        >
          <div class="admin-edit-modal__header">
            <div class="admin-edit-modal__icon-badge">
              <q-icon :name="navItem.icon" size="22px" />
            </div>
            <div>
              <h3 class="admin-edit-modal__title">ตั้งค่า Section</h3>
              <span class="admin-edit-modal__subtitle">
                {{ customBlock ? 'Section ที่สร้างเอง' : 'Section มาตรฐานของเว็บไซต์' }}
              </span>
            </div>
            <q-space />
            <q-btn v-close-popup icon="close" flat round dense color="grey-6" aria-label="ปิด" />
          </div>

          <div class="admin-edit-modal__body">
            <div class="admin-edit-form-group">
              <label class="admin-edit-form-label">
                {{ customBlock ? 'หัวข้อ Section' : 'ชื่อที่แสดงในแถบโครงสร้าง' }}
              </label>
              <q-input
                :model-value="navItem.title"
                outlined
                dense
                maxlength="100"
                placeholder="พิมพ์ชื่อ..."
                class="admin-edit-input"
                @update:model-value="onTitleInputChange"
              />
            </div>

            <template v-if="customBlock">
              <div class="admin-edit-form-group">
                <label class="admin-edit-form-label">พื้นหลัง</label>
                <q-btn-toggle
                  :model-value="customBlock.background || 'white'"
                  :options="backgroundOptions"
                  no-caps
                  unelevated
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-9"
                  class="admin-edit-toggle"
                  @update:model-value="(v) => (customBlock!.background = v)"
                />
              </div>

              <div v-if="customBlock.type === 'imageText'" class="admin-edit-form-group">
                <label class="admin-edit-form-label">ตำแหน่งรูปภาพ</label>
                <q-btn-toggle
                  :model-value="customBlock.imagePosition || 'left'"
                  :options="[
                    { label: 'รูปซ้าย', value: 'left', icon: 'align_horizontal_left' },
                    { label: 'รูปขวา', value: 'right', icon: 'align_horizontal_right' },
                  ]"
                  no-caps
                  unelevated
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-9"
                  class="admin-edit-toggle"
                  @update:model-value="(v) => (customBlock!.imagePosition = v)"
                />
              </div>

              <template v-if="customBlock.type === 'cta'">
                <div class="admin-edit-form-group">
                  <label class="admin-edit-form-label">ข้อความบนปุ่ม</label>
                  <q-input
                    v-model="customBlock.buttonLabel"
                    outlined
                    dense
                    maxlength="60"
                    class="admin-edit-input"
                  />
                </div>
                <div class="admin-edit-form-group">
                  <label class="admin-edit-form-label">ลิงก์ของปุ่ม</label>
                  <q-input
                    v-model="customBlock.buttonUrl"
                    outlined
                    dense
                    placeholder="https://..."
                    class="admin-edit-input"
                    :error="!!customBlock.buttonUrl && !buttonUrlValid"
                    error-message="ลิงก์ไม่ถูกต้อง รองรับ https://, mailto:, tel: หรือ /หน้าในเว็บ"
                  />
                </div>
              </template>
            </template>

            <div class="admin-edit-form-group">
              <label class="admin-edit-form-label">ไอคอนในแถบโครงสร้าง</label>
              <div class="admin-icon-picker-mini-grid">
                <div
                  v-for="iconName in availableIcons"
                  :key="iconName"
                  class="admin-icon-picker-mini-grid__item"
                  :class="{
                    'admin-icon-picker-mini-grid__item--selected': navItem.icon === iconName,
                  }"
                  @click="navItem.icon = iconName"
                >
                  <q-icon :name="iconName" size="20px" />
                </div>
              </div>
            </div>

            <div v-if="!isLocked" class="admin-edit-form-group">
              <q-toggle
                :model-value="!navItem.hidden"
                label="แสดง Section นี้บนเว็บไซต์"
                color="positive"
                @update:model-value="toggleHidden"
              />
            </div>
          </div>

          <div class="admin-edit-modal__footer">
            <template v-if="customBlock">
              <q-btn
                unelevated
                color="negative"
                icon="delete"
                label="ลบ"
                no-caps
                style="border-radius: 8px; font-weight: 600; padding: 6px 14px"
                @click="confirmingDelete = true"
              />
              <q-btn
                flat
                color="grey-8"
                icon="content_copy"
                label="ทำสำเนา"
                no-caps
                style="border-radius: 8px; font-weight: 600"
                @click="duplicate"
              />
            </template>
            <q-space />
            <q-btn
              v-close-popup
              unelevated
              color="positive"
              label="เสร็จสิ้น"
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
              <h3 class="admin-edit-modal__title text-negative">ยืนยันการลบ Section</h3>
              <span class="admin-edit-modal__subtitle"> กด "ย้อนกลับ" (Ctrl+Z) ได้ก่อนบันทึก </span>
            </div>
          </div>

          <div class="admin-edit-modal__body">
            <div class="admin-delete-alert-card">
              คุณต้องการลบ Section
              <strong>"{{ navItem.title }}"</strong> ออกจากหน้านี้ใช่หรือไม่?
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
              label="ลบ Section"
              no-caps
              style="border-radius: 8px; font-weight: 700; padding: 6px 20px"
              @click="executeDelete"
            />
          </div>
        </div>
      </transition>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  useWebsiteEditor,
  sanitizeButtonUrl,
  type CustomSectionBackground,
  type SectionNavItem,
} from '@/composables/use-website-editor';

const props = defineProps<{
  modelValue: boolean;
  editingSection: SectionNavItem | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'delete'): void;
}>();

const {
  navSections,
  customBlocks,
  removeSection,
  duplicateCustomSection,
  toggleSectionHidden,
  saveHistorySnapshot,
  lockedSectionIds,
  availableIcons,
} = useWebsiteEditor();

const confirmingDelete = ref(false);

const backgroundOptions: Array<{ label: string; value: CustomSectionBackground }> = [
  { label: 'ขาว', value: 'white' },
  { label: 'เทาอ่อน', value: 'soft' },
  { label: 'สีหลัก', value: 'brand' },
];

// Always edit the live reactive entries, not the snapshot passed in by the sidebar.
const navItem = computed(() => navSections.find((s) => s.id === props.editingSection?.id));
const customBlock = computed(() =>
  navItem.value?.isCustomPage ? customBlocks.find((b) => b.id === navItem.value?.id) : undefined,
);
const isLocked = computed(() => !!navItem.value && lockedSectionIds.has(navItem.value.id));
const buttonUrlValid = computed(() => !!sanitizeButtonUrl(customBlock.value?.buttonUrl));

function onShow(): void {
  confirmingDelete.value = false;
  // One undo step covers everything changed while the dialog is open.
  saveHistorySnapshot();
}

function onTitleInputChange(newTitle: string | number | null): void {
  if (typeof newTitle !== 'string' || !navItem.value) return;
  const title = newTitle.trim();
  if (!title) return;
  navItem.value.title = title;
  if (customBlock.value) customBlock.value.title = title;
}

function toggleHidden(): void {
  if (navItem.value) toggleSectionHidden(navItem.value.id);
}

function duplicate(): void {
  if (!navItem.value) return;
  duplicateCustomSection(navItem.value.id);
  emit('update:modelValue', false);
}

function executeDelete(): void {
  if (!navItem.value) return;
  removeSection(navItem.value.id);
  emit('update:modelValue', false);
  confirmingDelete.value = false;
  emit('delete');
}
</script>
