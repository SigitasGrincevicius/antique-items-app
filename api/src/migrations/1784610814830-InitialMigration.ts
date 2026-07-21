import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1784610814830 implements MigrationInterface {
  name = 'InitialMigration1784610814830';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "password" character varying NOT NULL, "email" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roles" text array NOT NULL DEFAULT '{user}', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "antique_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "origin" character varying(100), "year" smallint NOT NULL, "priceEur" numeric(12,2) NOT NULL, "description" text, "categoryId" uuid, "createdById" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_33ef6e2e03729837228147796d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "antique_item" ADD CONSTRAINT "FK_59e1c03d51e66938454d58ee5fb" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "antique_item" ADD CONSTRAINT "FK_d817e838c203d19b6cc3c4dc596" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "antique_item" DROP CONSTRAINT "FK_d817e838c203d19b6cc3c4dc596"`,
    );
    await queryRunner.query(
      `ALTER TABLE "antique_item" DROP CONSTRAINT "FK_59e1c03d51e66938454d58ee5fb"`,
    );
    await queryRunner.query(`DROP TABLE "antique_item"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
