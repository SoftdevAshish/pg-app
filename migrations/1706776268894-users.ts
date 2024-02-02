import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1706776268894 implements MigrationInterface {
    name = 'Users1706776268894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'USERS')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "password" character varying NOT NULL, "isChangePassword" boolean NOT NULL, "isActive" boolean NOT NULL, "lastLoginDate" TIMESTAMP WITH TIME ZONE, "accessToken" character varying DEFAULT '', "refreshToken" character varying DEFAULT '', "roles" "public"."users_roles_enum" NOT NULL DEFAULT 'USERS', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
    }

}
