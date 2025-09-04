import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeUserPasswordNullable1757004302499 implements MigrationInterface {
    name = 'MakeUserPasswordNullable1757004302499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password\` \`password\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password\` \`password\` varchar(255) NOT NULL`);
    }

}
