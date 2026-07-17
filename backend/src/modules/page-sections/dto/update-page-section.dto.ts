import { PartialType } from '@nestjs/swagger';
import { CreatePageSectionDto } from './create-page-section.dto.js';

export class UpdatePageSectionDto extends PartialType(CreatePageSectionDto) {}
