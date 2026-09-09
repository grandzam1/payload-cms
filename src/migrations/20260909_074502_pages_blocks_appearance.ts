import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Pages: appearance fields (cover/icon/titleImage/theme) + layout blocks
 * (callout, heading, bullets, spacer, pricing), including draft versions.
 *
 * Note: migrate:create also emitted unrelated ytbot DDL because the DB snapshot
 * drifted; those objects already exist from earlier migrations and are omitted.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_spacer_size" AS ENUM('small', 'medium', 'large');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_theme" AS ENUM('notion', 'v2');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_spacer_size" AS ENUM('small', 'medium', 'large');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_version_theme" AS ENUM('notion', 'v2');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE TABLE IF NOT EXISTS "pages_blocks_callout" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "content" jsonb,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_heading" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar,
      "subheading" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_bullets" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_bullets_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_spacer" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "size" "enum_pages_blocks_spacer_size" DEFAULT 'medium',
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_pricing" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "price" varchar,
      "description" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_callout" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "content" jsonb,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_heading" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "subheading" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_bullets" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_bullets_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_spacer" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "size" "enum__pages_v_blocks_spacer_size" DEFAULT 'medium',
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_pricing" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "price" varchar,
      "description" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "cover_id" integer;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "icon_id" integer;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "title_image_id" integer;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "theme" "enum_pages_theme" DEFAULT 'v2';
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_cover_id" integer;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_icon_id" integer;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_title_image_id" integer;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_theme" "enum__pages_v_version_theme" DEFAULT 'v2';

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_callout" ADD CONSTRAINT "pages_blocks_callout_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_heading" ADD CONSTRAINT "pages_blocks_heading_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_bullets" ADD CONSTRAINT "pages_blocks_bullets_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_bullets_items" ADD CONSTRAINT "pages_blocks_bullets_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bullets"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_pricing" ADD CONSTRAINT "pages_blocks_pricing_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_callout" ADD CONSTRAINT "_pages_v_blocks_callout_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_heading" ADD CONSTRAINT "_pages_v_blocks_heading_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_bullets" ADD CONSTRAINT "_pages_v_blocks_bullets_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_bullets_items" ADD CONSTRAINT "_pages_v_blocks_bullets_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_bullets"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_pricing" ADD CONSTRAINT "_pages_v_blocks_pricing_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages" ADD CONSTRAINT "pages_cover_id_media_id_fk"
        FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages" ADD CONSTRAINT "pages_icon_id_media_id_fk"
        FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages" ADD CONSTRAINT "pages_title_image_id_media_id_fk"
        FOREIGN KEY ("title_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_cover_id_media_id_fk"
        FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_icon_id_media_id_fk"
        FOREIGN KEY ("version_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_title_image_id_media_id_fk"
        FOREIGN KEY ("version_title_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_callout_order_idx" ON "pages_blocks_callout" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_callout_parent_id_idx" ON "pages_blocks_callout" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_callout_path_idx" ON "pages_blocks_callout" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_heading_order_idx" ON "pages_blocks_heading" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_heading_parent_id_idx" ON "pages_blocks_heading" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_heading_path_idx" ON "pages_blocks_heading" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_bullets_order_idx" ON "pages_blocks_bullets" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_bullets_parent_id_idx" ON "pages_blocks_bullets" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_bullets_path_idx" ON "pages_blocks_bullets" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_bullets_items_order_idx" ON "pages_blocks_bullets_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_bullets_items_parent_id_idx" ON "pages_blocks_bullets_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_order_idx" ON "pages_blocks_spacer" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_parent_id_idx" ON "pages_blocks_spacer" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_path_idx" ON "pages_blocks_spacer" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_pricing_order_idx" ON "pages_blocks_pricing" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_pricing_parent_id_idx" ON "pages_blocks_pricing" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_pricing_path_idx" ON "pages_blocks_pricing" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_callout_order_idx" ON "_pages_v_blocks_callout" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_callout_parent_id_idx" ON "_pages_v_blocks_callout" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_callout_path_idx" ON "_pages_v_blocks_callout" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_order_idx" ON "_pages_v_blocks_heading" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_parent_id_idx" ON "_pages_v_blocks_heading" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_path_idx" ON "_pages_v_blocks_heading" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullets_order_idx" ON "_pages_v_blocks_bullets" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullets_parent_id_idx" ON "_pages_v_blocks_bullets" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullets_path_idx" ON "_pages_v_blocks_bullets" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullets_items_order_idx" ON "_pages_v_blocks_bullets_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullets_items_parent_id_idx" ON "_pages_v_blocks_bullets_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_order_idx" ON "_pages_v_blocks_spacer" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_parent_id_idx" ON "_pages_v_blocks_spacer" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_path_idx" ON "_pages_v_blocks_spacer" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_pricing_order_idx" ON "_pages_v_blocks_pricing" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_pricing_parent_id_idx" ON "_pages_v_blocks_pricing" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_pricing_path_idx" ON "_pages_v_blocks_pricing" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "pages_cover_idx" ON "pages" USING btree ("cover_id");
    CREATE INDEX IF NOT EXISTS "pages_icon_idx" ON "pages" USING btree ("icon_id");
    CREATE INDEX IF NOT EXISTS "pages_title_image_idx" ON "pages" USING btree ("title_image_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_version_cover_idx" ON "_pages_v" USING btree ("version_cover_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_version_icon_idx" ON "_pages_v" USING btree ("version_icon_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_version_title_image_idx" ON "_pages_v" USING btree ("version_title_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_cover_id_media_id_fk";
    ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_icon_id_media_id_fk";
    ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_title_image_id_media_id_fk";
    ALTER TABLE "_pages_v" DROP CONSTRAINT IF EXISTS "_pages_v_version_cover_id_media_id_fk";
    ALTER TABLE "_pages_v" DROP CONSTRAINT IF EXISTS "_pages_v_version_icon_id_media_id_fk";
    ALTER TABLE "_pages_v" DROP CONSTRAINT IF EXISTS "_pages_v_version_title_image_id_media_id_fk";

    DROP INDEX IF EXISTS "pages_cover_idx";
    DROP INDEX IF EXISTS "pages_icon_idx";
    DROP INDEX IF EXISTS "pages_title_image_idx";
    DROP INDEX IF EXISTS "_pages_v_version_version_cover_idx";
    DROP INDEX IF EXISTS "_pages_v_version_version_icon_idx";
    DROP INDEX IF EXISTS "_pages_v_version_version_title_image_idx";

    DROP TABLE IF EXISTS "pages_blocks_bullets_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_bullets" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_callout" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_heading" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_spacer" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_pricing" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_bullets_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_bullets" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_callout" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_heading" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_spacer" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_pricing" CASCADE;

    ALTER TABLE "pages" DROP COLUMN IF EXISTS "cover_id";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "icon_id";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "title_image_id";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "theme";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_cover_id";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_icon_id";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_title_image_id";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_theme";

    DROP TYPE IF EXISTS "public"."enum_pages_blocks_spacer_size";
    DROP TYPE IF EXISTS "public"."enum_pages_theme";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_spacer_size";
    DROP TYPE IF EXISTS "public"."enum__pages_v_version_theme";
  `)
}
