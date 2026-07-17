import { IsObject, IsOptional } from 'class-validator';

export class CreatePageSectionDto {
  @IsObject()
  @IsOptional()
  pageSectionInfo?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  pageSectionWhy?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  pageSectionCourse?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  pageSectionDescription?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  pageSectionMap?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  pageSectionEnv?: Record<string, unknown>;
}
