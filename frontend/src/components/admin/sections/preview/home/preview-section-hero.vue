<template>
  <section
    id="preview-section-hero"
    class="hero admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'hero')"
  >
    <div class="hero__image-frame">
      <div class="hero__image-inner admin-image-hover-trigger" data-image-key="hero.image">
        <img :src="heroData.image" :alt="heroData.imageAlt" />
        <div class="admin-image-hover-overlay">
          <q-icon name="photo_camera" size="32px" />
          <span>คลิกปรับแต่งรูป Hero</span>
        </div>
      </div>
    </div>
    <div class="hero__copy">
      <h1>
        <span
          contenteditable="true"
          class="admin-inline-editable"
          @blur="(e) => onTextChange(e, (val) => (heroData.titleHighlight = val))"
          >{{ heroData.titleHighlight }}</span
        >
        <span
          contenteditable="true"
          class="admin-inline-editable"
          @blur="(e) => onTextChange(e, (val) => (heroData.titleRest = val))"
          >{{ heroData.titleRest }}</span
        >
      </h1>
      <p
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (heroData.paragraph = val))"
      >
        {{ heroData.paragraph }}
      </p>
      <ul class="hero__skills">
        <li
          v-for="(skill, index) in heroData.skills"
          :key="index"
          contenteditable="true"
          class="admin-inline-editable"
          @blur="(e) => onTextChange(e, (val) => (heroData.skills[index] = val))"
        >
          {{ skill }}
        </li>
      </ul>
      <p class="hero__booking-note">
        <span
          contenteditable="true"
          class="admin-inline-editable"
          @blur="(e) => onTextChange(e, (val) => (heroData.bookingNote = val))"
          >{{ heroData.bookingNote }}</span
        >
        <a href="javascript:void(0)">@botbuilderthailand</a>
      </p>
      <div class="hero__actions">
        <AppButton class="app-button--stacked">
          <span
            contenteditable="true"
            class="admin-inline-editable"
            @blur="(e) => onTextChange(e, (val) => (heroData.ctaLabel = val))"
            >{{ heroData.ctaLabel }}</span
          >
          <span
            contenteditable="true"
            class="admin-inline-editable"
            @blur="(e) => onTextChange(e, (val) => (heroData.ctaBangsaen = val))"
            >{{ heroData.ctaBangsaen }}</span
          >
        </AppButton>
        <AppButton variant="outline" class="app-button--stacked">
          <span
            contenteditable="true"
            class="admin-inline-editable"
            @blur="(e) => onTextChange(e, (val) => (heroData.ctaLabel = val))"
            >{{ heroData.ctaLabel }}</span
          >
          <span
            contenteditable="true"
            class="admin-inline-editable"
            @blur="(e) => onTextChange(e, (val) => (heroData.ctaSriracha = val))"
            >{{ heroData.ctaSriracha }}</span
          >
        </AppButton>
      </div>
    </div>

    <AdminSectionBlockLayer section-id="hero" />
  </section>
</template>

<script setup lang="ts">
import AppButton from '@/components/landing/AppButton.vue';
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { onTextChange } from '@/utils/admin-helpers';

defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();

const { hero: heroData } = useWebsiteEditor();
</script>
