import { sql } from 'drizzle-orm';
import {
	pgTable,
	pgEnum,
	uuid,
	text,
	integer,
	boolean,
	numeric,
	timestamp,
	primaryKey,
	index,
	uniqueIndex
} from 'drizzle-orm/pg-core';

export const formatEnum = pgEnum('format', ['book', 'ebook', 'audiobook']);
export type Format = (typeof formatEnum.enumValues)[number];

export const statusEnum = pgEnum('status', ['unread', 'read', 'wishlist']);
export type Status = (typeof statusEnum.enumValues)[number];

export const book = pgTable(
	'book',
	{
		uuid: uuid('uuid').primaryKey(),
		title: text('title').notNull(),
		series: text('series'),
		seriesPosition: integer('series_position'),
		isbn: text('isbn'),
		format: formatEnum('format'),
		status: statusEnum('status').notNull().default('unread'),
		hasImage: boolean('has_image').notNull().default(false),
		addedOn: timestamp('added_on').notNull().defaultNow(),
		// Only meaningful when status = 'wishlist'; NULL otherwise.
		wishPos: numeric('wish_pos'),
		// Only meaningful when status = 'wishlist'; NULL otherwise.
		approxCost: numeric('approx_cost', { precision: 10, scale: 2 })
	},
	(table) => [
		uniqueIndex('idx_book_wish_pos')
			.on(table.wishPos)
			.where(sql`${table.status} = 'wishlist'`)
	]
);

export const authors = pgTable('authors', {
	uuid: uuid('uuid').primaryKey(),
	name: text('name').notNull().unique()
});

export const bookAuthors = pgTable(
	'book_authors',
	{
		bookUuid: uuid('book_uuid')
			.notNull()
			.references(() => book.uuid, { onDelete: 'cascade' }),
		authorUuid: uuid('author_uuid')
			.notNull()
			.references(() => authors.uuid, { onDelete: 'cascade' })
	},
	(table) => [
		primaryKey({ columns: [table.bookUuid, table.authorUuid] }),
		index('idx_book_authors_book').on(table.bookUuid),
		index('idx_book_authors_author').on(table.authorUuid)
	]
);
