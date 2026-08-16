<template>
  <q-form class="admin-editor-form">
    <div class="admin-field-group">
      <label class="admin-label">หัวข้อหลัก (Heading)</label>
      <q-input v-model="activityGallery.heading" outlined dense class="admin-input" />
    </div>

    <div class="admin-gallery-editor-header row items-center justify-between q-mb-md">
      <span class="text-subtitle2 text-weight-bold text-grey-8">รายการกลุ่มกิจกรรม</span>
      <q-btn
        unelevated
        dense
        color="positive"
        icon="add_circle"
        label="เพิ่มกลุ่มกิจกรรมใหม่"
        class="admin-add-btn"
        @click="onAddGroup"
      />
    </div>

    <q-card
      v-for="(group, groupIndex) in activityGallery.groups"
      :key="groupIndex"
      flat
      bordered
      class="admin-card-editor q-mb-md"
    >
      <div class="admin-card-editor__header row items-center justify-between">
        <span class="admin-card-editor__title text-weight-bold">
          กลุ่มที่ {{ groupIndex + 1 }}: {{ group.title }}
        </span>

        <div class="row items-center q-gutter-xs">
          <q-btn
            flat
            round
            dense
            size="sm"
            icon="arrow_upward"
            :disabled="groupIndex === 0"
            @click="moveActivityGroup(groupIndex, groupIndex - 1)"
          >
            <q-tooltip>ย้ายขึ้น</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            size="sm"
            icon="arrow_downward"
            :disabled="groupIndex === activityGallery.groups.length - 1"
            @click="moveActivityGroup(groupIndex, groupIndex + 1)"
          >
            <q-tooltip>ย้ายลง</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            size="sm"
            color="negative"
            icon="delete"
            :disabled="activityGallery.groups.length <= 1"
            @click="removeActivityGroup(groupIndex)"
          >
            <q-tooltip>ลบกลุ่มนี้</q-tooltip>
          </q-btn>
        </div>
      </div>

      <q-card-section class="q-pa-md">
        <div class="admin-field-group">
          <label class="admin-label">ชื่อกลุ่มกิจกรรม</label>
          <q-input v-model="group.title" outlined dense class="admin-input" />
        </div>

        <div class="admin-field-group q-mt-md">
          <div class="row items-center justify-between q-mb-xs">
            <label class="admin-label">รูปภาพในกลุ่มนี้ ({{ group.photos.length }} รูป)</label>
            <q-btn
              flat
              dense
              size="sm"
              color="positive"
              icon="add_a_photo"
              label="เพิ่มรูป"
              @click="onAddPhoto(groupIndex)"
            />
          </div>

          <div
            v-for="(photo, photoIndex) in group.photos"
            :key="photoIndex"
            class="admin-repeatable-row admin-repeatable-row--image items-center q-mb-sm"
          >
            <div class="column items-center q-mr-xs">
              <q-btn
                flat
                round
                dense
                size="xs"
                icon="keyboard_arrow_up"
                :disabled="photoIndex === 0"
                @click="moveGalleryPhoto(groupIndex, photoIndex, photoIndex - 1)"
              />
              <q-btn
                flat
                round
                dense
                size="xs"
                icon="keyboard_arrow_down"
                :disabled="photoIndex === group.photos.length - 1"
                @click="moveGalleryPhoto(groupIndex, photoIndex, photoIndex + 1)"
              />
            </div>

            <img :src="resolveAssetUrl(photo.src)" :alt="photo.alt" class="admin-thumbnail" />

            <q-input
              v-model="photo.alt"
              outlined
              dense
              placeholder="Alt Text (คำอธิบายรูป)"
              class="admin-input col"
            />

            <q-file
              :model-value="null"
              outlined
              dense
              accept="image/*"
              label="เปลี่ยน"
              class="admin-file-compact"
              @update:model-value="(file) => onPhotoUpload(file, groupIndex, photoIndex)"
            />

            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              :disabled="group.photos.length <= 1"
              @click="removeGalleryPhoto(groupIndex, photoIndex)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup lang="ts">
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { resolveAssetUrl } from '@/utils/asset-helper';
import { uploadImageFile } from '@/utils/upload-helper';

const {
  activityGallery,
  addActivityGroup,
  removeActivityGroup,
  moveActivityGroup,
  addGalleryPhoto,
  removeGalleryPhoto,
  moveGalleryPhoto,
} = useWebsiteEditor();

function onAddGroup(): void {
  addActivityGroup();
}

function onAddPhoto(groupIndex: number): void {
  addGalleryPhoto(groupIndex);
}

async function onPhotoUpload(
  file: File | null,
  groupIndex: number,
  photoIndex: number,
): Promise<void> {
  if (!file) return;
  const group = activityGallery.groups[groupIndex];
  if (group) {
    const photo = group.photos[photoIndex];
    if (photo) {
      try {
        const uploadedUrl = await uploadImageFile(file);
        photo.src = uploadedUrl;
      } catch {
        photo.src = URL.createObjectURL(file);
      }
    }
  }
}
</script>
