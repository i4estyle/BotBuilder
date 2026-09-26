import { MigrationInterface, QueryRunner } from 'typeorm';

export class HardenUserRoleSchema1785700000000 implements MigrationInterface {
  name = 'HardenUserRoleSchema1785700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE duplicate FROM `BB_USER_ROLE` duplicate INNER JOIN `BB_USER_ROLE` retained ON duplicate.`USER_ID` = retained.`USER_ID` AND duplicate.`ROLE_ID` = retained.`ROLE_ID` AND duplicate.`USER_ROLE` > retained.`USER_ROLE`',
    );
    await queryRunner.query(
      'ALTER TABLE `BB_USER_ROLE` ADD CONSTRAINT `UQ_BB_USER_ROLE_USER_ID_ROLE_ID` UNIQUE (`USER_ID`, `ROLE_ID`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_BB_USER_ROLE_ROLE_ID` ON `BB_USER_ROLE` (`ROLE_ID`)',
    );
    await queryRunner.query(
      'ALTER TABLE `BB_ROLE` ADD CONSTRAINT `UQ_BB_ROLE_ROLE_NAME` UNIQUE (`ROLE_NAME`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `BB_ROLE` DROP INDEX `UQ_BB_ROLE_ROLE_NAME`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_BB_USER_ROLE_ROLE_ID` ON `BB_USER_ROLE`',
    );
    await queryRunner.query(
      'ALTER TABLE `BB_USER_ROLE` DROP INDEX `UQ_BB_USER_ROLE_USER_ID_ROLE_ID`',
    );
  }
}
