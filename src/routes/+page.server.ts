import type { PageServerLoad } from './$types';
import { desc, sql, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { book, authors, bookAuthors } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const newBooks = await db
		.select({
			uuid: book.uuid,
			title: book.title,
			hasImage: book.hasImage,
			authors: sql<string>`coalesce(string_agg(${authors.name}, ', '), '')`
		})
		.from(book)
		.leftJoin(bookAuthors, eq(bookAuthors.bookUuid, book.uuid))
		.leftJoin(authors, eq(authors.uuid, bookAuthors.authorUuid))
		.groupBy(book.uuid)
		.orderBy(desc(book.addedOn))
		.limit(10);

	return { newBooks };
};
