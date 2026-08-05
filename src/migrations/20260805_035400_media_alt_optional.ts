import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Match Media.alt required:false — allow uploads without a description.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ALTER COLUMN "alt" DROP NOT NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "media" SET "alt" = '' WHERE "alt" IS NULL;
    ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;
  `)
}
