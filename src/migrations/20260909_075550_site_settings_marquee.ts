import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_marquee_included_companies" AS ENUM('neuralink', 'grok', 'spacex', 'tesla', 'boring', 'x');
  CREATE TYPE "public"."enum_site_settings_marquee_direction" AS ENUM('rtl', 'ltr');
  CREATE TABLE "site_settings_marquee_included_companies" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_marquee_included_companies",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "marquee_duration" numeric DEFAULT 40;
  ALTER TABLE "site_settings" ADD COLUMN "marquee_logo_size" numeric DEFAULT 48;
  ALTER TABLE "site_settings" ADD COLUMN "marquee_direction" "enum_site_settings_marquee_direction" DEFAULT 'rtl';
  ALTER TABLE "site_settings" ADD COLUMN "marquee_is_playing" boolean DEFAULT true;
  ALTER TABLE "site_settings_marquee_included_companies" ADD CONSTRAINT "site_settings_marquee_included_companies_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_marquee_included_companies_order_idx" ON "site_settings_marquee_included_companies" USING btree ("order");
  CREATE INDEX "site_settings_marquee_included_companies_parent_idx" ON "site_settings_marquee_included_companies" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_marquee_included_companies" CASCADE;
  ALTER TABLE "site_settings" DROP COLUMN "marquee_duration";
  ALTER TABLE "site_settings" DROP COLUMN "marquee_logo_size";
  ALTER TABLE "site_settings" DROP COLUMN "marquee_direction";
  ALTER TABLE "site_settings" DROP COLUMN "marquee_is_playing";
  DROP TYPE "public"."enum_site_settings_marquee_included_companies";
  DROP TYPE "public"."enum_site_settings_marquee_direction";`)
}
