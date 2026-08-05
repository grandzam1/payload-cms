import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds Filament-style IA tables: pages, posts, categories, site_settings.
 * Generated to match Payload 3.87 postgres adapter conventions.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "categories" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "categories_created_at_idx" ON "categories" USING btree ("created_at");

    CREATE TABLE IF NOT EXISTS "pages" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "content" jsonb,
      "meta_title" varchar,
      "meta_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");

    CREATE TABLE IF NOT EXISTS "posts" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "category_id" integer,
      "excerpt" varchar,
      "content" jsonb,
      "hero_image_id" integer,
      "meta_title" varchar,
      "meta_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk"
        FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk"
        FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "posts_category_idx" ON "posts" USING btree ("category_id");
    CREATE INDEX IF NOT EXISTS "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
    CREATE INDEX IF NOT EXISTS "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "posts" USING btree ("created_at");

    CREATE TABLE IF NOT EXISTS "site_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "site_name" varchar NOT NULL,
      "tagline" varchar,
      "default_meta_title" varchar,
      "default_meta_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "pages_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "posts_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "categories_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk"
        FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk"
        FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk"
        FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx"
      ON "payload_locked_documents_rels" USING btree ("pages_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_posts_id_idx"
      ON "payload_locked_documents_rels" USING btree ("posts_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_categories_id_idx"
      ON "payload_locked_documents_rels" USING btree ("categories_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_pages_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_posts_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_categories_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_pages_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_posts_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_categories_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "pages_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "posts_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "categories_id";
    DROP TABLE IF EXISTS "posts" CASCADE;
    DROP TABLE IF EXISTS "pages" CASCADE;
    DROP TABLE IF EXISTS "categories" CASCADE;
    DROP TABLE IF EXISTS "site_settings" CASCADE;
  `)
}
