<template>
  <section
    id="preview-section-activityGallery"
    class="section activity-gallery admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'activityGallery')"
  >
    <div class="section-heading section-heading--centered">
      <h2
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (activityGalleryData.heading = val))"
      >
        {{ activityGalleryData.heading }}
      </h2>
      <span class="section-heading__line" />
    </div>

    <div class="activity-gallery__columns">
      <div
        v-for="(group, groupIndex) in activityGalleryData.groups"
        :key="groupIndex"
        class="activity-gallery__column"
      >
        <h3
          contenteditable="true"
          class="activity-gallery__column-title admin-inline-editable"
          @blur="(e) => onTextChange(e, (val) => (group.title = val))"
        >
          {{ group.title }}
        </h3>

        <q-carousel
          v-model="groupSlides[groupIndex]"
          class="activity-gallery__carousel"
          height="320px"
          arrows
          navigation
          swipeable
          animated
          infinite
          control-color="white"
        >
          <q-carousel-slide
            v-for="(photo, photoIndex) in group.photos"
            :key="photoIndex"
            :name="photoIndex"
            class="activity-gallery__slide"
          >
            <img
              :src="resolveAssetUrl(photo.src)"
              :alt="photo.alt"
              class="activity-gallery__image"
            />
          </q-carousel-slide>
        </q-carousel>

        <div class="admin-gallery-thumb-strip">
          <div
            v-for="(photo, photoIndex) in group.photos"
            :key="photoIndex"
            class="admin-gallery-thumb-item"
            :class="{ 'admin-gallery-thumb-item--active': groupSlides[groupIndex] === photoIndex }"
            @click.stop="groupSlides[groupIndex] = photoIndex"
          >
            <img :src="resolveAssetUrl(photo.src)" :alt="photo.alt" />
            <div class="admin-gallery-thumb-actions">
              <button
                class="admin-gallery-thumb-btn admin-gallery-thumb-btn--edit"
                title="เปลี่ยนรูปภาพนี้"
                @click.stop="triggerPhotoReplace(groupIndex, photoIndex)"
              >
                <q-icon name="edit" size="11px" />
              </button>
              <button
                class="admin-gallery-thumb-btn admin-gallery-thumb-btn--delete"
                title="ลบรูปภาพนี้"
                :disabled="group.photos.length <= 1"
                @click.stop="removeGalleryPhoto(groupIndex, photoIndex)"
              >
                <q-icon name="close" size="11px" />
              </button>
            </div>
          </div>

          <button
            class="admin-gallery-add-photo-thumb"
            title="อัปโหลดรูปภาพใหม่"
            @click.stop="triggerPhotoAdd(groupIndex)"
          >
            <q-icon name="photo_camera" size="18px" />
            <span>เพิ่มรูป</span>
          </button>
        </div>
      </div>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="onFileSelected"
    />

    <AdminImageCropper
      v-model="showCropDialog"
      :image-src="cropImageSrc"
      :recommended-width="400"
      :recommended-height="300"
      :block-label="
        uploadTarget?.mode === 'replace' ? 'เปลี่ยนรูปภาพกิจกรรม' : 'เพิ่มรูปภาพกิจกรรม'
      "
      @confirm="onCropConfirm"
      @cancel="onCropCancel"
    />

    <AdminSectionBlockLayer section-id="activityGallery" />
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import AdminImageCropper from '@/components/admin/modals/admin-image-cropper.vue';
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

const {
  activityGallery: activityGalleryData,
  addGalleryPhoto,
  removeGalleryPhoto,
  saveHistorySnapshot,
} = useWebsiteEditor();

const groupSlides = reactive<number[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);

type UploadTarget = {
  mode: 'add' | 'replace';
  groupIndex: number;
  photoIndex?: number;
};

const uploadTarget = ref<UploadTarget | null>(null);

const showCropDialog = ref<boolean>(false);
const cropImageSrc = ref<string>('');

watch(
  () => activityGalleryData.groups.length,
  (newLen) => {
    while (groupSlides.length < newLen) {
      groupSlides.push(0);
    }
    while (groupSlides.length > newLen) {
      groupSlides.pop();
    }
  },
  { immediate: true },
);

function triggerPhotoAdd(groupIndex: number): void {
  uploadTarget.value = { mode: 'add', groupIndex };
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
    fileInputRef.value.click();
  }
}

function triggerPhotoReplace(groupIndex: number, photoIndex: number): void {
  uploadTarget.value = { mode: 'replace', groupIndex, photoIndex };
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
    fileInputRef.value.click();
  }
}

function onFileSelected(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;

  const file = target.files[0];
  cropImageSrc.value = URL.createObjectURL(file);
  showCropDialog.value = true;
}

function onCropConfirm(croppedDataUrl: string): void {
  if (!uploadTarget.value) return;

  saveHistorySnapshot();
  const { mode, groupIndex, photoIndex } = uploadTarget.value;
  const group = activityGalleryData.groups[groupIndex];

  if (group) {
    if (mode === 'replace' && photoIndex !== undefined && group.photos[photoIndex]) {
      group.photos[photoIndex].src = croppedDataUrl;
      groupSlides[groupIndex] = photoIndex;
    } else if (mode === 'add') {
      addGalleryPhoto(groupIndex, croppedDataUrl, 'ภาพกิจกรรมใหม่');
      groupSlides[groupIndex] = group.photos.length - 1;
    }
  }

  showCropDialog.value = false;
  cropImageSrc.value = '';
  uploadTarget.value = null;
}

function onCropCancel(): void {
  showCropDialog.value = false;
  cropImageSrc.value = '';
  uploadTarget.value = null;
}
</script>
