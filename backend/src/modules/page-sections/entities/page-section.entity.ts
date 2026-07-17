import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('BB_PAGE_SECTION')
export class PageSection {
  @PrimaryGeneratedColumn({
    name: 'PAGE_ID',
    comment: 'รหัสหน้าเพจ',
  })
  pageId!: number;

  @Column({
    name: 'PAGE_SECTION_INFO',
    type: 'json',
    nullable: true,
    comment: 'ข้อมูลส่วนแนะนำ',
  })
  pageSectionInfo?: Record<string, unknown>;

  @Column({
    name: 'PAGE_SECTION_WHY',
    type: 'json',
    nullable: true,
    comment: 'ข้อมูลส่วนเหตุผล',
  })
  pageSectionWhy?: Record<string, unknown>;

  @Column({
    name: 'PAGE_SECTION_COURSE',
    type: 'json',
    nullable: true,
    comment: 'ข้อมูลส่วนหลักสูตร',
  })
  pageSectionCourse?: Record<string, unknown>;

  @Column({
    name: 'PAGE_SECTION_DESCRIPTION',
    type: 'json',
    nullable: true,
    comment: 'ข้อมูลส่วนรายละเอียด',
  })
  pageSectionDescription?: Record<string, unknown>;

  @Column({
    name: 'PAGE_SECTION_MAP',
    type: 'json',
    nullable: true,
    comment: 'ข้อมูลส่วนแผนที่',
  })
  pageSectionMap?: Record<string, unknown>;

  @Column({
    name: 'PAGE_SECTION_ENV',
    type: 'json',
    nullable: true,
    comment: 'ข้อมูลส่วนสภาพแวดล้อม',
  })
  pageSectionEnv?: Record<string, unknown>;

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
}
