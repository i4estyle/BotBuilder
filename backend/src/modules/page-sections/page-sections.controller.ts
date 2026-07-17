import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PageSectionsService } from './page-sections.service.js';
import { CreatePageSectionDto } from './dto/create-page-section.dto.js';
import { UpdatePageSectionDto } from './dto/update-page-section.dto.js';
import { PageSection } from './entities/page-section.entity.js';

@ApiTags('PageSections')
@Controller('page-sections')
export class PageSectionsController {
  constructor(private readonly pageSectionsService: PageSectionsService) {}

  @Post()
  async create(
    @Body() createPageSectionDto: CreatePageSectionDto,
  ): Promise<PageSection> {
    return this.pageSectionsService.create(createPageSectionDto);
  }

  @Get()
  async findAll(): Promise<PageSection[]> {
    return this.pageSectionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PageSection> {
    return this.pageSectionsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePageSectionDto: UpdatePageSectionDto,
  ): Promise<PageSection> {
    return this.pageSectionsService.update(id, updatePageSectionDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<PageSection> {
    return this.pageSectionsService.remove(id);
  }
}
