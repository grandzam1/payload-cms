import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_access_tier" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"audience" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"heading_level" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_access_tier" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"audience" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"heading_level" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "pages_blocks_access_tier" ADD CONSTRAINT "pages_blocks_access_tier_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_access_tier" ADD CONSTRAINT "pages_blocks_access_tier_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_texts" ADD CONSTRAINT "pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_access_tier" ADD CONSTRAINT "_pages_v_blocks_access_tier_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_access_tier" ADD CONSTRAINT "_pages_v_blocks_access_tier_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_texts" ADD CONSTRAINT "_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_access_tier_order_idx" ON "pages_blocks_access_tier" USING btree ("_order");
  CREATE INDEX "pages_blocks_access_tier_parent_id_idx" ON "pages_blocks_access_tier" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_access_tier_path_idx" ON "pages_blocks_access_tier" USING btree ("_path");
  CREATE INDEX "pages_blocks_access_tier_image_idx" ON "pages_blocks_access_tier" USING btree ("image_id");
  CREATE INDEX "pages_texts_order_parent" ON "pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "_pages_v_blocks_access_tier_order_idx" ON "_pages_v_blocks_access_tier" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_access_tier_parent_id_idx" ON "_pages_v_blocks_access_tier" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_access_tier_path_idx" ON "_pages_v_blocks_access_tier" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_access_tier_image_idx" ON "_pages_v_blocks_access_tier" USING btree ("image_id");
  CREATE INDEX "_pages_v_texts_order_parent" ON "_pages_v_texts" USING btree ("order","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_access_tier" CASCADE;
  DROP TABLE "pages_texts" CASCADE;
  DROP TABLE "_pages_v_blocks_access_tier" CASCADE;
  DROP TABLE "_pages_v_texts" CASCADE;`)
}
