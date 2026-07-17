import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './entities/user-role.entity.js';
import { CreateUserRoleDto } from './dto/create-user-role.dto.js';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';
import { User } from '../users/entities/user.entity.js';
import { Role } from '../roles/entities/role.entity.js';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async create(dto: CreateUserRoleDto): Promise<UserRole> {
    const user = await this.usersRepository.findOne({
      where: { userId: dto.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    const role = await this.rolesRepository.findOne({
      where: { roleId: dto.roleId },
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${dto.roleId} not found`);
    }

    const existing = await this.userRolesRepository.findOne({
      where: { userId: dto.userId, roleId: dto.roleId },
    });
    if (existing) {
      throw new ConflictException('User already has this role');
    }

    const userRole = this.userRolesRepository.create(dto);
    return this.userRolesRepository.save(userRole);
  }

  async findAll(): Promise<UserRole[]> {
    return this.userRolesRepository.find({
      relations: { user: true, role: true },
    });
  }

  async findOne(userRoleId: number): Promise<UserRole> {
    const userRole = await this.userRolesRepository.findOne({
      where: { userRoleId },
      relations: { user: true, role: true },
    });
    if (!userRole) {
      throw new NotFoundException(
        `UserRole connection with ID ${userRoleId} not found`,
      );
    }
    return userRole;
  }

  async update(userRoleId: number, dto: UpdateUserRoleDto): Promise<UserRole> {
    const userRole = await this.findOne(userRoleId);

    if (dto.userId) {
      const user = await this.usersRepository.findOne({
        where: { userId: dto.userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${dto.userId} not found`);
      }
    }

    if (dto.roleId) {
      const role = await this.rolesRepository.findOne({
        where: { roleId: dto.roleId },
      });
      if (!role) {
        throw new NotFoundException(`Role with ID ${dto.roleId} not found`);
      }
    }

    const targetUserId = dto.userId || userRole.userId;
    const targetRoleId = dto.roleId || userRole.roleId;

    if (dto.userId || dto.roleId) {
      const existing = await this.userRolesRepository.findOne({
        where: { userId: targetUserId, roleId: targetRoleId },
      });
      if (existing && existing.userRoleId !== userRoleId) {
        throw new ConflictException('User already has this role');
      }
    }

    Object.assign(userRole, dto);
    return this.userRolesRepository.save(userRole);
  }

  async remove(userRoleId: number): Promise<void> {
    const userRole = await this.findOne(userRoleId);
    await this.userRolesRepository.remove(userRole);
  }
}
