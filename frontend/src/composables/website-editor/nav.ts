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
import type { ActivePage, EditorLocale, CustomBlock } from './types';

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

export function setEditorLocale(newLocale: EditorLocale): void {
  if (editorLocale.value === newLocale) return;
  saveCurrentStateToMap();
  editorLocale.value = newLocale;
  syncActiveContentToTarget(contentStateMap[newLocale]);
  const sections = getFallbackNavSections(activePage.value, newLocale);
  navSections.splice(0, navSections.length, ...sections);
}

export function addNewPageSection(): void {
  saveHistorySnapshot();
  const pageId = `page-${Date.now()}`;
  const customPageCount = navSections.filter((s) => s.isCustomPage).length + 1;
  const newTitle = `หน้าใหม่ ${customPageCount}`;

  customBlocks.push({
    id: pageId,
    type: 'text',
    title: newTitle,
    content:
      'นี่คือหน้าใหม่ที่เพิ่มเข้ามา สามารถคลิกพิมพ์แก้ไขข้อความ หรือเพิ่มรูปภาพและองค์ประกอบต่าง ๆ ได้อย่างอิสระ',
  });

  navSections.push({
    id: pageId,
    title: newTitle,
    icon: 'article',
    color: 'green',
    isCustomPage: true,
  });

  activeSectionId.value = pageId;
}

export function insertCustomBlockAt(targetIndex: number, blockType: 'text' | 'image'): void {
  saveHistorySnapshot();
  const pageId = `page-${Date.now()}`;
  const customPageCount = navSections.filter((s) => s.isCustomPage).length + 1;
  const newTitle =
    blockType === 'text' ? `บล็อกข้อความ ${customPageCount}` : `บล็อกรูปภาพ ${customPageCount}`;

  const blockObj: CustomBlock = {
    id: pageId,
    type: blockType,
    title: newTitle,
  };
  if (blockType === 'text') {
    blockObj.content = 'พิมพ์ข้อความเนื้อหาใหม่ตรงนี้ สามารถแก้ไขได้โดยตรงบนหน้าจอ...';
  } else {
    blockObj.image =
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
  }

  customBlocks.push(blockObj);

  const insertPos =
    targetIndex >= 0 && targetIndex <= navSections.length ? targetIndex : navSections.length;

  navSections.splice(insertPos, 0, {
    id: pageId,
    title: newTitle,
    icon: blockType === 'text' ? 'text_fields' : 'image',
    color: 'green',
    isCustomPage: true,
  });

  activeSectionId.value = pageId;
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
  saveHistorySnapshot();
  const item = navSections[fromIndex];
  if (item) {
    navSections.splice(fromIndex, 1);
    navSections.splice(toIndex, 0, item);
  }
}

export function removeSection(id: string): void {
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
