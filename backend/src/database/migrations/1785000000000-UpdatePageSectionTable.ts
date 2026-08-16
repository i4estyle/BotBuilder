import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePageSectionTable1785000000000 implements MigrationInterface {
  name = 'UpdatePageSectionTable1785000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`BB_PAGE_SECTION\``);
    await queryRunner.query(
      `CREATE TABLE \`BB_PAGE_SECTION\` (
        \`ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสลำดับ',
        \`PAGE_NAME\` varchar(50) NOT NULL DEFAULT 'home' COMMENT 'ชื่อหน้าเพจ',
        \`LOCALE\` varchar(10) NOT NULL DEFAULT 'th-TH' COMMENT 'ภาษา',
        \`SECTION_KEY\` varchar(50) NOT NULL COMMENT 'คีย์ประจำส่วน',
        \`SECTION_TITLE\` varchar(100) NULL COMMENT 'ชื่อส่วน',
        \`CONTENT\` json NULL COMMENT 'ข้อมูล JSON ประจำส่วน',
        \`SORT_ORDER\` int NOT NULL DEFAULT 0 COMMENT 'ลำดับการแสดงผล',
        \`IS_ACTIVE\` tinyint NOT NULL DEFAULT 1 COMMENT 'สถานะเปิดใช้งาน',
        \`CREATED_AT\` timestamp(6) NOT NULL COMMENT 'วันที่สร้าง' DEFAULT CURRENT_TIMESTAMP(6),
        \`UPDATED_AT\` timestamp(6) NOT NULL COMMENT 'วันที่แก้ไข' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`DELETED_AT\` timestamp(6) NULL COMMENT 'วันที่ลบ (soft delete)',
        PRIMARY KEY (\`ID\`),
        UNIQUE KEY \`UQ_PAGE_LOCALE_SECTION\` (\`PAGE_NAME\`, \`LOCALE\`, \`SECTION_KEY\`)
      ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`BB_PAGE_SECTION\``);
    await queryRunner.query(
      `CREATE TABLE \`BB_PAGE_SECTION\` (
        \`PAGE_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสหน้าเพจ',
        \`PAGE_SECTION_INFO\` json NULL COMMENT 'ข้อมูลส่วนแนะนำ',
        \`PAGE_SECTION_WHY\` json NULL COMMENT 'ข้อมูลส่วนเหตุผล',
        \`PAGE_SECTION_COURSE\` json NULL COMMENT 'ข้อมูลส่วนหลักสูตร',
        \`PAGE_SECTION_DESCRIPTION\` json NULL COMMENT 'ข้อมูลส่วนรายละเอียด',
        \`PAGE_SECTION_MAP\` json NULL COMMENT 'ข้อมูลส่วนแผนที่',
        \`PAGE_SECTION_ENV\` json NULL COMMENT 'ข้อมูลส่วนสภาพแวดล้อม',
        \`CREATED_AT\` timestamp(6) NOT NULL COMMENT 'วันที่สร้าง' DEFAULT CURRENT_TIMESTAMP(6),
        \`UPDATED_AT\` timestamp(6) NOT NULL COMMENT 'วันที่แก้ไข' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`DELETED_AT\` timestamp(6) NULL COMMENT 'วันที่ลบ (soft delete)',
        PRIMARY KEY (\`PAGE_ID\`)
      ) ENGINE=InnoDB`,
    );
  }
}
