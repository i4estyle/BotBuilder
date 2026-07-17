import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1784273332805 implements MigrationInterface {
  name = 'CreateTables1784273332805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`BB_PAGE_SECTION\` (\`PAGE_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสหน้าเพจ', \`PAGE_SECTION_INFO\` json NULL COMMENT 'ข้อมูลส่วนแนะนำ', \`PAGE_SECTION_WHY\` json NULL COMMENT 'ข้อมูลส่วนเหตุผล', \`PAGE_SECTION_COURSE\` json NULL COMMENT 'ข้อมูลส่วนหลักสูตร', \`PAGE_SECTION_DESCRIPTION\` json NULL COMMENT 'ข้อมูลส่วนรายละเอียด', \`PAGE_SECTION_MAP\` json NULL COMMENT 'ข้อมูลส่วนแผนที่', \`PAGE_SECTION_ENV\` json NULL COMMENT 'ข้อมูลส่วนสภาพแวดล้อม', \`CREATED_AT\` timestamp(6) NOT NULL COMMENT 'วันที่สร้าง' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` timestamp(6) NOT NULL COMMENT 'วันที่แก้ไข' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` timestamp(6) NULL COMMENT 'วันที่ลบ (soft delete)', PRIMARY KEY (\`PAGE_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`BB_USER\` (\`USER_ID\` char(8) NOT NULL COMMENT 'รหัสผู้ใช้', \`USER_NAME\` varchar(50) NOT NULL COMMENT 'ชื่อผู้ใช้งาน', \`NETIONAL_ID\` char(13) NOT NULL COMMENT 'เลขบัตรประชาชน', \`USER_ADDRESS\` varchar(255) NOT NULL COMMENT 'ที่อยู่', \`USER_PHONE\` varchar(15) NOT NULL COMMENT 'เบอร์โทรศัพท์', \`USER_EMAIL\` varchar(100) NOT NULL COMMENT 'อีเมล', \`USER_STATUS\` enum ('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL COMMENT 'สถานะผู้ใช้', \`CREATED_AT\` timestamp(6) NOT NULL COMMENT 'วันที่สร้าง' DEFAULT CURRENT_TIMESTAMP(6), \`UPDATED_AT\` timestamp(6) NOT NULL COMMENT 'วันที่แก้ไข' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`DELETED_AT\` timestamp(6) NULL COMMENT 'วันที่ลบ (soft delete)', PRIMARY KEY (\`USER_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`BB_USER_ROLE\` (\`USER_ROLE\` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสความสัมพันธ์ผู้ใช้-บทบาท', \`USER_ID\` char(8) NOT NULL COMMENT 'รหัสผู้ใช้', \`ROLE_ID\` char(8) NOT NULL COMMENT 'รหัสบทบาท', PRIMARY KEY (\`USER_ROLE\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`BB_ROLE\` (\`ROLE_ID\` char(8) NOT NULL COMMENT 'รหัสบทบาท', \`ROLE_NAME\` varchar(50) NOT NULL COMMENT 'ชื่อบทบาท', PRIMARY KEY (\`ROLE_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`BB_USER_ROLE\` ADD CONSTRAINT \`FK_484b316b090430cc431aa10373d\` FOREIGN KEY (\`USER_ID\`) REFERENCES \`BB_USER\`(\`USER_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`BB_USER_ROLE\` ADD CONSTRAINT \`FK_6dfaecd4226c7c63b46af32740f\` FOREIGN KEY (\`ROLE_ID\`) REFERENCES \`BB_ROLE\`(\`ROLE_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`BB_USER_ROLE\` DROP FOREIGN KEY \`FK_6dfaecd4226c7c63b46af32740f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`BB_USER_ROLE\` DROP FOREIGN KEY \`FK_484b316b090430cc431aa10373d\``,
    );
    await queryRunner.query(`DROP TABLE \`BB_ROLE\``);
    await queryRunner.query(`DROP TABLE \`BB_USER_ROLE\``);
    await queryRunner.query(`DROP TABLE \`BB_USER\``);
    await queryRunner.query(`DROP TABLE \`BB_PAGE_SECTION\``);
  }
}
