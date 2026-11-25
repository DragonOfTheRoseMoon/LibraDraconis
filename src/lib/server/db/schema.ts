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
	date,
	primaryKey,
	index,
	check,
	uniqueIndex
} from 'drizzle-orm/pg-core';

export const formatEnum = pgEnum('format', ['book', 'ebook', 'audiobook']);
export type Format = (typeof formatEnum.enumValues)[number];

export const ownEnum = pgEnum('owned', ['own', 'notown', 'wishlist']);
export type Ownership = (typeof ownEnum.enumValues)[number];

export const book = pgTable(
	'book',
	{
		uuid: uuid('uuid').primaryKey(),
		title: text('title').notNull(),
		series: text('series'),
		seriesPosition: integer('series_position'),
		isbn: text('isbn'),
		publisher: text('publisher'),
		publishYear: integer('publish_year'),
		pages: integer('pages'),
		format: formatEnum('format'),
		ownership: ownEnum('ownership').notNull().default('own'),
		hasImage: boolean('has_image').notNull().default(false),
		wishPos: numeric('wish_pos'),
		addedOn: timestamp('added_on').notNull().defaultNow(),
		readOn: date('read_on'),
		rating: integer('rating')
	},
	(table) => [
		uniqueIndex('idx_book_wish_pos')
			.on(table.wishPos)
			.where(sql`${table.ownership} = 'wishlist'`),

		check('rating_range', sql`${table.rating} >= 1 AND ${table.rating} <= 10`)
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
