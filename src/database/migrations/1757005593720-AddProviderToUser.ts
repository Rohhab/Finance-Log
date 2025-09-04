import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProviderToUser1757005593720 implements MigrationInterface {
    name = 'AddProviderToUser1757005593720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`provider\` enum ('local', 'google') NOT NULL DEFAULT 'local'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`provider\``);
    }

}
