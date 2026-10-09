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
  getFallbackNavSections,
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
  if (source.hero && typeof source.hero === 'object') {
    Object.assign(target.hero, source.hero);

    // Apply the new Home hero copy when a saved page still contains the retired default copy.
    // Custom editor content is intentionally left untouched.
    if (target.hero.titleHighlight === 'เล่นและเรียนรู้ผ่านการทำจริง') {
      Object.assign(target.hero, {
        imageAlt: 'เด็ก ๆ กำลังทดลองเรียนรู้หุ่นยนต์ที่ BotBuilder',
        titleHighlight: 'คิดเอง',
        titleRest: 'สร้างเอง\nเขียนเอง\nอธิบายได้',
        paragraph:
          'BotBuilder เปลี่ยนการเรียนหุ่นยนต์จาก “ทำตามแบบ” ให้เป็นพื้นที่ที่เด็กได้สร้าง ทดลอง แก้ปัญหา และพัฒนาวิธีคิดของตัวเอง',
        ctaLabel: 'จองรอบทดลองเรียนฟรี',
        ctaBangsaen: 'สาขาบางแสน',
        ctaSriracha: 'สาขาศรีราชา',
      });
    }
  }
  if (source.benefits && typeof source.benefits === 'object')
    Object.assign(target.benefits, source.benefits);
  if (source.activityFormats && typeof source.activityFormats === 'object')
    Object.assign(target.activityFormats, source.activityFormats);
  if (target.activityFormats.heading === 'รูปแบบกิจกรรม') {
    Object.assign(target.activityFormats, {
      heading: 'ให้ภาพจริงเล่าแทนคำว่า “เรียนสนุกและสร้างสรรค์”',
      items: [
        {
          image: target.activityFormats.items[0]?.image || '',
          title: 'Mission-based learning',
          description: 'มีโจทย์ให้ลงมือและเห็นผลจริง',
        },
        {
          image: target.activityFormats.items[1]?.image || '',
          title: 'Teacher as coach',
          description: 'ครูช่วยให้เด็กคิด ไม่ใช่บอกทุกคำตอบ',
        },
        {
          image: target.activityFormats.items[2]?.image || '',
          title: 'Hands-on',
          description: 'เด็กต้องจับ สร้าง ปรับ และทดลองด้วยตัวเอง',
        },
      ],
    });
  }
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

function placeCourseMatcherAfterActivityFormats(page: ActivePage): void {
  if (page !== 'home') return;

  const matcherIndex = navSections.findIndex((section) => section.id === 'courseMatcher');
  const activityIndex = navSections.findIndex((section) => section.id === 'activityFormats');
  if (matcherIndex < 0 || activityIndex < 0 || matcherIndex === activityIndex + 1) return;

  const [matcher] = navSections.splice(matcherIndex, 1);
  if (matcher) navSections.splice(activityIndex + (matcherIndex < activityIndex ? 0 : 1), 0, matcher);
}

function placeLearningMethodAfterCourseMatcher(page: ActivePage): void {
  if (page !== 'home') return;

  const methodIndex = navSections.findIndex((section) => section.id === 'learningMethod');
  const matcherIndex = navSections.findIndex((section) => section.id === 'courseMatcher');
  if (methodIndex < 0 || matcherIndex < 0 || methodIndex === matcherIndex + 1) return;

  const [method] = navSections.splice(methodIndex, 1);
  if (method) navSections.splice(matcherIndex + (methodIndex < matcherIndex ? 0 : 1), 0, method);
}

function placeStudentProjectsAfterLearningMethod(page: ActivePage): void {
  if (page !== 'home') return;

  const projectsIndex = navSections.findIndex((section) => section.id === 'studentProjects');
  const methodIndex = navSections.findIndex((section) => section.id === 'learningMethod');
  if (projectsIndex < 0 || methodIndex < 0 || projectsIndex === methodIndex + 1) return;

  const [projects] = navSections.splice(projectsIndex, 1);
  if (projects) navSections.splice(methodIndex + (projectsIndex < methodIndex ? 0 : 1), 0, projects);
}

function placeParentProofAfterStudentProjects(page: ActivePage): void {
  if (page !== 'home') return;

  const proofIndex = navSections.findIndex((section) => section.id === 'parentProof');
  const projectsIndex = navSections.findIndex((section) => section.id === 'studentProjects');
  if (proofIndex < 0 || projectsIndex < 0 || proofIndex === projectsIndex + 1) return;

  const [proof] = navSections.splice(proofIndex, 1);
  if (proof) navSections.splice(projectsIndex + (proofIndex < projectsIndex ? 0 : 1), 0, proof);
}

function placeDiscoveryClassAfterParentProof(page: ActivePage): void {
  if (page !== 'home') return;

  const discoveryIndex = navSections.findIndex((section) => section.id === 'discoveryClass');
  const proofIndex = navSections.findIndex((section) => section.id === 'parentProof');
  if (discoveryIndex < 0 || proofIndex < 0 || discoveryIndex === proofIndex + 1) return;

  const [discoveryClass] = navSections.splice(discoveryIndex, 1);
  if (discoveryClass)
    navSections.splice(proofIndex + (discoveryIndex < proofIndex ? 0 : 1), 0, discoveryClass);
}

function placeFaqBeforeCta(page: ActivePage): void {
  if (page !== 'home') return;

  const faqIndex = navSections.findIndex((section) => section.id === 'faq');
  const ctaIndex = navSections.findIndex((section) => section.id === 'cta');
  if (faqIndex < 0 || ctaIndex < 0 || faqIndex === ctaIndex - 1) return;

  const [faq] = navSections.splice(faqIndex, 1);
  if (faq) navSections.splice(ctaIndex - (faqIndex < ctaIndex ? 1 : 0), 0, faq);
}

export function useWebsiteEditor() {
  const fetchPageData = async (pageName?: string, locale?: string): Promise<void> => {
    const targetPage: ActivePage = (pageName as ActivePage) || activePage.value || 'home';
    const targetLocale = (locale || editorLocale.value || 'th-TH') as EditorLocale;
    isLoading.value = true;
    error.value = null;

    if (activePage.value !== targetPage) {
      activePage.value = targetPage;
    }
    const initialSections = getFallbackNavSections(targetPage, targetLocale);
    navSections.splice(0, navSections.length, ...initialSections);
    placeCourseMatcherAfterActivityFormats(targetPage);
    placeLearningMethodAfterCourseMatcher(targetPage);
    placeStudentProjectsAfterLearningMethod(targetPage);
    placeParentProofAfterStudentProjects(targetPage);
    placeDiscoveryClassAfterParentProof(targetPage);
    placeFaqBeforeCta(targetPage);
    syncActiveContentToTarget(contentStateMap[targetLocale]);

    try {
      const data = await pageSectionsApiService.getPageData(targetPage, targetLocale);
      if (data.sections) {
        syncStateObjects(contentStateMap[targetLocale], data.sections);
        if (editorLocale.value === targetLocale) {
          syncActiveContentToTarget(contentStateMap[targetLocale]);
        }
      }
      if (data.navSections && Array.isArray(data.navSections) && data.navSections.length > 0) {
        const retiredSectionIds = new Set(['benefits', 'gallery', 'learningJourney', 'activityGallery']);
        navSections.splice(
          0,
          navSections.length,
          ...data.navSections.filter((section) => !retiredSectionIds.has(section.id)),
        );
        // Existing saved navigation predates newer built-in landing sections.
        // Keep the editor's saved order, while making those sections visible after an upgrade.
        const existingIds = new Set(navSections.map((section) => section.id));
        const missingSections = initialSections.filter((section) => !existingIds.has(section.id));
        if (missingSections.length) {
          const footerIndex = navSections.findIndex((section) => section.id === 'footer');
          navSections.splice(
            footerIndex < 0 ? navSections.length : footerIndex,
            0,
            ...missingSections,
          );
        }
        placeCourseMatcherAfterActivityFormats(targetPage);
        placeLearningMethodAfterCourseMatcher(targetPage);
        placeStudentProjectsAfterLearningMethod(targetPage);
        placeParentProofAfterStudentProjects(targetPage);
        placeDiscoveryClassAfterParentProof(targetPage);
        placeFaqBeforeCta(targetPage);
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
      error.value =
        err instanceof Error ? err.message : 'Database unavailable, using fallback mock';
      const fallback = getFallbackNavSections(targetPage, targetLocale);
      navSections.splice(0, navSections.length, ...fallback);
      syncActiveContentToTarget(contentStateMap[targetLocale]);
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
