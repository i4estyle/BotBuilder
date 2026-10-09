import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerifiedAtToUser1785900000000 implements MigrationInterface {
  name = 'AddEmailVerifiedAtToUser1785900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const columns = (await queryRunner.query(
      "SHOW COLUMNS FROM `BB_USER` LIKE 'EMAIL_VERIFIED_AT'",
    )) as Array<unknown>;
    if (columns.length === 0) {
      await queryRunner.query(
        'ALTER TABLE `BB_USER` ADD `EMAIL_VERIFIED_AT` timestamp NULL',
      );
      await queryRunner.query(
        'UPDATE `BB_USER` SET `EMAIL_VERIFIED_AT` = CURRENT_TIMESTAMP WHERE `USER_EMAIL` IS NOT NULL',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `BB_USER` DROP COLUMN `EMAIL_VERIFIED_AT`');
  }
}
