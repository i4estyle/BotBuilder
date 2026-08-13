<template>
  <section
    id="preview-section-branches"
    class="section branches admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'branches')"
  >
    <div class="section-heading section-heading--centered">
      <h2
        contenteditable="true"
        class="admin-inline-editable"
        @blur="(e) => onTextChange(e, (val) => (branchesData.heading = val))"
      >
        {{ branchesData.heading }}
      </h2>
      <span class="section-heading__line" />
    </div>
    <div class="branches__grid">
      <div v-for="(branch, index) in branchesData.items" :key="index" class="branch-block">
        <div class="branches__map">
          <iframe
            :src="branch.mapEmbedUrl"
            :title="branch.name"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          />
        </div>
        <article class="branch-card">
          <q-icon name="location_on" class="admin-icon-clickable" />
          <div class="branch-card__content">
            <strong
              contenteditable="true"
              class="admin-inline-editable"
              @blur="(e) => onTextChange(e, (val) => (branch.name = val))"
              >{{ branch.name }}</strong
            >
            <span
              contenteditable="true"
              class="branch-card__address admin-inline-editable"
              @blur="(e) => onTextChange(e, (val) => (branch.address = val))"
              >{{ branch.address }}</span
            >
            <p
              contenteditable="true"
              class="admin-inline-editable"
              @blur="(e) => onTextChange(e, (val) => (branch.description = val))"
            >
              {{ branch.description }}
            </p>
            <dl class="branch-card__hours">
              <div v-for="hour in branch.hours" :key="hour.days">
                <dt
                  contenteditable="true"
                  class="admin-inline-editable"
                  @blur="(e) => onTextChange(e, (val) => (hour.days = val))"
                >
                  {{ hour.days }}
                </dt>
                <dd
                  contenteditable="true"
                  class="admin-inline-editable"
                  @blur="(e) => onTextChange(e, (val) => (hour.time = val))"
                >
                  {{ hour.time }}
                </dd>
              </div>
            </dl>
            <a href="javascript:void(0)" class="branch-card__phone">
              <q-icon name="phone" class="admin-icon-clickable" />
              <span
                contenteditable="true"
                class="admin-inline-editable"
                @blur="(e) => onTextChange(e, (val) => (branch.phone = val))"
                >{{ branch.phone }}</span
              >
              <span
                contenteditable="true"
                class="admin-inline-editable"
                @blur="(e) => onTextChange(e, (val) => (branch.contactName = val))"
                >({{ branch.contactName }})</span
              >
            </a>
          </div>
        </article>
      </div>
    </div>
    <AdminSectionBlockLayer section-id="branches" />
  </section>
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

const { branches: branchesData } = useWebsiteEditor();
</script>
