import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChildAccessCodeDto } from './dto/create-child-access-code.dto.js';
import { ChildAccessCode } from './entities/child-access-code.entity.js';

@Injectable()
export class ChildAccessCodesService {
  constructor(
    @InjectRepository(ChildAccessCode)
    private readonly repository: Repository<ChildAccessCode>,
  ) {}
  async create(dto: CreateChildAccessCodeDto): Promise<ChildAccessCode> {
    const accessCode = (dto.accessCode || this.generateCode()).toUpperCase();
    if (await this.repository.exists({ where: { accessCode } }))
      throw new ConflictException('Access code already exists');
    return this.repository.save(
      this.repository.create({
        accessCode,
        childName: dto.childName,
        enrollment: dto.enrollment,
        isActive: true,
      }),
    );
  }
  private generateCode(): string {
    return Array.from({ length: 8 }, () =>
      'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'.charAt(Math.floor(Math.random() * 32)),
    ).join('');
  }
}
