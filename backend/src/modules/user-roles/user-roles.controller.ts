import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRolesService } from './user-roles.service.js';
import { CreateUserRoleDto } from './dto/create-user-role.dto.js';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';
import { UserRole } from './entities/user-role.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('UserRoles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  async create(
    @Body() createUserRoleDto: CreateUserRoleDto,
  ): Promise<UserRole> {
    return this.userRolesService.create(createUserRoleDto);
  }

  @Get()
  async findAll(): Promise<UserRole[]> {
    return this.userRolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserRole> {
    return this.userRolesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<UserRole> {
    return this.userRolesService.update(id, updateUserRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userRolesService.remove(id);
  }
}
