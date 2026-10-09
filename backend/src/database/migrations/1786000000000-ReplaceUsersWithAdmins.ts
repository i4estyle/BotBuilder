import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceUsersWithAdmins1786000000000 implements MigrationInterface {
  name = 'ReplaceUsersWithAdmins1786000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`BB_ADMIN\` (
      \`ADMIN_ID\` char(8) NOT NULL,
      \`LOGIN_NAME\` varchar(100) NOT NULL,
      \`DISPLAY_NAME\` varchar(100) NOT NULL,
      \`EMAIL\` varchar(100) NOT NULL,
      \`PASSWORD_HASH\` varchar(255) NOT NULL,
      \`STATUS\` enum ('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
      \`AUTH_VERSION\` int NOT NULL DEFAULT 0,
      \`CREATED_AT\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`UPDATED_AT\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      \`DELETED_AT\` timestamp NULL,
      PRIMARY KEY (\`ADMIN_ID\`),
      UNIQUE KEY \`UQ_BB_ADMIN_LOGIN_NAME\` (\`LOGIN_NAME\`),
      UNIQUE KEY \`UQ_BB_ADMIN_EMAIL\` (\`EMAIL\`)
    ) ENGINE=InnoDB`);
    await queryRunner.query(`INSERT INTO \`BB_ADMIN\`
      (ADMIN_ID, LOGIN_NAME, DISPLAY_NAME, EMAIL, PASSWORD_HASH, STATUS, AUTH_VERSION, CREATED_AT, UPDATED_AT, DELETED_AT)
      SELECT u.USER_ID, COALESCE(NULLIF(u.LOGIN_NAME, ''), u.USER_EMAIL), u.USER_NAME, u.USER_EMAIL,
        u.PASSWORD_HASH, u.USER_STATUS, u.AUTH_VERSION, u.CREATED_AT, u.UPDATED_AT, u.DELETED_AT
      FROM \`BB_USER\` u
      INNER JOIN \`BB_USER_ROLE\` ur ON ur.USER_ID = u.USER_ID
      INNER JOIN \`BB_ROLE\` r ON r.ROLE_ID = ur.ROLE_ID
      WHERE LOWER(r.ROLE_NAME) = 'admin' AND u.USER_EMAIL IS NOT NULL AND u.PASSWORD_HASH IS NOT NULL`);
    await queryRunner.query('DROP INDEX `IDX_BB_AUTH_TOKEN_USER_PURPOSE` ON `BB_AUTH_TOKEN`');
    await queryRunner.query('ALTER TABLE `BB_AUTH_TOKEN` CHANGE `USER_ID` `ADMIN_ID` char(8) NOT NULL');
    await queryRunner.query('DELETE t FROM `BB_AUTH_TOKEN` t LEFT JOIN `BB_ADMIN` a ON a.`ADMIN_ID` = t.`ADMIN_ID` WHERE a.`ADMIN_ID` IS NULL');
    await queryRunner.query('CREATE INDEX `IDX_BB_AUTH_TOKEN_ADMIN_PURPOSE` ON `BB_AUTH_TOKEN` (`ADMIN_ID`, `PURPOSE`)');
    await queryRunner.query('DROP TABLE `BB_USER_ROLE`');
    await queryRunner.query('DROP TABLE `BB_ROLE`');
    await queryRunner.query('DROP TABLE `BB_USER`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error('This migration intentionally cannot be reversed after legacy user data is removed.');
  }
}
