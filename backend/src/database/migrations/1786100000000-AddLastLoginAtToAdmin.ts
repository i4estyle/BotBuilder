import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLastLoginAtToAdmin1786100000000 implements MigrationInterface {
  name = 'AddLastLoginAtToAdmin1786100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const columns = (await queryRunner.query(
      "SHOW COLUMNS FROM `BB_ADMIN` LIKE 'LAST_LOGIN_AT'",
    )) as Array<unknown>;
    if (columns.length === 0) {
      await queryRunner.query(
        'ALTER TABLE `BB_ADMIN` ADD `LAST_LOGIN_AT` timestamp NULL',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `BB_ADMIN` DROP COLUMN `LAST_LOGIN_AT`',
    );
  }
}
