import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserStatus } from '../../../common/enums/user-status.enum.js';

@Entity('BB_ADMIN')
export class Admin {
  @PrimaryColumn({ name: 'ADMIN_ID', type: 'char', length: 8 })
  adminId!: string;

  @Column({ name: 'LOGIN_NAME', type: 'varchar', length: 100, unique: true })
  loginName!: string;

  @Column({ name: 'DISPLAY_NAME', type: 'varchar', length: 100 })
  displayName!: string;

  @Column({ name: 'EMAIL', type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ name: 'PASSWORD_HASH', type: 'varchar', length: 255, select: false })
  passwordHash?: string;

  @Column({ name: 'STATUS', type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  @Column({ name: 'AUTH_VERSION', type: 'int', default: 0 })
  authVersion!: number;

  @CreateDateColumn({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT', type: 'timestamp', nullable: true })
  deletedAt?: Date | null;
}
