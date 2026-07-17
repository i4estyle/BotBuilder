import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageSection } from './entities/page-section.entity.js';
import { CreatePageSectionDto } from './dto/create-page-section.dto.js';
import { UpdatePageSectionDto } from './dto/update-page-section.dto.js';

@Injectable()
export class PageSectionsService {
  constructor(
    @InjectRepository(PageSection)
    private readonly pageSectionsRepository: Repository<PageSection>,
  ) {}

  async create(dto: CreatePageSectionDto): Promise<PageSection> {
    const pageSection = this.pageSectionsRepository.create(dto);
    return this.pageSectionsRepository.save(pageSection);
  }

  async findAll(): Promise<PageSection[]> {
    return this.pageSectionsRepository.find();
  }

  async findOne(pageId: number): Promise<PageSection> {
    const pageSection = await this.pageSectionsRepository.findOne({
      where: { pageId },
    });
    if (!pageSection) {
      throw new NotFoundException(`PageSection with ID ${pageId} not found`);
    }
    return pageSection;
  }

  async update(
    pageId: number,
    dto: UpdatePageSectionDto,
  ): Promise<PageSection> {
    const pageSection = await this.findOne(pageId);
    Object.assign(pageSection, dto);
    return this.pageSectionsRepository.save(pageSection);
  }

  async remove(pageId: number): Promise<PageSection> {
    const pageSection = await this.findOne(pageId);
    return this.pageSectionsRepository.softRemove(pageSection);
  }
}
