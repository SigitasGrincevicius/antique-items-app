import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavorites1784610814831 implements MigrationInterface {
  name = 'CreateFavorites1784610814831';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_favorite_items_antique_item" ("userId" uuid NOT NULL, "antiqueItemId" uuid NOT NULL, CONSTRAINT "PK_bf29b9948e6bfbc092a0e84004a" PRIMARY KEY ("userId", "antiqueItemId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_59fb9eb9d6da5e53f68fd25f6f" ON "user_favorite_items_antique_item" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d0a17e3d86fd18f6205c3da0b8" ON "user_favorite_items_antique_item" ("antiqueItemId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_items_antique_item" ADD CONSTRAINT "FK_59fb9eb9d6da5e53f68fd25f6f8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_items_antique_item" ADD CONSTRAINT "FK_d0a17e3d86fd18f6205c3da0b85" FOREIGN KEY ("antiqueItemId") REFERENCES "antique_item"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_favorite_items_antique_item" DROP CONSTRAINT "FK_d0a17e3d86fd18f6205c3da0b85"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_favorite_items_antique_item" DROP CONSTRAINT "FK_59fb9eb9d6da5e53f68fd25f6f8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d0a17e3d86fd18f6205c3da0b8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_59fb9eb9d6da5e53f68fd25f6f"`,
    );
    await queryRunner.query(`DROP TABLE "user_favorite_items_antique_item"`);
  }
}
