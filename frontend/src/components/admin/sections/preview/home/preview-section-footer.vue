<template>
  <footer
    id="preview-section-footer"
    class="site-footer admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'footer')"
  >
    <div>
      <h2
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (footerData.brandTitle = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.brandTitle = val))"
      >
        {{ footerData.brandTitle }}
      </h2>
      <p
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (footerData.brandText = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.brandText = val))"
      >
        {{ footerData.brandText }}
      </p>
    </div>
    <div>
      <h3
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (footerData.quickLinks = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.quickLinks = val))"
      >
        {{ footerData.quickLinks }}
      </h3>
      <a
        href="javascript:void(0)"
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (footerData.courses = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.courses = val))"
        >{{ footerData.courses }}</a
      >
      <a
        href="javascript:void(0)"
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (footerData.aboutUs = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.aboutUs = val))"
        >{{ footerData.aboutUs }}</a
      >
      <a
        href="javascript:void(0)"
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (footerData.resources = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.resources = val))"
        >{{ footerData.resources }}</a
      >
    </div>
    <div>
      <h3
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (footerData.support = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.support = val))"
      >
        {{ footerData.support }}
      </h3>
      <a
        href="javascript:void(0)"
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (footerData.promotion = val))"
        @input="(e) => onTextChange(e, (val) => (footerData.promotion = val))"
        >{{ footerData.promotion }}</a
      >
      <a href="javascript:void(0)">Contact us</a>
    </div>
    <p
      contenteditable="true"
      class="site-footer__copyright admin-inline-editable"
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

const { footer: footerData } = useWebsiteEditor();
</script>
