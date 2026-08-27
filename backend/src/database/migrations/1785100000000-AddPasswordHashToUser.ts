import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordHashToUser1785100000000
  implements MigrationInterface
{
  name = 'AddPasswordHashToUser1785100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`BB_USER\` ADD \`PASSWORD_HASH\` varchar(255) NULL COMMENT 'รหัสผ่านที่เข้ารหัสแล้ว (ใช้สำหรับเข้าสู่ระบบแอดมิน)'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`BB_USER\` DROP COLUMN \`PASSWORD_HASH\``,
    );
  }
}
