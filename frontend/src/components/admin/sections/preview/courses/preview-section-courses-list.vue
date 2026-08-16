<template>
  <section
    id="preview-section-courses-list"
    class="section admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'coursesList')"
  >
    <div class="courses-grid">
      <article v-for="(course, cIdx) in coursesPageData.items" :key="cIdx" class="course-card">
        <div
          class="course-card__image-wrap admin-image-hover-trigger"
          data-image-key="coursesPage.item"
          :data-course-index="cIdx"
        >
          <img
            :src="resolveAssetUrl(course.image)"
            :alt="course.title"
            class="course-card__image"
          />
          <span
            v-if="course.badge"
            contenteditable="true"
            class="course-card__badge admin-inline-editable"
            @blur="(e) => onTextChange(e, (val) => (course.badge = val))"
          >
            {{ course.badge }}
          </span>
          <div class="admin-image-hover-overlay">
            <q-icon name="photo_camera" size="24px" />
            <span>คลิกเพื่อเปลี่ยนรูปภาพ</span>
          </div>
        </div>
        <div class="course-card__content">
          <h3
            contenteditable="true"
            class="admin-inline-editable"
            @blur="(e) => onTextChange(e, (val) => (course.title = val))"
          >
            {{ course.title }}
          </h3>
          <div v-if="Array.isArray(course.description)">
            <p
              v-for="(line, lIdx) in course.description"
              :key="lIdx"
              contenteditable="true"
              class="admin-inline-editable"
              @blur="(e) => onTextChange(e, (val) => (course.description[lIdx] = val))"
            >
              {{ line }}
            </p>
          </div>
          <p
            v-else
            contenteditable="true"
            class="admin-inline-editable"
            @blur="(e) => onTextChange(e, (val) => (course.description = [val]))"
          >
            {{ course.description }}
          </p>
          <AppButton variant="red">
            <span
              contenteditable="true"
              class="admin-inline-editable"
              @blur="(e) => onTextChange(e, (val) => (coursesPageData.buttonText = val))"
            >
              {{ coursesPageData.buttonText || 'ดูรายละเอียดเพิ่มเติม' }}
            </span>
          </AppButton>
        </div>
      </article>
    </div>
    <AdminSectionBlockLayer section-id="coursesList" />
  </section>
</template>

<script setup lang="ts">
import AppButton from '@/components/landing/AppButton.vue';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { onTextChange } from '@/utils/admin-helpers';
import { resolveAssetUrl } from '@/utils/asset-helper';

defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();

const { coursesPage: coursesPageData } = useWebsiteEditor();
</script>
