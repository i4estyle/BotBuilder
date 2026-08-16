<template>
  <footer
    id="preview-section-footer"
    class="site-footer admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'footer')"
  >
    <div>
      <h2
        data-style-key="footer.brandTitle"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('footer.brandTitle')"
        @blur="(e) => onTextChange(e, (val) => (footerData.brandTitle = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.brandTitle = val))"
      >
        {{ footerData.brandTitle }}
      </h2>
      <p
        data-style-key="footer.brandText"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('footer.brandText')"
        @blur="(e) => onTextChange(e, (val) => (footerData.brandText = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.brandText = val))"
      >
        {{ footerData.brandText }}
      </p>
    </div>
    <div>
      <h3
        data-style-key="footer.quickLinks"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('footer.quickLinks')"
        @blur="(e) => onTextChange(e, (val) => (footerData.quickLinks = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.quickLinks = val))"
      >
        {{ footerData.quickLinks }}
      </h3>
      <a
        href="javascript:void(0)"
        data-style-key="footer.courses"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('footer.courses')"
        @blur="(e) => onTextChange(e, (val) => (footerData.courses = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.courses = val))"
        >{{ footerData.courses }}</a
      >
      <a
        href="javascript:void(0)"
        data-style-key="footer.aboutUs"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('footer.aboutUs')"
        @blur="(e) => onTextChange(e, (val) => (footerData.aboutUs = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.aboutUs = val))"
        >{{ footerData.aboutUs }}</a
      >
      <a
        href="javascript:void(0)"
        data-style-key="footer.resources"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('footer.resources')"
        @blur="(e) => onTextChange(e, (val) => (footerData.resources = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.resources = val))"
        >{{ footerData.resources }}</a
      >
    </div>
    <div>
      <h3
        data-style-key="footer.support"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('footer.support')"
        @blur="(e) => onTextChange(e, (val) => (footerData.support = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.support = val))"
      >
        {{ footerData.support }}
      </h3>
      <a
        href="javascript:void(0)"
        data-style-key="footer.promotion"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('footer.promotion')"
        @blur="(e) => onTextChange(e, (val) => (footerData.promotion = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.promotion = val))"
        >{{ footerData.promotion }}</a
      >
      <a href="javascript:void(0)">Contact us</a>
    </div>
    <p
      data-style-key="footer.copyright"
      contenteditable="true"
      class="site-footer__copyright admin-inline-editable"
      :style="getStyleOverride('footer.copyright')"
      @blur="(e) => onTextChange(e, (val) => (footerData.copyright = val))"
      @input="(e) => onTextChange(e, (val) => (footerData.copyright = val))"
    >
      {{ footerData.copyright }}
    </p>
    <AdminSectionBlockLayer section-id="footer" />
  </footer>
</template>

<script setup lang="ts">
import AdminSectionBlockLayer from '@/components/admin/sections/common/admin-section-block-layer.vue';
import { useWebsiteEditor } from '@/composables/use-website-editor';
import { onTextChange } from '@/utils/admin-helpers';

defineProps<{
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();

const { footer: footerData, getStyleOverride } = useWebsiteEditor();
</script>
