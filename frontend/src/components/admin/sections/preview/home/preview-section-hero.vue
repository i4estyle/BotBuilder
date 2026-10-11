<template>
  <section
    id="preview-section-hero"
    class="hero admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'hero')"
  >
    <div class="hero__copy">
      <p class="hero__kicker">Robotics Design Studio for Kids</p>
      <h1>
        <span
          data-style-key="hero.titleHighlight"
          contenteditable="true"
          class="admin-inline-editable"
          :style="getStyleOverride('hero.titleHighlight')"
          @blur="(e) => onTextChange(e, (val) => (heroData.titleHighlight = val))"
          >{{ heroData.titleHighlight }}</span
        >
        <span
          data-style-key="hero.titleRest"
          contenteditable="true"
          class="admin-inline-editable"
          :style="getStyleOverride('hero.titleRest')"
          @blur="(e) => onTextChange(e, (val) => (heroData.titleRest = val))"
          >{{ heroData.titleRest }}</span
        >
      </h1>
      <p
        data-style-key="hero.paragraph"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('hero.paragraph')"
        @blur="(e) => onTextChange(e, (val) => (heroData.paragraph = val))"
      >
        {{ heroData.paragraph }}
      </p>
      <div class="hero__actions">
        <AppButton class="app-button--stacked">
          <span
            data-style-key="hero.ctaLabel"
            contenteditable="true"
            class="admin-inline-editable"
            :style="getStyleOverride('hero.ctaLabel')"
            @blur="(e) => onTextChange(e, (val) => (heroData.ctaLabel = val))"
            >{{ heroData.ctaLabel }}</span
          >
          <span
            data-style-key="hero.ctaBangsaen"
            contenteditable="true"
            class="admin-inline-editable"
            :style="getStyleOverride('hero.ctaBangsaen')"
            @blur="(e) => onTextChange(e, (val) => (heroData.ctaBangsaen = val))"
            >{{ heroData.ctaBangsaen }}</span
          >
        </AppButton>
        <AppButton variant="outline" class="app-button--stacked">
          <span
            data-style-key="hero.ctaLabel"
            contenteditable="true"
            class="admin-inline-editable"
            :style="getStyleOverride('hero.ctaLabel')"
            @blur="(e) => onTextChange(e, (val) => (heroData.ctaLabel = val))"
            >{{ heroData.ctaLabel }}</span
          >
          <span
            data-style-key="hero.ctaSriracha"
            contenteditable="true"
            class="admin-inline-editable"
            :style="getStyleOverride('hero.ctaSriracha')"
            @blur="(e) => onTextChange(e, (val) => (heroData.ctaSriracha = val))"
            >{{ heroData.ctaSriracha }}</span
          >
        </AppButton>
      </div>
    </div>

    <div class="hero__image-frame">
      <div
        class="hero__image-inner admin-image-hover-trigger"
        data-image-key="hero.image"
        data-style-key="hero.image"
        :style="getStyleOverride('hero.image')"
      >
        <img :src="resolveAssetUrl(heroData.image)" :alt="heroData.imageAlt" />
        <p class="hero__image-caption">พื้นที่ให้เด็กได้สร้าง ทดลอง และแก้ปัญหาด้วยตัวเอง</p>
        <div class="admin-image-hover-overlay">
          <q-icon name="photo_camera" size="32px" />
          <span>คลิกปรับแต่งรูป Hero</span>
        </div>
      </div>
    </div>

    <AdminSectionBlockLayer section-id="hero" />
  </section>

  <div class="hero__brandline" aria-label="BotBuilder highlights">
    <div class="hero__brandline-grid">
      <div><strong>Hands-on Learning</strong><span>สร้าง ทดลอง และเรียนรู้จากของจริง</span></div>
      <div><strong>Age 3–16</strong><span>เส้นทางการเรียนรู้ตามวัยและทักษะ</span></div>
      <div><strong>Build + Code</strong><span>เชื่อมการสร้าง กลไก และการเขียนโปรแกรม</span></div>
      <div><strong>Think + Explain</strong><span>ฝึกคิด แก้ปัญหา และอธิบายสิ่งที่ทำ</span></div>
    </div>
  </div>
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

const { hero: heroData, getStyleOverride } = useWebsiteEditor();
</script>
