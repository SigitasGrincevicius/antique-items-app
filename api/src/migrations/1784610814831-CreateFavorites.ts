import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavorites1784610814831 implements MigrationInterface {
  name = 'CreateFavorites1784610814831';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_favorited_items_antique_item" ("userId" uuid NOT NULL, "antiqueItemId" uuid NOT NULL, CONSTRAINT "PK_bf29b9948e6bfbc092a0e84004a" PRIMARY KEY ("userId", "antiqueItemId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e7d3729766760a9148835f97f" ON "user_favorited_items_antique_item" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf9ef97a6dde2e0618e8701070" ON "user_favorited_items_antique_item" ("antiqueItemId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorited_items_antique_item" ADD CONSTRAINT "FK_1e7d3729766760a9148835f97f5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorited_items_antique_item" ADD CONSTRAINT "FK_cf9ef97a6dde2e0618e87010705" FOREIGN KEY ("antiqueItemId") REFERENCES "antique_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_favorited_items_antique_item" DROP CONSTRAINT "FK_cf9ef97a6dde2e0618e87010705"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorited_items_antique_item" DROP CONSTRAINT "FK_1e7d3729766760a9148835f97f5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cf9ef97a6dde2e0618e8701070"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1e7d3729766760a9148835f97f"`,
    );
    await queryRunner.query(`DROP TABLE "user_favorited_items_antique_item"`);
  }
}
