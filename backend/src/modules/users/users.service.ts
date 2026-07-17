import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private generateId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existingEmail = await this.usersRepository.findOne({
      where: { userEmail: dto.userEmail },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingNationalId = await this.usersRepository.findOne({
      where: { netionalId: dto.netionalId },
    });
    if (existingNationalId) {
      throw new ConflictException('National ID already exists');
    }

    let userId = this.generateId();
    let idExists = await this.usersRepository.findOne({ where: { userId } });
    while (idExists) {
      userId = this.generateId();
      idExists = await this.usersRepository.findOne({ where: { userId } });
    }

    const user = this.usersRepository.create({
      ...dto,
      userId,
    });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async update(userId: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(userId);
    if (dto.userEmail && dto.userEmail !== user.userEmail) {
      const existingEmail = await this.usersRepository.findOne({
        where: { userEmail: dto.userEmail },
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    if (dto.netionalId && dto.netionalId !== user.netionalId) {
      const existingNationalId = await this.usersRepository.findOne({
        where: { netionalId: dto.netionalId },
      });
      if (existingNationalId) {
        throw new ConflictException('National ID already exists');
      }
    }

    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async remove(userId: string): Promise<User> {
    const user = await this.findOne(userId);
    return this.usersRepository.softRemove(user);
  }
}
