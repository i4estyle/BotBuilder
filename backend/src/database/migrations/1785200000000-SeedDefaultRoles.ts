import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDefaultRoles1785200000000 implements MigrationInterface {
  name = 'SeedDefaultRoles1785200000000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT IGNORE INTO `BB_ROLE` (`ROLE_ID`, `ROLE_NAME`) VALUES ('ADMIN', 'admin'), ('USER', 'user')",
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "DELETE FROM `BB_ROLE` WHERE `ROLE_ID` IN ('ADMIN', 'USER')",
    );
  }
}
