import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  private generateId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.rolesRepository.findOne({
      where: { roleName: dto.roleName },
    });
    if (existingRole) {
      throw new ConflictException('Role name already exists');
    }

    let roleId = this.generateId();
    let idExists = await this.rolesRepository.findOne({ where: { roleId } });
    while (idExists) {
      roleId = this.generateId();
      idExists = await this.rolesRepository.findOne({ where: { roleId } });
    }

    const role = this.rolesRepository.create({
      ...dto,
      roleId,
    });
    return this.rolesRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async findOne(roleId: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }
    return role;
  }

  async update(roleId: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(roleId);
    if (dto.roleName && dto.roleName !== role.roleName) {
      const existingRole = await this.rolesRepository.findOne({
        where: { roleName: dto.roleName },
      });
      if (existingRole) {
        throw new ConflictException('Role name already exists');
      }
    }

    Object.assign(role, dto);
    return this.rolesRepository.save(role);
  }

  async remove(roleId: string): Promise<void> {
    const role = await this.findOne(roleId);
    await this.rolesRepository.remove(role);
  }
}
