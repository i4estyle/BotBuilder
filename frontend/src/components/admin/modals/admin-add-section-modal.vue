<template>
  <q-dialog
    :model-value="modelValue"
    transition-show="fade"
    transition-hide="fade"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @show="onShow"
  >
    <div class="admin-edit-modal admin-add-section-modal">
      <div class="admin-edit-modal__header">
        <div class="admin-edit-modal__icon-badge">
          <q-icon name="add_box" size="22px" />
        </div>
        <div>
          <h3 class="admin-edit-modal__title">เพิ่ม Section ใหม่</h3>
          <span class="admin-edit-modal__subtitle"
            >เลือกรูปแบบ แล้วแก้ไขเนื้อหาบนหน้าตัวอย่างได้ทันที</span
          >
        </div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense color="grey-6" aria-label="ปิด" />
      </div>

      <div class="admin-edit-modal__body">
        <div class="admin-edit-form-group">
          <label class="admin-edit-form-label">รูปแบบ Section</label>
          <div class="admin-add-section-modal__templates" role="radiogroup">
            <button
              v-for="template in templates"
              :key="template.layout"
              type="button"
              role="radio"
              :aria-checked="selectedLayout === template.layout"
              class="admin-add-section-modal__template"
              :class="{
                'admin-add-section-modal__template--selected': selectedLayout === template.layout,
              }"
              @click="selectedLayout = template.layout"
              @dblclick="confirmAdd"
            >
              <q-icon :name="template.icon" size="26px" />
              <strong>{{ template.label }}</strong>
              <span>{{ template.description }}</span>
            </button>
          </div>
        </div>

        <div class="admin-edit-form-group">
          <label class="admin-edit-form-label">ตำแหน่ง</label>
          <q-select
            v-model="afterSectionId"
            :options="positionOptions"
            emit-value
            map-options
            outlined
            dense
            class="admin-edit-input"
          />
        </div>

        <p class="admin-add-section-modal__note">
          <q-icon name="info" size="14px" />
          Section ที่เพิ่มจะอยู่ในหน้า "{{ pageTitle }}" ภาษา{{
            editorLocale === 'en-US' ? 'อังกฤษ' : 'ไทย'
          }}เท่านั้น และจะแสดงบนเว็บไซต์จริงหลังกด "บันทึกทั้งหมด"
        </p>
      </div>

      <div class="admin-edit-modal__footer">
        <q-btn
          v-close-popup
          unelevated
          color="grey-3"
          text-color="grey-9"
          label="ยกเลิก"
          no-caps
          style="border-radius: 8px; font-weight: 600"
        />
        <q-space />
        <q-btn
          unelevated
          color="positive"
          icon="add"
          label="เพิ่ม Section"
          no-caps
          style="border-radius: 8px; font-weight: 700; padding: 6px 20px"
          @click="confirmAdd"
        />
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  useWebsiteEditor,
  CUSTOM_SECTION_TEMPLATES,
  type CustomSectionLayout,
} from '@/composables/use-website-editor';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const { navSections, activeSectionId, activePage, editorLocale, addCustomSection } =
  useWebsiteEditor();

const PAGE_TITLES: Record<string, string> = {
  home: 'หน้าหลัก',
  promotions: 'โปรโมชั่น',
  courses: 'คอร์สเรียน',
  resources: 'คลังความรู้',
  about: 'เกี่ยวกับเรา',
};

const templates = CUSTOM_SECTION_TEMPLATES;
const selectedLayout = ref<CustomSectionLayout>('text');
const afterSectionId = ref<string>('');

const pageTitle = computed(() => PAGE_TITLES[activePage.value] || activePage.value);

const positionOptions = computed(() =>
  navSections
    .filter((section) => section.id !== 'footer')
    .map((section) => ({
      label: `ต่อจาก: ${section.title}${section.hidden ? ' (ซ่อนอยู่)' : ''}`,
      value: section.id,
    })),
);

function defaultAfterSectionId(): string {
  const active = navSections.find((s) => s.id === activeSectionId.value);
  if (active && active.id !== 'footer') return active.id;
  const footerIndex = navSections.findIndex((s) => s.id === 'footer');
  const beforeFooter = navSections[(footerIndex < 0 ? navSections.length : footerIndex) - 1];
  return beforeFooter?.id || '';
}

function onShow(): void {
  selectedLayout.value = 'text';
  afterSectionId.value = defaultAfterSectionId();
}

function confirmAdd(): void {
  addCustomSection(selectedLayout.value, afterSectionId.value || undefined);
  emit('update:modelValue', false);
}
</script>
