# Schema Review

Review of `src/lib/server/db/schema.ts`. Each item is framed as questions to work through, not answers.

**Strengths:** the many-to-many for authors is done correctly, the partial unique index on `wishPos` is a nice touch, and the enums are sensible.

## 1. `series` is free text on `book`

- If you type "Stormlight Archive" on one book and "The Stormlight Archive" on another, what does a "show me this series" query return?
- What would a `series` table give you that a text column can't? What would it cost you in joins?

## 2. One `status` column does two jobs

- `status` mixes "do I own it" (`wishlist`) with "have I read it" (`read`/`unread`). Can you currently represent a book you own, have read, and want a second copy of? What about a wishlist book you've already read from the library?
- This is the unresolved ownership-vs-read-status question from earlier notes, and it's the biggest design issue in the schema.

## 3. Wishlist-only columns live on every book

- `wishPos` and `approxCost` are NULL for most rows, and the comment is the only thing enforcing "only when wishlist". Which would you rather do: a `CHECK` constraint that makes the database enforce it, or move those columns to a separate `wishlist` table keyed by book? What does each do to your queries?
- This also touches the pricing question.

## 4. `format` is a single value per book

- Should "Dune (ebook)" and "Dune (paperback)" be two rows, or one book with two formats? Which choice makes the "recently added" list look better or worse?

## 5. Indexes

- The composite primary key `(bookUuid, authorUuid)` already creates an index. Does `idx_book_authors_book` still add anything? Does the `authorUuid` index?
- `isbn` has no index or uniqueness at all. How would you stop yourself adding the same book twice? Do all books even have an ISBN?

## 6. Smaller things

- `timestamp('added_on')` has no time zone. Look at `withTimezone` in the Drizzle docs and think about whether it matters.
- Nothing stops `pages` or `publishYear` from being negative. Check constraints are cheap.
- `uuid` primary keys have no default. Fine if the app generates them, but is that a deliberate choice?
- Will author order or role (author vs. illustrator vs. translator) ever matter for display?

## Suggested order

Start with **#2**, since it shapes #3 and #4.
