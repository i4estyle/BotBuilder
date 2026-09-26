import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLoginNameToUser1785500000000 implements MigrationInterface {
  name = 'AddLoginNameToUser1785500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `BB_USER` MODIFY `USER_EMAIL` varchar(100) NULL, ADD `LOGIN_NAME` varchar(50) NULL AFTER `USER_NAME`',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `UQ_BB_USER_LOGIN_NAME` ON `BB_USER` (`LOGIN_NAME`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `UQ_BB_USER_LOGIN_NAME` ON `BB_USER`');
    await queryRunner.query(
      'ALTER TABLE `BB_USER` DROP COLUMN `LOGIN_NAME`, MODIFY `USER_EMAIL` varchar(100) NOT NULL',
    );
  }
}
