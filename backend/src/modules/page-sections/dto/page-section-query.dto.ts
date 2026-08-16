import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PageSectionQueryDto {
  @ApiPropertyOptional({ example: 'home', default: 'home' })
  @IsString()
  @IsOptional()
  pageName?: string = 'home';

  @ApiPropertyOptional({ example: 'th-TH', default: 'th-TH' })
  @IsString()
  @IsOptional()
  locale?: string = 'th-TH';
}
