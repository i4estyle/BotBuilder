<template>
  <section
    id="preview-section-branches"
    class="section branches admin-preview-section"
    :class="{ 'admin-preview-section--active': isActive }"
    @click="$emit('select', 'branches')"
  >
    <div class="section-heading section-heading--centered">
      <h2
        data-style-key="branches.heading"
        contenteditable="true"
        class="admin-inline-editable"
        :style="getStyleOverride('branches.heading')"
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
              :data-style-key="`branches.items.${index}.name`"
              contenteditable="true"
              class="admin-inline-editable"
              :style="getStyleOverride(`branches.items.${index}.name`)"
              @blur="(e) => onTextChange(e, (val) => (branch.name = val))"
              >{{ branch.name }}</strong
            >
            <span
              :data-style-key="`branches.items.${index}.address`"
              contenteditable="true"
              class="branch-card__address admin-inline-editable"
              :style="getStyleOverride(`branches.items.${index}.address`)"
              @blur="(e) => onTextChange(e, (val) => (branch.address = val))"
              >{{ branch.address }}</span
            >
            <p
              :data-style-key="`branches.items.${index}.description`"
              contenteditable="true"
              class="admin-inline-editable"
              :style="getStyleOverride(`branches.items.${index}.description`)"
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
                :data-style-key="`branches.items.${index}.phone`"
                contenteditable="true"
                class="admin-inline-editable"
                :style="getStyleOverride(`branches.items.${index}.phone`)"
                @blur="(e) => onTextChange(e, (val) => (branch.phone = val))"
                >{{ branch.phone }}</span
              >
              <span
                :data-style-key="`branches.items.${index}.contactName`"
                contenteditable="true"
                class="admin-inline-editable"
                :style="getStyleOverride(`branches.items.${index}.contactName`)"
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

const { branches: branchesData, getStyleOverride } = useWebsiteEditor();
</script>
