import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePageSectionDto {
  @ApiProperty({ example: 'home', description: 'Page name identifier' })
  @IsString()
  @IsNotEmpty()
  pageName!: string;

  @ApiProperty({ example: 'th-TH', description: 'Locale identifier' })
  @IsString()
  @IsNotEmpty()
  locale!: string;

  @ApiProperty({ example: 'hero', description: 'Section key identifier' })
  @IsString()
  @IsNotEmpty()
  sectionKey!: string;

  @ApiPropertyOptional({ example: 'ส่วนต้อนรับหลัก' })
  @IsString()
  @IsOptional()
  sectionTitle?: string;

  @ApiPropertyOptional({ description: 'Section JSON payload' })
  @IsOptional()
  content?: Record<string, unknown> | Array<unknown> | null;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
