import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExpireDateAndRevokeDateToRefreshTokenTable1755012772539 implements MigrationInterface {
    name = 'AddExpireDateAndRevokeDateToRefreshTokenTable1755012772539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` ADD \`expiresAt\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` ADD \`revokedAt\` timestamp NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_db56120664dd9acb3c8ae67a42\` ON \`RefreshTokens\` (\`token\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_db56120664dd9acb3c8ae67a42\` ON \`RefreshTokens\``);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` DROP COLUMN \`revokedAt\``);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` DROP COLUMN \`expiresAt\``);
    }

}
