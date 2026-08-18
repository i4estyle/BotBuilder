<template>
  <section
    id="preview-section-promotions-list"
    class="admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'promotionsList')"
  >
    <div class="promotion-list">
      <h2
        data-style-key="promotionsPage.listHeading"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('promotionsPage.listHeading')"
        @blur="(e) => onTextChange(e, (val) => (promotionsPageData.listHeading = val))"
      >
        {{ promotionsPageData.listHeading }}
      </h2>
    </div>

    <div
      v-for="(promo, pIdx) in promotionsPageData.items"
      :key="pIdx"
      class="promotion-course"
      :class="{ 'promotion-course--alt': pIdx % 2 === 1 }"
    >
      <div class="promotion-course__inner">
        <div
          class="promotion-course__image admin-image-hover-trigger"
          data-image-key="promotionsPage.item"
          :data-style-key="`promotionsPage.items.${pIdx}.image`"
          :data-promo-index="pIdx"
          :style="getStyleOverride(`promotionsPage.items.${pIdx}.image`)"
        >
          <img :src="resolveAssetUrl(promo.image)" :alt="promo.title" />
          <div class="admin-image-hover-overlay">
            <q-icon name="photo_camera" size="28px" />
            <span>เปลี่ยนรูป</span>
          </div>
        </div>
        <div class="promotion-course__content">
          <div>
            <span
              :data-style-key="`promotionsPage.items.${pIdx}.label`"
              contenteditable="true"
              class="admin-inline-editable"
              :style="getStyleOverride(`promotionsPage.items.${pIdx}.label`)"
              @blur="(e) => onTextChange(e, (val) => (promo.label = val))"
            >
              {{ promo.label }}
            </span>
          </div>
          <h3
            :data-style-key="`promotionsPage.items.${pIdx}.title`"
            contenteditable="true"
            class="admin-inline-editable"
            :style="getStyleOverride(`promotionsPage.items.${pIdx}.title`)"
            @blur="(e) => onTextChange(e, (val) => (promo.title = val))"
          >
            {{ promo.title }}
          </h3>
          <p
            v-for="(line, lIdx) in promo.description"
            :key="lIdx"
            :data-style-key="`promotionsPage.items.${pIdx}.description.${lIdx}`"
            contenteditable="true"
            class="admin-inline-editable"
            :style="getStyleOverride(`promotionsPage.items.${pIdx}.description.${lIdx}`)"
            @blur="(e) => onTextChange(e, (val) => (promo.description[lIdx] = val))"
          >
            {{ line }}
          </p>
          <ul v-if="promo.details" class="promotion-course__details">
            <li
              v-for="(det, dIdx) in promo.details"
              :key="dIdx"
              :data-style-key="`promotionsPage.items.${pIdx}.details.${dIdx}`"
              contenteditable="true"
              class="admin-inline-editable"
              :style="getStyleOverride(`promotionsPage.items.${pIdx}.details.${dIdx}`)"
              @blur="(e) => onTextChange(e, (val) => (promo.details![dIdx] = val))"
            >
              {{ det }}
            </li>
          </ul>
          <p
            v-if="promo.price"
            :data-style-key="`promotionsPage.items.${pIdx}.price`"
            contenteditable="true"
            class="promotion-course__price admin-inline-editable"
            :style="getStyleOverride(`promotionsPage.items.${pIdx}.price`)"
            @blur="(e) => onTextChange(e, (val) => (promo.price = val))"
          >
            {{ promo.price }}
          </p>
          <p
            v-if="promo.note"
            :data-style-key="`promotionsPage.items.${pIdx}.note`"
            contenteditable="true"
            class="promotion-course__note admin-inline-editable"
            :style="getStyleOverride(`promotionsPage.items.${pIdx}.note`)"
            @blur="(e) => onTextChange(e, (val) => (promo.note = val))"
          >
            {{ promo.note }}
          </p>
        </div>
      </div>
    </div>
    <AdminSectionBlockLayer section-id="promotionsList" />
  </section>
</template>

<script setup lang="ts">
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

const { promotionsPage: promotionsPageData, getStyleOverride } = useWebsiteEditor();
</script>
