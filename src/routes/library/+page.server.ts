import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { book, authors, bookAuthors } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	// TODO: query the database here and return the data

	const rows = await db.select().from(book)
	.leftJoin(bookAuthors, eq(bookAuthors.bookUuid, book.uuid))
	.leftJoin(authors, eq(bookAuthors.authorUuid, authors.uuid))

	console.log(rows)

	return {};
};
