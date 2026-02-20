import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProductsTableImageKeyCol1770923228109 implements MigrationInterface {
    name = 'AlterProductsTableImageKeyCol1770923228109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "imageKey" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "imageKey"`);
    }

}
