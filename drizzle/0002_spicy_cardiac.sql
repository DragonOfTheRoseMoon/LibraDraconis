ALTER TYPE "public"."status" RENAME TO "owned";--> statement-breakpoint
ALTER TABLE "book" RENAME COLUMN "status" TO "ownership";--> statement-breakpoint
DROP INDEX "idx_book_wish_pos";--> statement-breakpoint
ALTER TABLE "book" ALTER COLUMN "ownership" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "book" ADD COLUMN "read_on" date;--> statement-breakpoint
UPDATE "book" SET "read_on" = CURRENT_DATE WHERE "ownership" = 'read';--> statement-breakpoint
UPDATE "book" SET "ownership" = 'own' WHERE "ownership" IN ('unread', 'read');--> statement-breakpoint
ALTER TABLE "book" ALTER COLUMN "ownership" SET DEFAULT 'own'::text;--> statement-breakpoint
DROP TYPE "public"."owned";--> statement-breakpoint
CREATE TYPE "public"."owned" AS ENUM('own', 'notown', 'wishlist');--> statement-breakpoint
ALTER TABLE "book" ALTER COLUMN "ownership" SET DEFAULT 'own'::"public"."owned";--> statement-breakpoint
ALTER TABLE "book" ALTER COLUMN "ownership" SET DATA TYPE "public"."owned" USING "ownership"::"public"."owned";--> statement-breakpoint
ALTER TABLE "book" ADD COLUMN "rating" integer;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_book_wish_pos" ON "book" USING btree ("wish_pos") WHERE "book"."ownership" = 'wishlist';--> statement-breakpoint
ALTER TABLE "book" DROP COLUMN "approx_cost";--> statement-breakpoint
ALTER TABLE "book" ADD CONSTRAINT "rating_range" CHECK ("book"."rating" >= 1 AND "book"."rating" <= 10);