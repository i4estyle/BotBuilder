import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGuardianRelationToUser1785400000000 implements MigrationInterface {
  name = 'AddGuardianRelationToUser1785400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `BB_USER` ADD `GUARDIAN_RELATION` varchar(20) NULL AFTER `USER_PHONE`',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `BB_USER` DROP COLUMN `GUARDIAN_RELATION`');
  }
}
