import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_reviews_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"stars" varchar DEFAULT '★★★★★',
  	"quote" varchar,
  	"attribution" varchar
  );
  
  CREATE TABLE "pages_blocks_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_reviews_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"stars" varchar DEFAULT '★★★★★',
  	"quote" varchar,
  	"attribution" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_reviews_items" ADD CONSTRAINT "pages_blocks_reviews_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_reviews_items" ADD CONSTRAINT "pages_blocks_reviews_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_reviews" ADD CONSTRAINT "pages_blocks_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_reviews_items" ADD CONSTRAINT "_pages_v_blocks_reviews_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_reviews_items" ADD CONSTRAINT "_pages_v_blocks_reviews_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_reviews" ADD CONSTRAINT "_pages_v_blocks_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_reviews_items_order_idx" ON "pages_blocks_reviews_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_reviews_items_parent_id_idx" ON "pages_blocks_reviews_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_reviews_items_avatar_idx" ON "pages_blocks_reviews_items" USING btree ("avatar_id");
  CREATE INDEX "pages_blocks_reviews_order_idx" ON "pages_blocks_reviews" USING btree ("_order");
  CREATE INDEX "pages_blocks_reviews_parent_id_idx" ON "pages_blocks_reviews" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_reviews_path_idx" ON "pages_blocks_reviews" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_reviews_items_order_idx" ON "_pages_v_blocks_reviews_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_reviews_items_parent_id_idx" ON "_pages_v_blocks_reviews_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_reviews_items_avatar_idx" ON "_pages_v_blocks_reviews_items" USING btree ("avatar_id");
  CREATE INDEX "_pages_v_blocks_reviews_order_idx" ON "_pages_v_blocks_reviews" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_reviews_parent_id_idx" ON "_pages_v_blocks_reviews" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_reviews_path_idx" ON "_pages_v_blocks_reviews" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_reviews_items" CASCADE;
  DROP TABLE "pages_blocks_reviews" CASCADE;
  DROP TABLE "_pages_v_blocks_reviews_items" CASCADE;
  DROP TABLE "_pages_v_blocks_reviews" CASCADE;`)
}
