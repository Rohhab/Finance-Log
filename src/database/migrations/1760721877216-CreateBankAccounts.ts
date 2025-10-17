import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBankAccounts1760721877216 implements MigrationInterface {
    name = 'CreateBankAccounts1760721877216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`bank_accounts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`number\` varchar(255) NOT NULL, \`balance\` decimal(10,2) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`bank_accounts\``);
    }

}
