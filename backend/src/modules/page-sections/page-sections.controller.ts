import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  PageSectionsService,
  PageDataResponse,
} from './page-sections.service.js';
import { CreatePageSectionDto } from './dto/create-page-section.dto.js';
import { UpdatePageSectionDto } from './dto/update-page-section.dto.js';
import { BulkSavePageSectionsDto } from './dto/bulk-save-page-sections.dto.js';
import { PageSectionQueryDto } from './dto/page-section-query.dto.js';
import { PageSection } from './entities/page-section.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('PageSections')
@Controller('page-sections')
export class PageSectionsController {
  constructor(private readonly pageSectionsService: PageSectionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get formatted page sections for page builder or landing page',
  })
  async getPageData(
    @Query() query: PageSectionQueryDto,
  ): Promise<PageDataResponse> {
    return this.pageSectionsService.getPageData(query);
  }

  @Get('list')
  @ApiOperation({ summary: 'List all raw section records' })
  async findAll(): Promise<PageSection[]> {
    return this.pageSectionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single section record by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PageSection> {
    return this.pageSectionsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a single section record' })
  async create(
    @Body() createPageSectionDto: CreatePageSectionDto,
  ): Promise<PageSection> {
    return this.pageSectionsService.create(createPageSectionDto);
  }

  @Post('bulk-save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk save all page builder sections atomically' })
  async bulkSave(
    @Body() bulkSaveDto: BulkSavePageSectionsDto,
  ): Promise<PageDataResponse> {
    return this.pageSectionsService.bulkSave(bulkSaveDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update single section record by ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePageSectionDto: UpdatePageSectionDto,
  ): Promise<PageSection> {
    return this.pageSectionsService.update(id, updatePageSectionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete single section record by ID' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<PageSection> {
    return this.pageSectionsService.remove(id);
  }
}
