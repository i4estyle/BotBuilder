import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChildAccessCodes1785300000000 implements MigrationInterface {
  name = 'CreateChildAccessCodes1785300000000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `BB_USER` MODIFY `NETIONAL_ID` char(13) NULL, MODIFY `USER_ADDRESS` varchar(255) NULL, MODIFY `USER_PHONE` varchar(15) NULL, ADD `CHILD_ACCESS_CODE` char(8) NULL',
    );
    await queryRunner.query(
      'CREATE TABLE `BB_CHILD_ACCESS_CODE` (`ACCESS_CODE` char(8) NOT NULL, `CHILD_NAME` varchar(100) NOT NULL, `ENROLLMENT` varchar(150) NOT NULL, `IS_ACTIVE` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (`ACCESS_CODE`)) ENGINE=InnoDB',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `BB_CHILD_ACCESS_CODE`');
    await queryRunner.query(
      'ALTER TABLE `BB_USER` DROP COLUMN `CHILD_ACCESS_CODE`, MODIFY `NETIONAL_ID` char(13) NOT NULL, MODIFY `USER_ADDRESS` varchar(255) NOT NULL, MODIFY `USER_PHONE` varchar(15) NOT NULL',
    );
  }
}
