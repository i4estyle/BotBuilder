import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BulkSavePageSectionsDto {
  @ApiProperty({ example: 'home' })
  @IsString()
  @IsNotEmpty()
  pageName!: string;

  @ApiProperty({ example: 'th-TH' })
  @IsString()
  @IsNotEmpty()
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
      'Optional map of full content state by locale key e.g. th-TH, en-US',
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
