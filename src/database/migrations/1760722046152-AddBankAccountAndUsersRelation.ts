import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBankAccountAndUsersRelation1760722046152 implements MigrationInterface {
    name = 'AddBankAccountAndUsersRelation1760722046152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bank_accounts\` ADD \`userIdId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`bank_accounts\` ADD CONSTRAINT \`FK_5e43f392aca3d190bf6235a7d44\` FOREIGN KEY (\`userIdId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bank_accounts\` DROP FOREIGN KEY \`FK_5e43f392aca3d190bf6235a7d44\``);
        await queryRunner.query(`ALTER TABLE \`bank_accounts\` DROP COLUMN \`userIdId\``);
    }

}
