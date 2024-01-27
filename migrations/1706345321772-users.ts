import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1706345321772 implements MigrationInterface {
  name = 'Users1706345321772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_roles_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'USERS')`,
    );
    await queryRunner.query(`CREATE TABLE "users"
                             (
                                 "id"               SERIAL                      NOT NULL,
                                 "createAt"         TIMESTAMP                   NOT NULL DEFAULT now(),
                                 "updatedAt"        TIMESTAMP                   NOT NULL DEFAULT now(),
                                 "deletedAt"        TIMESTAMP,
                                 "name"             character varying           NOT NULL,
                                 "email"            character varying           NOT NULL,
                                 "phone"            character varying           NOT NULL,
                                 "password"         character varying           NOT NULL,
                                 "isChangePassword" boolean                     NOT NULL,
                                 "isActive"         boolean                     NOT NULL,
                                 "lastLoginDate"    TIMESTAMP                   NOT NULL,
                                 "accessToken"      character varying           NOT NULL,
                                 "refreshToken"     character varying           NOT NULL,
                                 "roles"            "public"."users_roles_enum" NOT NULL DEFAULT 'USERS',
                                 CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
                             )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
  }
}
