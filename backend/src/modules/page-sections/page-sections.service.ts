import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { existsSync, unlinkSync } from 'fs';
import * as path from 'path';
import { PageSection } from './entities/page-section.entity.js';
import { CreatePageSectionDto } from './dto/create-page-section.dto.js';
import { UpdatePageSectionDto } from './dto/update-page-section.dto.js';
import { BulkSavePageSectionsDto } from './dto/bulk-save-page-sections.dto.js';
import { PageSectionQueryDto } from './dto/page-section-query.dto.js';
import {
  DEFAULT_NAV_SECTIONS,
  DEFAULT_PAGE_NAV_SECTIONS,
  DEFAULT_THEME_SETTINGS,
  DEFAULT_SECTIONS_TH,
  DEFAULT_SECTIONS_EN,
} from './constants/default-page-sections.constant.js';

export interface PageDataResponse {
  pageName: string;
  locale: string;
  sections: Record<string, Record<string, unknown>>;
  navSections: Record<string, unknown>[];
  themeSettings: Record<string, unknown>;
  customBlocks: Record<string, unknown>[];
  sectionBlocks: Record<string, unknown>[];
  inlineDomStates: Record<string, unknown>[];
  styleOverrides: Record<string, unknown>;
}

const SECTION_PAGE_MAP: Record<string, string> = {
  hero: 'home',
  benefits: 'home',
  activityFormats: 'home',
  gallery: 'home',
  activityGallery: 'home',
  quiz: 'home',
  branches: 'home',
  promotionsPage: 'promotions',
  coursesPage: 'courses',
  resourcesPage: 'resources',
  aboutPage: 'about',
};

const ALL_PAGES: string[] = [
  'home',
  'promotions',
  'courses',
  'resources',
  'about',
];

@Injectable()
export class PageSectionsService {
  constructor(
    @InjectRepository(PageSection)
    private readonly pageSectionsRepository: Repository<PageSection>,
    private readonly dataSource: DataSource,
  ) {}

  async getPageData(query: PageSectionQueryDto): Promise<PageDataResponse> {
    const pageName = query.pageName || 'home';
    const locale = query.locale || 'th-TH';

    let records = await this.pageSectionsRepository.find({
      where: { pageName, locale, isActive: true },
      order: { sortOrder: 'ASC' },
    });

    if (records.length === 0) {
      await this.seedDefaultSectionsForPage(pageName, locale);
      records = await this.pageSectionsRepository.find({
        where: { pageName, locale, isActive: true },
        order: { sortOrder: 'ASC' },
      });
    }

    const sections: Record<string, Record<string, unknown>> = {};
    let navSections: Record<string, unknown>[] =
      DEFAULT_PAGE_NAV_SECTIONS[pageName] || DEFAULT_NAV_SECTIONS;
    let themeSettings: Record<string, unknown> = DEFAULT_THEME_SETTINGS;
    let customBlocks: Record<string, unknown>[] = [];
    let sectionBlocks: Record<string, unknown>[] = [];
    let inlineDomStates: Record<string, unknown>[] = [];
    let styleOverrides: Record<string, unknown> = {};

    records.forEach((record) => {
      if (record.sectionKey === 'navSections') {
        if (Array.isArray(record.content) && record.content.length > 0) {
          navSections = record.content as Record<string, unknown>[];
        }
      } else if (record.sectionKey === 'themeSettings') {
        if (record.content && typeof record.content === 'object') {
          themeSettings = record.content as Record<string, unknown>;
        }
      } else if (record.sectionKey === 'customBlocks') {
        if (Array.isArray(record.content)) {
          customBlocks = record.content as Record<string, unknown>[];
        }
      } else if (record.sectionKey === 'sectionBlocks') {
        if (Array.isArray(record.content)) {
          sectionBlocks = record.content as Record<string, unknown>[];
        }
      } else if (record.sectionKey === 'inlineDomStates') {
        if (Array.isArray(record.content)) {
          inlineDomStates = record.content as Record<string, unknown>[];
        }
      } else if (record.sectionKey === 'styleOverrides') {
        if (
          record.content &&
          typeof record.content === 'object' &&
          !Array.isArray(record.content)
        ) {
          styleOverrides = record.content;
        }
      } else {
        if (
          record.content &&
          typeof record.content === 'object' &&
          !Array.isArray(record.content)
        ) {
          sections[record.sectionKey] = record.content;
        }
      }
    });

    if (pageName !== 'home') {
      const homeRecords = await this.pageSectionsRepository.find({
        where: { pageName: 'home', locale, isActive: true },
      });
      homeRecords.forEach((hr) => {
        if (hr.sectionKey === 'header' && !sections.header) {
          sections.header = hr.content as Record<string, unknown>;
        } else if (hr.sectionKey === 'footer' && !sections.footer) {
          sections.footer = hr.content as Record<string, unknown>;
        } else if (
          hr.sectionKey === 'styleOverrides' &&
          hr.content &&
          typeof hr.content === 'object' &&
          !Array.isArray(hr.content)
        ) {
          const homeStyles = hr.content;
          Object.entries(homeStyles).forEach(([k, v]) => {
            if (
              (k.startsWith('header.') || k.startsWith('footer.')) &&
              !styleOverrides[k]
            ) {
              styleOverrides[k] = v;
            }
          });
        } else if (
          hr.sectionKey === 'sectionBlocks' &&
          Array.isArray(hr.content)
        ) {
          const globalBlocks = (hr.content as Record<string, unknown>[]).filter(
            (b) => b.sectionId === 'header' || b.sectionId === 'footer',
          );
          globalBlocks.forEach((gb) => {
            if (!sectionBlocks.some((sb) => sb.id === gb.id)) {
              sectionBlocks.push(gb);
            }
          });
        }
      });
    }

    return {
      pageName,
      locale,
      sections,
      navSections,
      themeSettings,
      customBlocks,
      sectionBlocks,
      inlineDomStates,
      styleOverrides,
    };
  }

  async bulkSave(dto: BulkSavePageSectionsDto): Promise<PageDataResponse> {
    const pageName = dto.pageName;
    const locale = dto.locale;

    const oldRecords = await this.pageSectionsRepository.find({
      where: { isActive: true },
    });

    const oldFilenames = new Set<string>();
    oldRecords.forEach((record) => {
      this.extractUploadFilenames(record.content, oldFilenames);
    });

    await this.dataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const existingList = await transactionalEntityManager.find(
          PageSection,
          {
            where: { isActive: true },
          },
        );

        const recordMap = new Map<string, PageSection>();
        existingList.forEach((r) => {
          recordMap.set(`${r.pageName}:${r.locale}:${r.sectionKey}`, r);
        });

        const entitiesToSave = new Map<string, PageSection>();

        if (dto.contentStateMap) {
          for (const [locKey, locSections] of Object.entries(
            dto.contentStateMap,
          )) {
            this.collectSectionsMap(
              transactionalEntityManager,
              recordMap,
              entitiesToSave,
              pageName,
              locKey,
              locSections,
            );
          }
        }

        if (dto.sections) {
          this.collectSectionsMap(
            transactionalEntityManager,
            recordMap,
            entitiesToSave,
            pageName,
            locale,
            dto.sections,
          );
        }

        if (dto.navSections) {
          this.collectMetaSection(
            transactionalEntityManager,
            recordMap,
            entitiesToSave,
            pageName,
            locale,
            'navSections',
            dto.navSections,
          );
        }

        if (dto.themeSettings) {
          this.collectMetaSection(
            transactionalEntityManager,
            recordMap,
            entitiesToSave,
            pageName,
            locale,
            'themeSettings',
            dto.themeSettings,
          );
        }

        if (dto.customBlocks) {
          this.collectMetaSection(
            transactionalEntityManager,
            recordMap,
            entitiesToSave,
            pageName,
            locale,
            'customBlocks',
            dto.customBlocks,
          );
        }

        if (dto.sectionBlocks) {
          this.collectMetaSection(
            transactionalEntityManager,
            recordMap,
            entitiesToSave,
            pageName,
            locale,
            'sectionBlocks',
            dto.sectionBlocks,
          );
        }

        if (dto.inlineDomStates) {
          this.collectMetaSection(
            transactionalEntityManager,
            recordMap,
            entitiesToSave,
            pageName,
            locale,
            'inlineDomStates',
            dto.inlineDomStates,
          );
        }

        if (dto.styleOverrides) {
          this.collectMetaSection(
            transactionalEntityManager,
            recordMap,
            entitiesToSave,
            pageName,
            locale,
            'styleOverrides',
            dto.styleOverrides,
          );
        }

        if (entitiesToSave.size > 0) {
          await transactionalEntityManager.save(
            PageSection,
            Array.from(entitiesToSave.values()),
          );
        }
      },
    );

    const newRecords = await this.pageSectionsRepository.find({
      where: { isActive: true },
    });

    const newFilenames = new Set<string>();
    newRecords.forEach((record) => {
      this.extractUploadFilenames(record.content, newFilenames);
    });

    this.cleanupOrphanedImages(oldFilenames, newFilenames);

    return this.getPageData({ pageName, locale });
  }

  private extractUploadFilenames(data: unknown, results: Set<string>): void {
    if (!data) return;

    if (typeof data === 'string') {
      const match = data.match(
        /\/uploads\/images\/([a-zA-Z0-9_\-.]+\.(?:png|jpg|jpeg|webp|gif|svg))/i,
      );
      if (match && match[1]) {
        results.add(path.basename(match[1]));
      }
    } else if (Array.isArray(data)) {
      for (const item of data) {
        this.extractUploadFilenames(item, results);
      }
    } else if (typeof data === 'object') {
      for (const value of Object.values(data as Record<string, unknown>)) {
        this.extractUploadFilenames(value, results);
      }
    }
  }

  private cleanupOrphanedImages(
    oldFilenames: Set<string>,
    newFilenames: Set<string>,
  ): void {
    const uploadDir = path.join(process.cwd(), 'uploads', 'images');
    oldFilenames.forEach((filename) => {
      if (!newFilenames.has(filename)) {
        const safeFilename = path.basename(filename);
        const filePath = path.join(uploadDir, safeFilename);
        if (existsSync(filePath)) {
          try {
            unlinkSync(filePath);
          } catch (err: unknown) {
            console.error(
              `Failed to delete orphaned image: ${safeFilename}`,
              err,
            );
          }
        }
      }
    });
  }

  private collectSectionsMap(
    manager: EntityManager,
    recordMap: Map<string, PageSection>,
    entitiesToSave: Map<string, PageSection>,
    defaultPageName: string,
    locale: string,
    sectionsMap: Record<string, Record<string, unknown>>,
  ): void {
    for (const page of ALL_PAGES) {
      let sortOrder = 0;
      for (const [sectionKey, content] of Object.entries(sectionsMap)) {
        const targetPageName = SECTION_PAGE_MAP[sectionKey] || defaultPageName;
        const isSharedSection = ['header', 'cta', 'footer'].includes(
          sectionKey,
        );

        if (targetPageName === page || isSharedSection) {
          const mapKey = `${page}:${locale}:${sectionKey}`;
          let existing = entitiesToSave.get(mapKey) || recordMap.get(mapKey);

          if (existing) {
            existing.content = content;
            existing.sortOrder = sortOrder;
            existing.isActive = true;
          } else {
            existing = manager.create(PageSection, {
              pageName: page,
              locale,
              sectionKey,
              content,
              sortOrder,
              isActive: true,
            });
            recordMap.set(mapKey, existing);
          }
          entitiesToSave.set(mapKey, existing);
          sortOrder++;
        }
      }
    }
  }

  private collectMetaSection(
    manager: EntityManager,
    recordMap: Map<string, PageSection>,
    entitiesToSave: Map<string, PageSection>,
    pageName: string,
    locale: string,
    sectionKey: string,
    content: unknown,
  ): void {
    if (sectionKey === 'themeSettings') {
      for (const targetPage of ALL_PAGES) {
        const mapKey = `${targetPage}:${locale}:${sectionKey}`;
        let existing = entitiesToSave.get(mapKey) || recordMap.get(mapKey);

        if (existing) {
          existing.content = content as
            Record<string, unknown> | Array<unknown>;
          existing.isActive = true;
        } else {
          existing = manager.create(PageSection, {
            pageName: targetPage,
            locale,
            sectionKey,
            content: content as Record<string, unknown> | Array<unknown>,
            sortOrder: 999,
            isActive: true,
          });
          recordMap.set(mapKey, existing);
        }
        entitiesToSave.set(mapKey, existing);
      }
      return;
    }

    if (sectionKey === 'styleOverrides') {
      const incomingOverrides =
        content && typeof content === 'object' && !Array.isArray(content)
          ? (content as Record<string, unknown>)
          : {};

      const globalOverrides: Record<string, unknown> = {};
      Object.entries(incomingOverrides).forEach(([k, v]) => {
        if (k.startsWith('header.') || k.startsWith('footer.')) {
          globalOverrides[k] = v;
        }
      });

      for (const targetPage of ALL_PAGES) {
        const mapKey = `${targetPage}:${locale}:${sectionKey}`;
        let existing = entitiesToSave.get(mapKey) || recordMap.get(mapKey);

        let finalContent: Record<string, unknown>;
        if (targetPage === pageName) {
          finalContent = { ...incomingOverrides };
        } else {
          const prev =
            existing &&
            existing.content &&
            typeof existing.content === 'object' &&
            !Array.isArray(existing.content)
              ? existing.content
              : {};
          finalContent = { ...prev, ...globalOverrides };
        }

        if (existing) {
          existing.content = finalContent;
          existing.isActive = true;
        } else {
          existing = manager.create(PageSection, {
            pageName: targetPage,
            locale,
            sectionKey,
            content: finalContent,
            sortOrder: 999,
            isActive: true,
          });
          recordMap.set(mapKey, existing);
        }
        entitiesToSave.set(mapKey, existing);
      }
      return;
    }

    if (sectionKey === 'sectionBlocks') {
      const incomingBlocks = Array.isArray(content)
        ? (content as Record<string, unknown>[])
        : [];
      const globalBlocks = incomingBlocks.filter(
        (b) => b.sectionId === 'header' || b.sectionId === 'footer',
      );

      for (const targetPage of ALL_PAGES) {
        const mapKey = `${targetPage}:${locale}:${sectionKey}`;
        let existing = entitiesToSave.get(mapKey) || recordMap.get(mapKey);

        let finalBlocks: Record<string, unknown>[];
        if (targetPage === pageName) {
          finalBlocks = incomingBlocks;
        } else {
          const prevBlocks =
            existing && Array.isArray(existing.content)
              ? (existing.content as Record<string, unknown>[])
              : [];
          const localBlocks = prevBlocks.filter(
            (b) => b.sectionId !== 'header' && b.sectionId !== 'footer',
          );
          finalBlocks = [...localBlocks, ...globalBlocks];
        }

        if (existing) {
          existing.content = finalBlocks;
          existing.isActive = true;
        } else {
          existing = manager.create(PageSection, {
            pageName: targetPage,
            locale,
            sectionKey,
            content: finalBlocks,
            sortOrder: 999,
            isActive: true,
          });
          recordMap.set(mapKey, existing);
        }
        entitiesToSave.set(mapKey, existing);
      }
      return;
    }

    const mapKey = `${pageName}:${locale}:${sectionKey}`;
    let existing = entitiesToSave.get(mapKey) || recordMap.get(mapKey);

    if (existing) {
      existing.content = content as Record<string, unknown> | Array<unknown>;
      existing.isActive = true;
    } else {
      existing = manager.create(PageSection, {
        pageName,
        locale,
        sectionKey,
        content: content as Record<string, unknown> | Array<unknown>,
        sortOrder: 999,
        isActive: true,
      });
      recordMap.set(mapKey, existing);
    }
    entitiesToSave.set(mapKey, existing);
  }

  private async seedDefaultSectionsForPage(
    pageName: string,
    locale: string,
  ): Promise<void> {
    const dataSourceMap =
      locale === 'en-US'
        ? DEFAULT_SECTIONS_EN[pageName]
        : DEFAULT_SECTIONS_TH[pageName];

    if (!dataSourceMap) {
      return;
    }

    let sortOrder = 0;
    for (const [sectionKey, content] of Object.entries(dataSourceMap)) {
      const section = this.pageSectionsRepository.create({
        pageName,
        locale,
        sectionKey,
        content,
        sortOrder: sortOrder++,
        isActive: true,
      });
      await this.pageSectionsRepository.save(section);
    }

    const defaultNav =
      DEFAULT_PAGE_NAV_SECTIONS[pageName] || DEFAULT_NAV_SECTIONS;
    const navMeta = this.pageSectionsRepository.create({
      pageName,
      locale,
      sectionKey: 'navSections',
      content: defaultNav,
      sortOrder: 999,
      isActive: true,
    });
    await this.pageSectionsRepository.save(navMeta);

    const themeMeta = this.pageSectionsRepository.create({
      pageName,
      locale,
      sectionKey: 'themeSettings',
      content: DEFAULT_THEME_SETTINGS,
      sortOrder: 999,
      isActive: true,
    });
    await this.pageSectionsRepository.save(themeMeta);
  }

  async create(dto: CreatePageSectionDto): Promise<PageSection> {
    const pageSection = this.pageSectionsRepository.create(dto);
    return this.pageSectionsRepository.save(pageSection);
  }

  async findAll(): Promise<PageSection[]> {
    return this.pageSectionsRepository.find({
      order: { sortOrder: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PageSection> {
    const pageSection = await this.pageSectionsRepository.findOne({
      where: { id },
    });
    if (!pageSection) {
      throw new NotFoundException(`PageSection with ID ${id} not found`);
    }
    return pageSection;
  }

  async update(id: number, dto: UpdatePageSectionDto): Promise<PageSection> {
    const pageSection = await this.findOne(id);
    Object.assign(pageSection, dto);
    return this.pageSectionsRepository.save(pageSection);
  }

  async remove(id: number): Promise<PageSection> {
    const pageSection = await this.findOne(id);
    return this.pageSectionsRepository.softRemove(pageSection);
  }
}
