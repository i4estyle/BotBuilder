import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthTokens1785800000000 implements MigrationInterface {
  name = 'AddAuthTokens1785800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `BB_USER` ADD `AUTH_VERSION` int NOT NULL DEFAULT 0, ADD `EMAIL_VERIFIED_AT` timestamp NULL');
    await queryRunner.query('UPDATE `BB_USER` SET `EMAIL_VERIFIED_AT` = CURRENT_TIMESTAMP WHERE `USER_EMAIL` IS NOT NULL');
    await queryRunner.query(`CREATE TABLE \`BB_AUTH_TOKEN\` (
      \`AUTH_TOKEN_ID\` int NOT NULL AUTO_INCREMENT,
      \`USER_ID\` char(8) NOT NULL,
      \`PURPOSE\` enum ('REFRESH', 'EMAIL_VERIFICATION', 'PASSWORD_RESET') NOT NULL,
      \`TOKEN_HASH\` char(64) NOT NULL,
      \`EXPIRES_AT\` timestamp NOT NULL,
      \`USED_AT\` timestamp NULL,
      \`CREATED_AT\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`AUTH_TOKEN_ID\`),
      UNIQUE KEY \`IDX_BB_AUTH_TOKEN_HASH\` (\`TOKEN_HASH\`),
      KEY \`IDX_BB_AUTH_TOKEN_USER_PURPOSE\` (\`USER_ID\`, \`PURPOSE\`)
    ) ENGINE=InnoDB`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `BB_AUTH_TOKEN`');
    await queryRunner.query('ALTER TABLE `BB_USER` DROP COLUMN `AUTH_VERSION`, DROP COLUMN `EMAIL_VERIFIED_AT`');
  }
}
