import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CreateChildAccessCodeDto } from './dto/create-child-access-code.dto.js';
import { ChildAccessCodesService } from './child-access-codes.service.js';
import { ChildAccessCode } from './entities/child-access-code.entity.js';

@ApiTags('Child access codes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('child-access-codes')
export class ChildAccessCodesController {
  constructor(private readonly service: ChildAccessCodesService) {}
  @Post()
  @ApiOperation({ summary: 'Create a child access code for a parent' })
  create(@Body() dto: CreateChildAccessCodeDto): Promise<ChildAccessCode> {
    return this.service.create(dto);
  }
}
