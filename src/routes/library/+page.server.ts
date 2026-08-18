import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { book, authors, bookAuthors } from '$lib/server/db/schema';
import type { BookWithAuthors } from '$lib/server/types';


export const load: PageServerLoad = async () => {
	const rows = await db.select().from(book)
	.leftJoin(bookAuthors, eq(bookAuthors.bookUuid, book.uuid))
	.leftJoin(authors, eq(bookAuthors.authorUuid, authors.uuid));

	const grouped = new Map<string, BookWithAuthors>();

	for (const row of rows) {
		const bookId = row.book.uuid;
		const authorName = row.authors?.name;

		if (grouped.has(bookId)) {
			const existingBook = grouped.get(bookId)!;
			if (authorName) {
				existingBook.authors.push(authorName);
			}
		} else {
			grouped.set(bookId, {
				...row.book,
				authors: authorName ? [authorName] : []
			});
		}
	}

	const books = Array.from(grouped.values());

	return { books };
};




