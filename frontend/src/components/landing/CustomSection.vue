<template>
  <section
    class="section custom-section"
    :class="[
      `custom-section--${block.background || 'white'}`,
      `custom-section--${block.type}`,
      { 'custom-section--editable': editable },
    ]"
  >
    <div class="custom-section__inner">
      <div
        v-if="block.type !== 'imageText' && block.type !== 'cta'"
        class="section-heading section-heading--centered"
      >
        <h2
          :contenteditable="editable || undefined"
          :class="{ 'admin-inline-editable': editable }"
          @blur="editable && onTitleBlur($event)"
        >
          {{ block.title }}
        </h2>
        <span class="section-heading__line" />
      </div>

      <!-- Text -->
      <div v-if="block.type === 'text'" class="custom-section__text">
        <p
          :contenteditable="editable || undefined"
          :class="{ 'admin-inline-editable': editable }"
          @blur="editable && onFieldBlur($event, 'content')"
        >
          {{ block.content }}
        </p>
      </div>

      <!-- Full-width image -->
      <div v-else-if="block.type === 'image'" class="custom-section__image">
        <div
          :class="{ 'admin-image-hover-trigger': editable }"
          data-image-key="customBlock"
          :data-block-id="block.id"
        >
          <img :src="resolveAssetUrl(block.image || '')" :alt="block.title" loading="lazy" />
          <div v-if="editable" class="admin-image-hover-overlay">
            <q-icon name="cloud_upload" size="32px" />
            <span>คลิกเพื่อเปลี่ยนรูปภาพ</span>
          </div>
        </div>
      </div>

      <!-- Image + text -->
      <div
        v-else-if="block.type === 'imageText'"
        class="custom-section__split"
        :class="{ 'custom-section__split--reverse': block.imagePosition === 'right' }"
      >
        <div class="custom-section__split-media">
          <div
            :class="{ 'admin-image-hover-trigger': editable }"
            data-image-key="customBlock"
            :data-block-id="block.id"
          >
            <img :src="resolveAssetUrl(block.image || '')" :alt="block.title" loading="lazy" />
            <div v-if="editable" class="admin-image-hover-overlay">
              <q-icon name="cloud_upload" size="32px" />
              <span>คลิกเพื่อเปลี่ยนรูปภาพ</span>
            </div>
          </div>
        </div>
        <div class="custom-section__split-copy">
          <h2
            :contenteditable="editable || undefined"
            :class="{ 'admin-inline-editable': editable }"
            @blur="editable && onTitleBlur($event)"
          >
            {{ block.title }}
          </h2>
          <span class="section-heading__line" />
          <p
            :contenteditable="editable || undefined"
            :class="{ 'admin-inline-editable': editable }"
            @blur="editable && onFieldBlur($event, 'content')"
          >
            {{ block.content }}
          </p>
        </div>
      </div>

      <!-- Feature cards -->
      <template v-else-if="block.type === 'cards'">
        <p
          v-if="block.content || editable"
          class="custom-section__lead"
          :contenteditable="editable || undefined"
          :class="{ 'admin-inline-editable': editable }"
          @blur="editable && onFieldBlur($event, 'content')"
        >
          {{ block.content }}
        </p>
        <div class="custom-section__cards">
          <article
            v-for="(card, index) in block.items || []"
            :key="index"
            class="custom-section__card"
          >
            <button
              v-if="editable"
              type="button"
              class="custom-section__card-icon custom-section__card-icon--button"
              aria-label="เปลี่ยนไอคอน"
              @click.stop="$emit('pickIcon', index)"
            >
              <q-icon :name="card.icon || 'star'" size="26px" />
              <q-tooltip>เปลี่ยนไอคอน</q-tooltip>
            </button>
            <div v-else class="custom-section__card-icon">
              <q-icon :name="card.icon || 'star'" size="26px" />
            </div>
            <h3
              :contenteditable="editable || undefined"
              :class="{ 'admin-inline-editable': editable }"
              @blur="editable && onCardBlur($event, index, 'title')"
            >
              {{ card.title }}
            </h3>
            <p
              :contenteditable="editable || undefined"
              :class="{ 'admin-inline-editable': editable }"
              @blur="editable && onCardBlur($event, index, 'text')"
            >
              {{ card.text }}
            </p>
            <button
              v-if="editable && (block.items?.length || 0) > 1"
              type="button"
              class="custom-section__card-remove"
              aria-label="ลบการ์ด"
              @click.stop="$emit('removeCard', index)"
            >
              <q-icon name="close" size="14px" />
              <q-tooltip>ลบการ์ดนี้</q-tooltip>
            </button>
          </article>
          <button
            v-if="editable && (block.items?.length || 0) < maxCards"
            type="button"
            class="custom-section__card-add"
            @click.stop="$emit('addCard')"
          >
            <q-icon name="add" size="22px" />
            <span>เพิ่มการ์ด</span>
          </button>
        </div>
      </template>

      <!-- Call to action -->
      <div v-else-if="block.type === 'cta'" class="custom-section__cta">
        <h2
          :contenteditable="editable || undefined"
          :class="{ 'admin-inline-editable': editable }"
          @blur="editable && onTitleBlur($event)"
        >
          {{ block.title }}
        </h2>
        <p
          :contenteditable="editable || undefined"
          :class="{ 'admin-inline-editable': editable }"
          @blur="editable && onFieldBlur($event, 'content')"
        >
          {{ block.content }}
        </p>
        <span v-if="editable" class="custom-section__cta-button">
          <span
            contenteditable="true"
            class="admin-inline-editable"
            @blur="onFieldBlur($event, 'buttonLabel')"
            >{{ block.buttonLabel }}</span
          >
        </span>
        <a
          v-else-if="buttonHref && block.buttonLabel"
          class="custom-section__cta-button"
          :href="buttonHref"
          :target="isExternal ? '_blank' : undefined"
          :rel="isExternal ? 'noopener noreferrer' : undefined"
        >
          {{ block.buttonLabel }}
        </a>
      </div>
    </div>

    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CustomBlockItem } from '@/composables/website-editor/types';
import {
  MAX_CUSTOM_SECTION_CARDS,
  sanitizeButtonUrl,
} from '@/composables/website-editor/custom-sections';
import { resolveAssetUrl } from '@/utils/asset-helper';

const props = withDefaults(
  defineProps<{
    block: CustomBlockItem;
    editable?: boolean;
  }>(),
  { editable: false },
);

const emit = defineEmits<{
  (e: 'update', patch: Partial<CustomBlockItem>): void;
  (e: 'updateCard', index: number, field: 'title' | 'text', value: string): void;
  (e: 'addCard'): void;
  (e: 'removeCard', index: number): void;
  (e: 'pickIcon', index: number): void;
}>();

const maxCards = MAX_CUSTOM_SECTION_CARDS;

const buttonHref = computed(() => sanitizeButtonUrl(props.block.buttonUrl));
const isExternal = computed(() => /^https?:/i.test(buttonHref.value));

function readText(event: Event): string {
  const target = event.target as HTMLElement | null;
  return target ? target.innerText.trim() : '';
}

function onTitleBlur(event: Event): void {
  const value = readText(event);
  if (value && value !== props.block.title) emit('update', { title: value });
}

function onFieldBlur(event: Event, field: 'content' | 'buttonLabel'): void {
  const value = readText(event);
  if (value !== (props.block[field] || '')) emit('update', { [field]: value });
}

function onCardBlur(event: Event, index: number, field: 'title' | 'text'): void {
  const value = readText(event);
  if (value !== (props.block.items?.[index]?.[field] || '')) {
    emit('updateCard', index, field, value);
  }
}
</script>
