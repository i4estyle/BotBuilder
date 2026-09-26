import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from '../../user-roles/entities/user-role.entity.js';

@Entity('BB_ROLE')
export class Role {
  @PrimaryColumn({
    name: 'ROLE_ID',
    type: 'char',
    length: 8,
    comment: 'รหัสบทบาท',
  })
  roleId!: string;

  @Column({
    name: 'ROLE_NAME',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'ชื่อบทบาท',
  })
  roleName!: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles?: UserRole[];
}
