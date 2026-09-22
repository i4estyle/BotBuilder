import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('BB_CHILD_ACCESS_CODE')
export class ChildAccessCode {
  @PrimaryColumn({ name: 'ACCESS_CODE', type: 'char', length: 8 })
  accessCode!: string;

  @Column({ name: 'CHILD_NAME', type: 'varchar', length: 100 })
  childName!: string;

  @Column({ name: 'ENROLLMENT', type: 'varchar', length: 150 })
  enrollment!: string;

  @Column({ name: 'IS_ACTIVE', type: 'boolean', default: true })
  isActive!: boolean;
}
