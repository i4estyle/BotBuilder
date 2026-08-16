import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('BB_PAGE_SECTION')
@Index('UQ_PAGE_LOCALE_SECTION', ['pageName', 'locale', 'sectionKey'], {
  unique: true,
})
export class PageSection {
  @PrimaryGeneratedColumn({
    name: 'ID',
  })
  id!: number;

  @Column({
    name: 'PAGE_NAME',
    type: 'varchar',
    length: 50,
    default: 'home',
  })
  pageName!: string;

  @Column({
    name: 'LOCALE',
    type: 'varchar',
    length: 10,
    default: 'th-TH',
  })
  locale!: string;

  @Column({
    name: 'SECTION_KEY',
    type: 'varchar',
    length: 50,
  })
  sectionKey!: string;

  @Column({
    name: 'SECTION_TITLE',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  sectionTitle?: string;

  @Column({
    name: 'CONTENT',
    type: 'json',
    nullable: true,
  })
  content?: Record<string, unknown> | Array<unknown> | null;

  @Column({
    name: 'SORT_ORDER',
    type: 'int',
    default: 0,
  })
  sortOrder!: number;

  @Column({
    name: 'IS_ACTIVE',
    type: 'boolean',
    default: true,
  })
  isActive!: boolean;

  @CreateDateColumn({
    name: 'CREATED_AT',
    type: 'timestamp',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'UPDATED_AT',
    type: 'timestamp',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'DELETED_AT',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;
}
