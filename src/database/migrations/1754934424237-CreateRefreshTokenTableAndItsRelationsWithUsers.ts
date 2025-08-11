import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRefreshTokenTableAndItsRelationsWithUsers1754934424237 implements MigrationInterface {
    name = 'CreateRefreshTokenTableAndItsRelationsWithUsers1754934424237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`RefreshTokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`revoked\` tinyint NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` ADD CONSTRAINT \`FK_6dfd786f75cfe054e9ae3a45f5e\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`RefreshTokens\` DROP FOREIGN KEY \`FK_6dfd786f75cfe054e9ae3a45f5e\``);
        await queryRunner.query(`DROP TABLE \`RefreshTokens\``);
    }

}
