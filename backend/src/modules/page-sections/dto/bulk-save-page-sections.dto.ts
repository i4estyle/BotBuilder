import { IsIn, IsObject, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const PAGE_NAMES = ['home', 'promotions', 'courses', 'resources', 'about'];
const LOCALES = ['th-TH', 'en-US'];

export class BulkSavePageSectionsDto {
  @ApiProperty({ example: 'home', enum: PAGE_NAMES })
  @IsIn(PAGE_NAMES)
  pageName!: string;

  @ApiProperty({ example: 'th-TH', enum: LOCALES })
  @IsIn(LOCALES)
  locale!: string;

  @ApiProperty({
    description:
      'Map of section keys to section JSON objects for specified locale',
    example: {
      hero: { titleHighlight: 'Hello' },
      benefits: { heading: 'Why Us' },
    },
  })
  @IsObject()
  sections!: Record<string, Record<string, unknown>>;

  @ApiPropertyOptional({
    description:
      'Deprecated and ignored: only `sections` for the given page and locale is saved',
    deprecated: true,
  })
  @IsObject()
  @IsOptional()
  contentStateMap?: Record<string, Record<string, Record<string, unknown>>>;

  @ApiPropertyOptional({ description: 'Navigation / section ordering list' })
  @IsArray()
  @IsOptional()
  navSections?: Record<string, unknown>[];

  @ApiPropertyOptional({ description: 'Theme settings object' })
  @IsObject()
  @IsOptional()
  themeSettings?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Custom free blocks list' })
  @IsArray()
  @IsOptional()
  customBlocks?: Record<string, unknown>[];

  @ApiPropertyOptional({ description: 'Section free floating blocks list' })
  @IsArray()
  @IsOptional()
  sectionBlocks?: Record<string, unknown>[];

  @ApiPropertyOptional({
    description: 'Inline DOM style overrides and custom typography list',
  })
  @IsArray()
  @IsOptional()
  inlineDomStates?: Record<string, unknown>[];

  @ApiPropertyOptional({
    description: 'Structured style overrides dictionary by element key',
  })
  @IsObject()
  @IsOptional()
  styleOverrides?: Record<string, unknown>;
}
