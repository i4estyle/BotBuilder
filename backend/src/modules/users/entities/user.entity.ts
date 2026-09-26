import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { UserStatus } from '../../../common/enums/user-status.enum.js';
import { UserRole } from '../../user-roles/entities/user-role.entity.js';

@Entity('BB_USER')
export class User {
  @PrimaryColumn({
    name: 'USER_ID',
    type: 'char',
    length: 8,
    comment: 'รหัสผู้ใช้',
  })
  userId!: string;

  @Column({
    name: 'USER_NAME',
    type: 'varchar',
    length: 50,
    comment: 'ชื่อผู้ใช้งาน',
  })
  userName!: string;

  @Column({
    name: 'LOGIN_NAME',
    type: 'varchar',
    length: 50,
    nullable: true,
    unique: true,
  })
  loginName?: string | null;

  @Column({
    name: 'NETIONAL_ID',
    type: 'char',
    length: 13,
    nullable: true,
    comment: 'เลขบัตรประชาชน',
  })
  netionalId?: string | null;

  @Column({
    name: 'USER_ADDRESS',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'ที่อยู่',
  })
  userAddress?: string | null;

  @Column({
    name: 'USER_PHONE',
    type: 'varchar',
    length: 15,
    nullable: true,
    comment: 'เบอร์โทรศัพท์',
  })
  userPhone?: string | null;

  @Column({
    name: 'GUARDIAN_RELATION',
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'ความสัมพันธ์กับเด็ก',
  })
  guardianRelation?: string | null;

  @Column({
    name: 'USER_EMAIL',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'อีเมล',
  })
  userEmail?: string | null;

  @Column({
    name: 'CHILD_ACCESS_CODE',
    type: 'char',
    length: 8,
    nullable: true,
  })
  childAccessCode?: string | null;

  @Column({
    name: 'USER_STATUS',
    type: 'enum',
    enum: UserStatus,
    comment: 'สถานะผู้ใช้',
  })
  userStatus!: UserStatus;

  @Column({
    name: 'PASSWORD_HASH',
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
    comment: 'รหัสผ่านที่เข้ารหัสแล้ว (ใช้สำหรับเข้าสู่ระบบแอดมิน)',
  })
  passwordHash?: string | null;

  @CreateDateColumn({
    name: 'CREATED_AT',
    type: 'timestamp',
    comment: 'วันที่สร้าง',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'UPDATED_AT',
    type: 'timestamp',
    comment: 'วันที่แก้ไข',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'DELETED_AT',
    type: 'timestamp',
    nullable: true,
    comment: 'วันที่ลบ (soft delete)',
  })
  deletedAt?: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles?: UserRole[];
}
