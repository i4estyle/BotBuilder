import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Role } from '../../roles/entities/role.entity.js';

@Entity('BB_USER_ROLE')
@Index('UQ_BB_USER_ROLE_USER_ID_ROLE_ID', ['userId', 'roleId'], {
  unique: true,
})
@Index('IDX_BB_USER_ROLE_ROLE_ID', ['roleId'])
export class UserRole {
  @PrimaryGeneratedColumn({
    name: 'USER_ROLE',
    comment: 'รหัสความสัมพันธ์ผู้ใช้-บทบาท',
  })
  userRoleId!: number;

  @Column({
    name: 'USER_ID',
    type: 'char',
    length: 8,
    comment: 'รหัสผู้ใช้',
  })
  userId!: string;

  @Column({
    name: 'ROLE_ID',
    type: 'char',
    length: 8,
    comment: 'รหัสบทบาท',
  })
  roleId!: string;

  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn({ name: 'USER_ID' })
  user?: User;

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'ROLE_ID' })
  role?: Role;
}
