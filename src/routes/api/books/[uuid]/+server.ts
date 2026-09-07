import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { book, authors, bookAuthors } from '$lib/server/db/schema';
import type { BookEntryForm, BookWithAuthors } from '$lib/server/types';
import { deleteCoverImage } from '$lib/server/covers';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const rows = await db
		.select()
		.from(book)
		.leftJoin(bookAuthors, eq(bookAuthors.bookUuid, book.uuid))
		.leftJoin(authors, eq(bookAuthors.authorUuid, authors.uuid))
		.where(eq(book.uuid, params.uuid));

	if (rows.length === 0) {
		return json({ error: 'Book not found.' }, { status: 404 });
	}

	const result: BookWithAuthors = {
		...rows[0].book,
		authors: rows.map((row) => row.authors?.name).filter((name): name is string => !!name)
	};

	return json(result);
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const body = (await request.json()) as BookEntryForm;

	const seriesPosition = body.order === 0 ? null : body.order;
	const publishYear = body.publishYear === 0 ? null : body.publishYear;
	const pages = body.pages === 0 ? null : body.pages;
	const authorNames = body.author
		.split('; ')
		.map((name) => name.trim())
		.filter(Boolean);

	try {
		await db.transaction(async (tx) => {
			await tx
				.update(book)
				.set({
					title: body.title,
					series: body.series || null,
					seriesPosition,
					isbn: body.isbn || null,
					publisher: body.publisher || null,
					publishYear,
					pages,
					format: body.format,
					status: body.status
				})
				.where(eq(book.uuid, params.uuid));

			await tx.delete(bookAuthors).where(eq(bookAuthors.bookUuid, params.uuid));

			for (const name of authorNames) {
				const existingAuthCheck = await tx.select().from(authors).where(eq(authors.name, name));

				const authorID = existingAuthCheck.length > 0 ? existingAuthCheck[0].uuid : crypto.randomUUID();

				if (existingAuthCheck.length === 0) {
					await tx.insert(authors).values({ uuid: authorID, name });
				}

				await tx.insert(bookAuthors).values({ bookUuid: params.uuid, authorUuid: authorID });
			}
		});
	} catch (err) {
		console.error('Failed to update book:', err);
		return json({ error: 'Something went wrong while saving the book.' }, { status: 500 });
	}

	return json({ uuid: params.uuid });
};

export const DELETE: RequestHandler = async ({ params }) => {
	const deleted = await db.delete(book).where(eq(book.uuid, params.uuid)).returning({ uuid: book.uuid });

	if (deleted.length === 0) {
		return json({ error: 'Book not found.' }, { status: 404 });
	}

	await deleteCoverImage(params.uuid);

	return json({ uuid: params.uuid });
};
