export * from './website-editor/types';
export * from './website-editor/defaults';
export * from './website-editor/state';
export * from './website-editor/history';
export * from './website-editor/nav';
export * from './website-editor/content-mutations';
export * from './website-editor/free-blocks';

import { createInitialState, createInitialEnState, SECTION_TITLE_MAP, IMAGE_BLOCK_SIZES, getDefaultImageSrcs, AVAILABLE_ICONS } from './website-editor/defaults';
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
} from './website-editor/state';
import {
  saveHistorySnapshot,
  canUndo,
  canRedo,
  undo,
  redo,
} from './website-editor/history';
import {
  setActivePage,
  setEditorLocale,
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
  addGalleryPhoto,
  removeGalleryPhoto,
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

function syncStateObjects(
  target: ReturnType<typeof createInitialState>,
  source: Partial<ReturnType<typeof createInitialState>>,
): void {
  if (source.header) Object.assign(target.header, source.header);
  if (source.hero) Object.assign(target.hero, source.hero);
  if (source.benefits) Object.assign(target.benefits, source.benefits);
  if (source.activityFormats) Object.assign(target.activityFormats, source.activityFormats);
  if (source.gallery) Object.assign(target.gallery, source.gallery);
  if (source.activityGallery) Object.assign(target.activityGallery, source.activityGallery);
  if (source.quiz) Object.assign(target.quiz, source.quiz);
  if (source.branches) Object.assign(target.branches, source.branches);
  if (source.cta) Object.assign(target.cta, source.cta);
  if (source.footer) Object.assign(target.footer, source.footer);
  if (source.promotionsPage) Object.assign(target.promotionsPage, source.promotionsPage);
  if (source.coursesPage) Object.assign(target.coursesPage, source.coursesPage);
  if (source.resourcesPage) Object.assign(target.resourcesPage, source.resourcesPage);
  if (source.aboutPage) Object.assign(target.aboutPage, source.aboutPage);
}

export function useWebsiteEditor() {
  const resetAll = (): void => {
    saveHistorySnapshot();
    const freshTh = createInitialState();
    const freshEn = createInitialEnState();
    syncStateObjects(contentStateMap['th-TH'], freshTh);
    syncStateObjects(contentStateMap['en-US'], freshEn);
    syncActiveContentToTarget(contentStateMap[editorLocale.value]);
    customBlocks.splice(0, customBlocks.length);
    sectionBlocks.splice(0, sectionBlocks.length);
    setActivePage(activePage.value);
    themeSettings.primaryColor = '#c00000';
    themeSettings.accentColor = '#1c871e';
    activeSectionId.value = '';
    selectedBlockId.value = '';
    window.dispatchEvent(new CustomEvent('editor-state-reset'));
  };

  return {
    activePage,
    setActivePage,
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
    addGalleryPhoto,
    removeGalleryPhoto,
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
  };
}
