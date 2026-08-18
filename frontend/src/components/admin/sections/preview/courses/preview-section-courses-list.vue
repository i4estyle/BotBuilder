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
          :data-style-key="`coursesPage.items.${cIdx}.image`"
          :data-course-index="cIdx"
          :style="getStyleOverride(`coursesPage.items.${cIdx}.image`)"
        >
          <img
            :src="resolveAssetUrl(course.image)"
            :alt="course.title"
            class="course-card__image"
          />
          <span
            v-if="course.badge"
            :data-style-key="`coursesPage.items.${cIdx}.badge`"
            contenteditable="true"
            class="course-card__badge admin-inline-editable"
            :style="getStyleOverride(`coursesPage.items.${cIdx}.badge`)"
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
            :data-style-key="`coursesPage.items.${cIdx}.title`"
            contenteditable="true"
            class="admin-inline-editable"
            :style="getStyleOverride(`coursesPage.items.${cIdx}.title`)"
            @blur="(e) => onTextChange(e, (val) => (course.title = val))"
          >
            {{ course.title }}
          </h3>
          <div v-if="Array.isArray(course.description)">
            <p
              v-for="(line, lIdx) in course.description"
              :key="lIdx"
              :data-style-key="`coursesPage.items.${cIdx}.description.${lIdx}`"
              contenteditable="true"
              class="admin-inline-editable"
              :style="getStyleOverride(`coursesPage.items.${cIdx}.description.${lIdx}`)"
              @blur="(e) => onTextChange(e, (val) => (course.description[lIdx] = val))"
            >
              {{ line }}
            </p>
          </div>
          <p
            v-else
            :data-style-key="`coursesPage.items.${cIdx}.description`"
            contenteditable="true"
            class="admin-inline-editable"
            :style="getStyleOverride(`coursesPage.items.${cIdx}.description`)"
            @blur="(e) => onTextChange(e, (val) => (course.description = [val]))"
          >
            {{ course.description }}
          </p>
          <AppButton variant="red">
            <span
              data-style-key="coursesPage.buttonText"
              contenteditable="true"
              class="admin-inline-editable"
              :style="getStyleOverride('coursesPage.buttonText')"
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

const { coursesPage: coursesPageData, getStyleOverride } = useWebsiteEditor();
</script>
