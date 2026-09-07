import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { book, authors, bookAuthors, formatEnum, statusEnum } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
	const rows = await db
		.select()
		.from(book)
		.leftJoin(bookAuthors, eq(bookAuthors.bookUuid, book.uuid))
		.leftJoin(authors, eq(bookAuthors.authorUuid, authors.uuid))
		.where(eq(book.uuid, params.uuid));

	if (rows.length === 0) {
		error(404, 'Book not found');
	}

	const authorNames = rows
		.map((row) => row.authors?.name)
		.filter((name): name is string => !!name);

	const { book: bookRow } = rows[0];

	return {
		book: {
			uuid: bookRow.uuid,
			hasImage: bookRow.hasImage,
			isbn: bookRow.isbn ?? '',
			title: bookRow.title,
			author: authorNames.join('; '),
			series: bookRow.series ?? '',
			order: bookRow.seriesPosition ?? 0,
			publisher: bookRow.publisher ?? '',
			publishYear: bookRow.publishYear ?? 0,
			format: bookRow.format ?? 'book',
			pages: bookRow.pages ?? 0,
			status: bookRow.status
		},
		formats: formatEnum.enumValues,
		statuses: statusEnum.enumValues
	};
};
