export * from './website-editor/types';
export * from './website-editor/defaults';
export * from './website-editor/state';
export * from './website-editor/history';
export * from './website-editor/nav';
export * from './website-editor/content-mutations';
export * from './website-editor/free-blocks';
export * from './website-editor/style-overrides';
export * from './website-editor/custom-sections';

import { computed, effectScope, nextTick, watch } from 'vue';
import type {
  ActivePage,
  EditorLocale,
  PageDataResponse,
  SectionNavItem,
} from './website-editor/types';

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
  isDirty,
  error,
  isMobileNavOpen,
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
  clearHistory,
} from './website-editor/history';
import {
  setActivePage,
  saveCurrentStateToMap,
  syncActiveContentToTarget,
  addCustomSection,
  duplicateCustomSection,
  toggleSectionHidden,
  syncCustomSectionTitle,
  LOCKED_SECTION_IDS,
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
import { applyHomeNavigationPolicy } from './website-editor/home-navigation-policy';
import { pageSectionsApiService } from '@/services/page-sections-api.service';
import { APP_CONTENT_READY_EVENT } from '@/constants/loading-constants';

const liveSyncChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('botbuilder-live-sync')
    : null;

/**
 * Content keys owned by each page. Saving sends only these (plus the shared header and
 * footer), so saving one page can never overwrite another page with stale in-memory data.
 */
const SHARED_SECTION_KEYS = ['header', 'footer'];
const PAGE_SECTION_KEYS: Record<ActivePage, string[]> = {
  home: [
    'hero',
    'benefits',
    'activityFormats',
    'gallery',
    'activityGallery',
    'quiz',
    'branches',
    'cta',
  ],
  promotions: ['promotionsPage'],
  courses: ['coursesPage'],
  resources: ['resourcesPage'],
  about: ['aboutPage'],
};

function pickPageSections(
  page: ActivePage,
  state: ReturnType<typeof createInitialState>,
): Record<string, unknown> {
  const source = state as unknown as Record<string, unknown>;
  const keys = [...SHARED_SECTION_KEYS, ...(PAGE_SECTION_KEYS[page] || [])];
  return Object.fromEntries(keys.filter((key) => key in source).map((key) => [key, source[key]]));
}

const RETIRED_SECTION_IDS = new Set(['benefits', 'gallery', 'learningJourney', 'activityGallery']);

// Dirty tracking: any change the admin makes after a load or save marks the editor dirty.
let dirtyTrackingSuspended = 0;
let dirtyWatcherStarted = false;

function startDirtyTracking(): void {
  if (dirtyWatcherStarted) return;
  dirtyWatcherStarted = true;
  // Detached scope: the editor state is module-level, so the watcher must outlive whichever
  // component happened to call useWebsiteEditor() first (e.g. a public page).
  effectScope(true).run(() => {
    watch(
      () => [contentState, navSections, customBlocks, sectionBlocks, styleOverrides, themeSettings],
      () => {
        if (dirtyTrackingSuspended === 0 && editMode.value === 'edit') {
          isDirty.value = true;
        }
      },
      { deep: true },
    );
  });
}

function markDirty(): void {
  if (editMode.value === 'edit') isDirty.value = true;
}

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

function applyPageData(
  targetPage: ActivePage,
  targetLocale: EditorLocale,
  data: PageDataResponse,
  initialSections: SectionNavItem[],
): void {
  if (data.sections) {
    syncStateObjects(contentStateMap[targetLocale], data.sections);
    if (editorLocale.value === targetLocale) {
      syncActiveContentToTarget(contentStateMap[targetLocale]);
    }
  }
  if (data.customBlocks && Array.isArray(data.customBlocks)) {
    customBlocks.splice(0, customBlocks.length, ...data.customBlocks);
  }
  if (data.navSections && Array.isArray(data.navSections) && data.navSections.length > 0) {
    const customIds = new Set(customBlocks.map((block) => block.id));
    navSections.splice(
      0,
      navSections.length,
      ...data.navSections.filter(
        (section) =>
          !RETIRED_SECTION_IDS.has(section.id) &&
          // Drop orphaned custom entries whose content no longer exists.
          (!section.isCustomPage || customIds.has(section.id)),
      ),
    );
    // Existing saved navigation predates newer built-in landing sections.
    // Keep the editor's saved order, while making those sections visible after an upgrade.
    const existingIds = new Set(navSections.map((section) => section.id));
    const missingSections = initialSections.filter((section) => !existingIds.has(section.id));
    if (missingSections.length) {
      const footerIndex = navSections.findIndex((section) => section.id === 'footer');
      navSections.splice(footerIndex < 0 ? navSections.length : footerIndex, 0, ...missingSections);
    }
    applyHomeNavigationPolicy(targetPage, navSections);
  }
  if (data.themeSettings) {
    Object.assign(themeSettings, data.themeSettings);
  }
  if (data.sectionBlocks && Array.isArray(data.sectionBlocks)) {
    sectionBlocks.splice(0, sectionBlocks.length, ...data.sectionBlocks);
  }
  if (data.styleOverrides && typeof data.styleOverrides === 'object') {
    clearStyleOverrides();
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
}

export function useWebsiteEditor() {
  startDirtyTracking();

  const fetchPageData = async (pageName?: string, locale?: string): Promise<void> => {
    const targetPage: ActivePage = (pageName as ActivePage) || activePage.value || 'home';
    const targetLocale = (locale || editorLocale.value || 'th-TH') as EditorLocale;
    isLoading.value = true;
    error.value = null;
    dirtyTrackingSuspended++;

    try {
      if (activePage.value !== targetPage) {
        activePage.value = targetPage;
      }
      const initialSections = getFallbackNavSections(targetPage, targetLocale);
      navSections.splice(0, navSections.length, ...initialSections);
      applyHomeNavigationPolicy(targetPage, navSections);
      syncActiveContentToTarget(contentStateMap[targetLocale]);
      // Page-scoped data must not leak from the previously opened page into this one,
      // otherwise it would be saved under the wrong page.
      customBlocks.splice(0, customBlocks.length);
      sectionBlocks.splice(0, sectionBlocks.length);
      clearPageStyleOverrides(true);

      try {
        const data = await pageSectionsApiService.getPageData(targetPage, targetLocale);
        applyPageData(targetPage, targetLocale, data, initialSections);
      } catch (err: unknown) {
        error.value =
          err instanceof Error ? err.message : 'Database unavailable, using fallback mock';
        const fallback = getFallbackNavSections(targetPage, targetLocale);
        navSections.splice(0, navSections.length, ...fallback);
        syncActiveContentToTarget(contentStateMap[targetLocale]);
      }
    } finally {
      clearHistory();
      isLoading.value = false;
      // Let the deep watcher see the programmatic changes before tracking resumes.
      await nextTick();
      dirtyTrackingSuspended--;
      isDirty.value = false;
      window.dispatchEvent(
        new CustomEvent(APP_CONTENT_READY_EVENT, {
          detail: { pageName: targetPage, locale: targetLocale },
        }),
      );
    }
  };

  const setEditorLocale = async (newLocale: EditorLocale): Promise<void> => {
    if (editorLocale.value === newLocale) return;
    saveCurrentStateToMap();
    editorLocale.value = newLocale;
    syncActiveContentToTarget(contentStateMap[newLocale]);
    try {
      localStorage.setItem('botbuilder-locale', newLocale);
    } catch {
      // Storage can be unavailable (private mode); the locale still applies for this session.
    }
    await fetchPageData(activePage.value, newLocale);
  };

  const saveToBackend = async (): Promise<boolean> => {
    saveCurrentStateToMap();
    isSaving.value = true;
    error.value = null;
    const pageName: ActivePage = activePage.value || 'home';
    const locale = editorLocale.value;

    try {
      await pageSectionsApiService.bulkSave({
        pageName,
        locale,
        sections: pickPageSections(pageName, contentStateMap[locale]),
        navSections,
        themeSettings,
        customBlocks,
        sectionBlocks,
        inlineDomStates: captureInlineDomStates(),
        styleOverrides,
      });
      isDirty.value = false;

      liveSyncChannel?.postMessage({
        type: 'content-saved',
        pageName,
        locale,
        timestamp: Date.now(),
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('website-content-saved', { detail: { pageName, locale } }),
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

  /** Restores the current page (in the current language) to its default content. */
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
    applyHomeNavigationPolicy(activePage.value, navSections);
    themeSettings.primaryColor = '#c00000';
    themeSettings.accentColor = '#1c871e';
    activeSectionId.value = '';
    selectedBlockId.value = '';
    window.dispatchEvent(new CustomEvent('editor-state-reset'));
    markDirty();
  };

  const selectActivePage = async (page: ActivePage): Promise<void> => {
    setActivePage(page);
    await fetchPageData(page, editorLocale.value);
  };

  const visibleNavSections = computed(() => navSections.filter((section) => !section.hidden));

  const toggleMobileNav = (): void => {
    isMobileNavOpen.value = !isMobileNavOpen.value;
  };

  return {
    isMobileNavOpen,
    toggleMobileNav,
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
    visibleNavSections,
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
    isDirty,
    markDirty,
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
    addCustomSection,
    duplicateCustomSection,
    toggleSectionHidden,
    syncCustomSectionTitle,
    lockedSectionIds: LOCKED_SECTION_IDS,
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
