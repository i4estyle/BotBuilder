import { getFallbackNavSections, type createInitialState } from './defaults';
import {
  activePage,
  activeSectionId,
  navSections,
  customBlocks,
  editorLocale,
  contentStateMap,
  contentState,
} from './state';
import { saveHistorySnapshot } from './history';
import { createCustomSection, getCustomSectionIcon } from './custom-sections';
import type { ActivePage, CustomBlockItem, CustomSectionLayout } from './types';

export function setActivePage(page: ActivePage): void {
  activePage.value = page;
  const sections = getFallbackNavSections(page, editorLocale.value);
  navSections.splice(0, navSections.length, ...sections);
  activeSectionId.value = '';
}

export function syncActiveContentToTarget(
  targetState: ReturnType<typeof createInitialState>,
): void {
  Object.assign(contentState.header, targetState.header);
  Object.assign(contentState.hero, targetState.hero);
  Object.assign(contentState.benefits, targetState.benefits);
  Object.assign(contentState.activityFormats, targetState.activityFormats);
  Object.assign(contentState.gallery, targetState.gallery);
  Object.assign(contentState.activityGallery, targetState.activityGallery);
  Object.assign(contentState.quiz, targetState.quiz);
  Object.assign(contentState.branches, targetState.branches);
  Object.assign(contentState.cta, targetState.cta);
  Object.assign(contentState.footer, targetState.footer);
  if (targetState.promotionsPage)
    Object.assign(contentState.promotionsPage, targetState.promotionsPage);
  if (targetState.coursesPage) Object.assign(contentState.coursesPage, targetState.coursesPage);
  if (targetState.resourcesPage)
    Object.assign(contentState.resourcesPage, targetState.resourcesPage);
  if (targetState.aboutPage) Object.assign(contentState.aboutPage, targetState.aboutPage);
}

export function saveCurrentStateToMap(): void {
  const current = contentStateMap[editorLocale.value];
  Object.assign(current.header, contentState.header);
  Object.assign(current.hero, contentState.hero);
  Object.assign(current.benefits, contentState.benefits);
  Object.assign(current.activityFormats, contentState.activityFormats);
  Object.assign(current.gallery, contentState.gallery);
  Object.assign(current.activityGallery, contentState.activityGallery);
  Object.assign(current.quiz, contentState.quiz);
  Object.assign(current.branches, contentState.branches);
  Object.assign(current.cta, contentState.cta);
  Object.assign(current.footer, contentState.footer);
  if (contentState.promotionsPage)
    Object.assign(current.promotionsPage, contentState.promotionsPage);
  if (contentState.coursesPage) Object.assign(current.coursesPage, contentState.coursesPage);
  if (contentState.resourcesPage) Object.assign(current.resourcesPage, contentState.resourcesPage);
  if (contentState.aboutPage) Object.assign(current.aboutPage, contentState.aboutPage);
}

/** Sections that must always stay on the page (site navigation). */
export const LOCKED_SECTION_IDS = new Set(['header', 'footer']);

function createCustomSectionId(): string {
  return `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Adds a user-created section to the current page and returns its id.
 * When `afterSectionId` is omitted the section is placed just above the footer.
 */
export function addCustomSection(layout: CustomSectionLayout, afterSectionId?: string): string {
  saveHistorySnapshot();
  const id = createCustomSectionId();
  const block = createCustomSection(id, layout);
  customBlocks.push(block);

  let insertPos = navSections.length;
  const afterIndex = afterSectionId ? navSections.findIndex((s) => s.id === afterSectionId) : -1;
  if (afterIndex >= 0) {
    insertPos = afterIndex + 1;
  } else {
    const footerIndex = navSections.findIndex((s) => s.id === 'footer');
    if (footerIndex >= 0) insertPos = footerIndex;
  }
  // Never place anything above the header or below the footer.
  const headerIndex = navSections.findIndex((s) => s.id === 'header');
  if (headerIndex >= 0 && insertPos <= headerIndex) insertPos = headerIndex + 1;
  const footerIndex = navSections.findIndex((s) => s.id === 'footer');
  if (footerIndex >= 0 && insertPos > footerIndex) insertPos = footerIndex;

  navSections.splice(insertPos, 0, {
    id,
    title: block.title,
    icon: getCustomSectionIcon(layout),
    color: 'green',
    isCustomPage: true,
  });

  activeSectionId.value = id;
  return id;
}

export function duplicateCustomSection(id: string): string {
  const source = customBlocks.find((b) => b.id === id);
  const navIndex = navSections.findIndex((s) => s.id === id);
  const navItem = navSections[navIndex];
  if (!source || !navItem) return '';
  saveHistorySnapshot();
  const newId = createCustomSectionId();
  const copy: CustomBlockItem = JSON.parse(JSON.stringify(source));
  copy.id = newId;
  copy.title = `${source.title} (สำเนา)`;
  customBlocks.push(copy);
  navSections.splice(navIndex + 1, 0, { ...navItem, id: newId, title: copy.title, hidden: false });
  activeSectionId.value = newId;
  return newId;
}

export function toggleSectionHidden(id: string): void {
  if (LOCKED_SECTION_IDS.has(id)) return;
  const item = navSections.find((s) => s.id === id);
  if (!item) return;
  saveHistorySnapshot();
  item.hidden = !item.hidden;
  if (item.hidden && activeSectionId.value === id) {
    activeSectionId.value = '';
  }
}

/** Keeps the sidebar label in sync when a custom section title is edited inline. */
export function syncCustomSectionTitle(id: string, title: string): void {
  const item = navSections.find((s) => s.id === id);
  if (item && item.isCustomPage && title.trim()) {
    item.title = title.trim();
  }
}

export function updateSectionTitle(id: string, newTitle: string): void {
  saveHistorySnapshot();
  const item = navSections.find((s) => s.id === id);
  if (item) {
    item.title = newTitle;
  }
  const block = customBlocks.find((b) => b.id === id);
  if (block) {
    block.title = newTitle;
  }
}

export function updateSectionIcon(id: string, newIcon: string): void {
  saveHistorySnapshot();
  const item = navSections.find((s) => s.id === id);
  if (item) {
    item.icon = newIcon;
  }
}

export function moveSectionUp(id: string): void {
  const index = navSections.findIndex((s) => s.id === id);
  const current = navSections[index];
  const prev = navSections[index - 1];
  if (index > 0 && current && prev) {
    saveHistorySnapshot();
    navSections[index] = prev;
    navSections[index - 1] = current;
  }
}

export function moveSectionDown(id: string): void {
  const index = navSections.findIndex((s) => s.id === id);
  const current = navSections[index];
  const next = navSections[index + 1];
  if (index !== -1 && index < navSections.length - 1 && current && next) {
    saveHistorySnapshot();
    navSections[index] = next;
    navSections[index + 1] = current;
  }
}

export function reorderNavSections(fromIndex: number, toIndex: number): void {
  if (
    fromIndex < 0 ||
    fromIndex >= navSections.length ||
    toIndex < 0 ||
    toIndex >= navSections.length ||
    fromIndex === toIndex
  ) {
    return;
  }
  const item = navSections[fromIndex];
  // Header and footer stay pinned to the top and bottom of the page.
  if (!item || LOCKED_SECTION_IDS.has(item.id)) return;
  const headerIndex = navSections.findIndex((s) => s.id === 'header');
  const footerIndex = navSections.findIndex((s) => s.id === 'footer');
  let target = toIndex;
  if (headerIndex >= 0 && target <= headerIndex) target = headerIndex + 1;
  if (footerIndex >= 0 && target >= footerIndex) target = footerIndex - 1;
  if (target === fromIndex) return;
  saveHistorySnapshot();
  navSections.splice(fromIndex, 1);
  navSections.splice(target, 0, item);
}

/** Permanently removes a user-created section. Built-in sections can only be hidden. */
export function removeSection(id: string): void {
  const navItem = navSections.find((s) => s.id === id);
  if (!navItem?.isCustomPage) return;
  saveHistorySnapshot();
  const index = customBlocks.findIndex((b) => b.id === id);
  if (index !== -1) {
    customBlocks.splice(index, 1);
  }
  const navIndex = navSections.findIndex((s) => s.id === id);
  if (navIndex !== -1) {
    navSections.splice(navIndex, 1);
  }
  if (activeSectionId.value === id) {
    activeSectionId.value = '';
  }
}
