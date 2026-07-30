CREATE TYPE "public"."format" AS ENUM('book', 'ebook', 'audiobook');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('unread', 'read', 'wishlist');--> statement-breakpoint
CREATE TABLE "authors" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "authors_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "book" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"series" text,
	"series_position" integer,
	"isbn" text,
	"format" "format",
	"status" "status" DEFAULT 'unread' NOT NULL,
	"has_image" boolean DEFAULT false NOT NULL,
	"added_on" timestamp DEFAULT now() NOT NULL,
	"wish_pos" numeric,
	"approx_cost" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "book_authors" (
	"book_uuid" uuid NOT NULL,
	"author_uuid" uuid NOT NULL,
	CONSTRAINT "book_authors_book_uuid_author_uuid_pk" PRIMARY KEY("book_uuid","author_uuid")
);
--> statement-breakpoint
ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_book_uuid_book_uuid_fk" FOREIGN KEY ("book_uuid") REFERENCES "public"."book"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_author_uuid_authors_uuid_fk" FOREIGN KEY ("author_uuid") REFERENCES "public"."authors"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_book_wish_pos" ON "book" USING btree ("wish_pos") WHERE "book"."status" = 'wishlist';--> statement-breakpoint
CREATE INDEX "idx_book_authors_book" ON "book_authors" USING btree ("book_uuid");--> statement-breakpoint
CREATE INDEX "idx_book_authors_author" ON "book_authors" USING btree ("author_uuid");