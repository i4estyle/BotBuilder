export * from './website-editor/types';
export * from './website-editor/defaults';
export * from './website-editor/state';
export * from './website-editor/history';
export * from './website-editor/nav';
export * from './website-editor/content-mutations';
export * from './website-editor/free-blocks';
export * from './website-editor/style-overrides';

import type { ActivePage } from './website-editor/types';

import {
  createInitialState,
  createInitialEnState,
  SECTION_TITLE_MAP,
  IMAGE_BLOCK_SIZES,
  getDefaultImageSrcs,
  AVAILABLE_ICONS,
} from './website-editor/defaults';
import {
  contentState,
  contentStateMap,
  editorLocale,
  activePage,
  customBlocks,
  sectionBlocks,
  activeSectionId,
  selectedBlockId,
  viewportMode,
  editMode,
  themeSettings,
  navSections,
  ghostBlockType,
  isLoading,
  isSaving,
  error,
} from './website-editor/state';
import {
  styleOverrides,
  getStyleOverride,
  setStyleOverride,
  removeStyleOverride,
  clearStyleOverrides,
  clearPageStyleOverrides,
  type StyleOverrideItem,
} from './website-editor/style-overrides';
import {
  saveHistorySnapshot,
  canUndo,
  canRedo,
  undo,
  redo,
  captureInlineDomStates,
} from './website-editor/history';
import {
  setActivePage,
  saveCurrentStateToMap,
  syncActiveContentToTarget,
  addNewPageSection,
  insertCustomBlockAt,
  updateSectionTitle,
  updateSectionIcon,
  moveSectionUp,
  moveSectionDown,
  reorderNavSections,
  removeSection,
} from './website-editor/nav';
import {
  addBenefitItem,
  removeBenefitItem,
  moveBenefitItem,
  addActivityFormatItem,
  removeActivityFormatItem,
  moveActivityFormatItem,
  addActivityGroup,
  removeActivityGroup,
  moveActivityGroup,
  addGalleryPhoto,
  removeGalleryPhoto,
  moveGalleryPhoto,
  addBranchItem,
  removeBranchItem,
  addHeroSkill,
  removeHeroSkill,
  addPromotionItem,
  removePromotionItem,
  addCourseItem,
  removeCourseItem,
  addResourceItem,
  removeResourceItem,
} from './website-editor/content-mutations';
import {
  startPlacingBlock,
  cancelPlacingBlock,
  dropBlockAtSection,
  addCustomTextBlock,
  addCustomImageBlock,
  addCustomIconBlock,
  addBlockToSection,
  removeSectionBlock,
  getSectionBlocks,
  updateBlockPosition,
  updateBlockSize,
  bringToFront,
  sendToBack,
} from './website-editor/free-blocks';
import { pageSectionsApiService } from '@/services/page-sections-api.service';
import type { EditorLocale } from './website-editor/types';

const liveSyncChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('botbuilder-live-sync')
    : null;

function syncStateObjects(
  target: ReturnType<typeof createInitialState>,
  source?: Record<string, unknown> | null,
): void {
  if (!source) return;
  if (source.header && typeof source.header === 'object')
    Object.assign(target.header, source.header);
  if (source.hero && typeof source.hero === 'object') Object.assign(target.hero, source.hero);
  if (source.benefits && typeof source.benefits === 'object')
    Object.assign(target.benefits, source.benefits);
  if (source.activityFormats && typeof source.activityFormats === 'object')
    Object.assign(target.activityFormats, source.activityFormats);
  if (source.gallery && typeof source.gallery === 'object')
    Object.assign(target.gallery, source.gallery);
  if (source.activityGallery && typeof source.activityGallery === 'object')
    Object.assign(target.activityGallery, source.activityGallery);
  if (source.quiz && typeof source.quiz === 'object') Object.assign(target.quiz, source.quiz);
  if (source.branches && typeof source.branches === 'object')
    Object.assign(target.branches, source.branches);
  if (source.cta && typeof source.cta === 'object') Object.assign(target.cta, source.cta);
  if (source.footer && typeof source.footer === 'object')
    Object.assign(target.footer, source.footer);
  if (source.promotionsPage && typeof source.promotionsPage === 'object')
    Object.assign(target.promotionsPage, source.promotionsPage);
  if (source.coursesPage && typeof source.coursesPage === 'object')
    Object.assign(target.coursesPage, source.coursesPage);
  if (source.resourcesPage && typeof source.resourcesPage === 'object')
    Object.assign(target.resourcesPage, source.resourcesPage);
  if (source.aboutPage && typeof source.aboutPage === 'object')
    Object.assign(target.aboutPage, source.aboutPage);
}

export function useWebsiteEditor() {
  const fetchPageData = async (pageName?: string, locale?: string): Promise<void> => {
    const targetPage = pageName || activePage.value || 'home';
    const targetLocale = (locale || editorLocale.value || 'th-TH') as EditorLocale;
    isLoading.value = true;
    error.value = null;

    try {
      const data = await pageSectionsApiService.getPageData(targetPage, targetLocale);
      if (data.sections) {
        syncStateObjects(contentStateMap[targetLocale], data.sections);
        if (editorLocale.value === targetLocale) {
          syncActiveContentToTarget(contentStateMap[targetLocale]);
        }
      }
      if (data.navSections && Array.isArray(data.navSections) && data.navSections.length > 0) {
        navSections.splice(0, navSections.length, ...data.navSections);
      }
      if (data.themeSettings) {
        Object.assign(themeSettings, data.themeSettings);
      }
      if (data.customBlocks && Array.isArray(data.customBlocks)) {
        customBlocks.splice(0, customBlocks.length, ...data.customBlocks);
      }
      if (data.sectionBlocks && Array.isArray(data.sectionBlocks)) {
        sectionBlocks.splice(0, sectionBlocks.length, ...data.sectionBlocks);
      }
      if (data.styleOverrides && typeof data.styleOverrides === 'object') {
        clearPageStyleOverrides(true);
        Object.assign(styleOverrides, data.styleOverrides);
      }
      if (data.inlineDomStates && Array.isArray(data.inlineDomStates)) {
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('editor-state-restored', {
              detail: { inlineDomStates: data.inlineDomStates },
            }),
          );
        }, 100);
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch page data';
    } finally {
      isLoading.value = false;
    }
  };

  const setEditorLocale = async (newLocale: EditorLocale): Promise<void> => {
    if (editorLocale.value === newLocale) return;
    saveCurrentStateToMap();
    editorLocale.value = newLocale;
    syncActiveContentToTarget(contentStateMap[newLocale]);
    localStorage.setItem('botbuilder-locale', newLocale);
    await fetchPageData(activePage.value, newLocale);
  };

  const saveToBackend = async (): Promise<boolean> => {
    saveCurrentStateToMap();
    isSaving.value = true;
    error.value = null;

    try {
      const capturedInlineStates = captureInlineDomStates();
      await pageSectionsApiService.bulkSave({
        pageName: activePage.value || 'home',
        locale: editorLocale.value,
        sections: contentStateMap[editorLocale.value],
        contentStateMap,
        navSections,
        themeSettings,
        customBlocks,
        sectionBlocks,
        inlineDomStates: capturedInlineStates,
        styleOverrides,
      });

      localStorage.setItem(
        'botbuilder-admin-website-draft',
        JSON.stringify({
          savedAt: new Date().toISOString(),
          editorLocale: editorLocale.value,
          contentStateMap,
          navSections,
          themeSettings,
          styleOverrides,
        }),
      );

      liveSyncChannel?.postMessage({
        type: 'content-saved',
        pageName: activePage.value || 'home',
        locale: editorLocale.value,
        timestamp: Date.now(),
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('website-content-saved', {
            detail: { pageName: activePage.value || 'home', locale: editorLocale.value },
          }),
        );
      }

      return true;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to save to database';
      return false;
    } finally {
      isSaving.value = false;
    }
  };

  const resetAll = (): void => {
    saveHistorySnapshot();
    const freshTh = createInitialState();
    const freshEn = createInitialEnState();
    syncStateObjects(contentStateMap['th-TH'], freshTh);
    syncStateObjects(contentStateMap['en-US'], freshEn);
    syncActiveContentToTarget(contentStateMap[editorLocale.value]);
    customBlocks.splice(0, customBlocks.length);
    sectionBlocks.splice(0, sectionBlocks.length);
    clearStyleOverrides();
    setActivePage(activePage.value);
    themeSettings.primaryColor = '#c00000';
    themeSettings.accentColor = '#1c871e';
    activeSectionId.value = '';
    selectedBlockId.value = '';
    window.dispatchEvent(new CustomEvent('editor-state-reset'));
  };

  const selectActivePage = async (page: ActivePage): Promise<void> => {
    setActivePage(page);
    await fetchPageData(page, editorLocale.value);
  };

  return {
    activePage,
    setActivePage: selectActivePage,
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
    navSections,
    activeSectionId,
    selectedBlockId,
    viewportMode,
    editMode,
    themeSettings,
    editorLocale,
    setEditorLocale,
    saveCurrentStateToMap,
    contentStateMap,
    canUndo,
    canRedo,
    sectionTitleMap: SECTION_TITLE_MAP,
    availableIcons: AVAILABLE_ICONS,
    imageBlockSizes: IMAGE_BLOCK_SIZES,
    getDefaultImageSrcs,
    ghostBlockType,
    isLoading,
    isSaving,
    error,
    fetchPageData,
    saveToBackend,
    startPlacingBlock,
    cancelPlacingBlock,
    dropBlockAtSection,
    saveHistorySnapshot,
    undo,
    redo,
    addCustomTextBlock,
    addCustomImageBlock,
    addCustomIconBlock,
    addNewPageSection,
    insertCustomBlockAt,
    addBlockToSection,
    removeSectionBlock,
    getSectionBlocks,
    updateBlockPosition,
    updateBlockSize,
    bringToFront,
    sendToBack,
    addBenefitItem,
    removeBenefitItem,
    moveBenefitItem,
    addActivityFormatItem,
    removeActivityFormatItem,
    moveActivityFormatItem,
    addActivityGroup,
    removeActivityGroup,
    moveActivityGroup,
    addGalleryPhoto,
    removeGalleryPhoto,
    moveGalleryPhoto,
    addBranchItem,
    removeBranchItem,
    addHeroSkill,
    removeHeroSkill,
    addPromotionItem,
    removePromotionItem,
    addCourseItem,
    removeCourseItem,
    addResourceItem,
    removeResourceItem,
    updateSectionTitle,
    updateSectionIcon,
    moveSectionUp,
    moveSectionDown,
    reorderNavSections,
    removeSection,
    resetAll,
    styleOverrides,
    getStyleOverride,
    setStyleOverride,
    removeStyleOverride,
    clearStyleOverrides,
  };
}

export type { StyleOverrideItem };
