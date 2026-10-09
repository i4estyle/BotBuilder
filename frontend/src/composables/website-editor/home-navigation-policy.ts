import type { ActivePage, SectionNavItem } from './types';

interface PlaceAfterSectionRule {
  sectionId: string;
  afterSectionId: string;
}

interface PlaceBeforeSectionRule {
  sectionId: string;
  beforeSectionId: string;
}

type SectionPlacementRule = PlaceAfterSectionRule | PlaceBeforeSectionRule;

const HOME_SECTION_PLACEMENT_RULES: SectionPlacementRule[] = [
  { sectionId: 'courseMatcher', afterSectionId: 'activityFormats' },
  { sectionId: 'learningMethod', afterSectionId: 'courseMatcher' },
  { sectionId: 'studentProjects', afterSectionId: 'learningMethod' },
  { sectionId: 'parentProof', afterSectionId: 'studentProjects' },
  { sectionId: 'discoveryClass', afterSectionId: 'parentProof' },
  { sectionId: 'faq', beforeSectionId: 'cta' },
];

function placeSectionAfter(
  sections: SectionNavItem[],
  sectionId: string,
  afterSectionId: string,
): void {
  const sectionIndex = sections.findIndex((section) => section.id === sectionId);
  const referenceIndex = sections.findIndex((section) => section.id === afterSectionId);

  if (sectionIndex < 0 || referenceIndex < 0 || sectionIndex === referenceIndex + 1) return;

  const [section] = sections.splice(sectionIndex, 1);
  if (section) {
    const insertIndex = referenceIndex + (sectionIndex < referenceIndex ? 0 : 1);
    sections.splice(insertIndex, 0, section);
  }
}

function placeSectionBefore(
  sections: SectionNavItem[],
  sectionId: string,
  beforeSectionId: string,
): void {
  const sectionIndex = sections.findIndex((section) => section.id === sectionId);
  const referenceIndex = sections.findIndex((section) => section.id === beforeSectionId);

  if (sectionIndex < 0 || referenceIndex < 0 || sectionIndex === referenceIndex - 1) return;

  const [section] = sections.splice(sectionIndex, 1);
  if (section) {
    const insertIndex = referenceIndex - (sectionIndex < referenceIndex ? 1 : 0);
    sections.splice(insertIndex, 0, section);
  }
}

export function applyHomeNavigationPolicy(page: ActivePage, sections: SectionNavItem[]): void {
  if (page !== 'home') return;

  HOME_SECTION_PLACEMENT_RULES.forEach((rule) => {
    if ('afterSectionId' in rule) {
      placeSectionAfter(sections, rule.sectionId, rule.afterSectionId);
      return;
    }

    placeSectionBefore(sections, rule.sectionId, rule.beforeSectionId);
  });
}
