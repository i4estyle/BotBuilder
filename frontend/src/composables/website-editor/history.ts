import { computed, nextTick } from 'vue';
import {
  contentState,
  activePage,
  customBlocks,
  sectionBlocks,
  historyStack,
  redoStack,
  maxHistory,
} from './state';
import type { InlineDomState } from './types';

const inlineEditableSelector =
  '.admin-inline-editable, .admin-image-hover-trigger, .admin-icon-clickable';

export function captureInlineDomStates(): InlineDomState[] {
  if (typeof document === 'undefined') return [];

  return Array.from(
    document.querySelectorAll<HTMLElement>(`.admin-preview-container ${inlineEditableSelector}`),
  ).map((el, index) => {
    const img = el.querySelector<HTMLImageElement>('img') || (el as HTMLImageElement);
    const qIcon = el.querySelector<HTMLElement>('.q-icon') || el;

    return {
      index,
      text: el.isContentEditable ? el.innerText : undefined,
      imageSrc: img instanceof HTMLImageElement ? img.src : undefined,
      iconName: qIcon?.getAttribute('name'),
      display: el.style.display,
      transform: el.style.transform,
      width: el.style.width,
      height: el.style.height,
      fontSize: el.style.fontSize,
      color: el.style.color,
      fontWeight: el.style.fontWeight,
      fontStyle: el.style.fontStyle,
    };
  });
}

export function getFullSnapshotString(): string {
  return JSON.stringify({
    activePage: activePage.value,
    header: contentState.header,
    hero: contentState.hero,
    benefits: contentState.benefits,
    activityFormats: contentState.activityFormats,
    gallery: contentState.gallery,
    activityGallery: contentState.activityGallery,
    quiz: contentState.quiz,
    branches: contentState.branches,
    cta: contentState.cta,
    footer: contentState.footer,
    promotionsPage: contentState.promotionsPage,
    coursesPage: contentState.coursesPage,
    resourcesPage: contentState.resourcesPage,
    aboutPage: contentState.aboutPage,
    customBlocks,
    sectionBlocks,
    inlineDomStates: captureInlineDomStates(),
  });
}

export function saveHistorySnapshot(): void {
  const currentSnapshot = getFullSnapshotString();

  if (
    historyStack.value.length > 0 &&
    historyStack.value[historyStack.value.length - 1] === currentSnapshot
  ) {
    return;
  }

  historyStack.value.push(currentSnapshot);
  if (historyStack.value.length > maxHistory) {
    historyStack.value.shift();
  }
  redoStack.value = [];
}

export const canUndo = computed(() => historyStack.value.length > 0);
export const canRedo = computed(() => redoStack.value.length > 0);

export function applySnapshot(snapshotStr: string): InlineDomState[] {
  try {
    const data = JSON.parse(snapshotStr);
    if (data.header) Object.assign(contentState.header, data.header);
    if (data.hero) Object.assign(contentState.hero, data.hero);
    if (data.benefits) Object.assign(contentState.benefits, data.benefits);
    if (data.activityFormats) Object.assign(contentState.activityFormats, data.activityFormats);
    if (data.gallery) Object.assign(contentState.gallery, data.gallery);
    if (data.activityGallery) Object.assign(contentState.activityGallery, data.activityGallery);
    if (data.quiz) Object.assign(contentState.quiz, data.quiz);
    if (data.branches) Object.assign(contentState.branches, data.branches);
    if (data.cta) Object.assign(contentState.cta, data.cta);
    if (data.footer) Object.assign(contentState.footer, data.footer);
    if (data.promotionsPage) Object.assign(contentState.promotionsPage, data.promotionsPage);
    if (data.coursesPage) Object.assign(contentState.coursesPage, data.coursesPage);
    if (data.resourcesPage) Object.assign(contentState.resourcesPage, data.resourcesPage);
    if (data.aboutPage) Object.assign(contentState.aboutPage, data.aboutPage);
    if (Array.isArray(data.customBlocks)) {
      customBlocks.splice(0, customBlocks.length, ...data.customBlocks);
    }
    if (Array.isArray(data.sectionBlocks)) {
      sectionBlocks.splice(0, sectionBlocks.length, ...data.sectionBlocks);
    }
    activePage.value = data.activePage || activePage.value;
    return Array.isArray(data.inlineDomStates) ? data.inlineDomStates : [];
  } catch (err) {
    console.error('Failed to parse snapshot:', err);
    return [];
  }
}

export function undo(): void {
  if (historyStack.value.length === 0) return;
  const current = getFullSnapshotString();
  redoStack.value.push(current);

  const prev = historyStack.value.pop();
  if (prev) {
    const inlineDomStates = applySnapshot(prev);
    void nextTick(() => {
      window.dispatchEvent(
        new CustomEvent('editor-state-restored', { detail: { inlineDomStates } }),
      );
    });
  }
}

export function redo(): void {
  if (redoStack.value.length === 0) return;
  const current = getFullSnapshotString();
  historyStack.value.push(current);

  const next = redoStack.value.pop();
  if (next) {
    const inlineDomStates = applySnapshot(next);
    void nextTick(() => {
      window.dispatchEvent(
        new CustomEvent('editor-state-restored', { detail: { inlineDomStates } }),
      );
    });
  }
}
