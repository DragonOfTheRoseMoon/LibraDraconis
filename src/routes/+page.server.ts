import type { PageServerLoad } from './$types';
import { desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { book } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const newBooks = await db
		.select({ uuid: book.uuid, title: book.title, hasImage: book.hasImage })
		.from(book)
		.orderBy(desc(book.addedOn))
		.limit(10);

	return { newBooks };
};
