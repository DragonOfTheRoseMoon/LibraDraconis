import { json } from '@sveltejs/kit';
import type { AddBookPayload } from '$lib/server/types';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { book, authors, bookAuthors } from '$lib/server/db/schema';






export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json() as AddBookPayload;

    if (body.isbn) {
        const existingBookCheck = await db.select().from(book).where(eq(book.isbn, body.isbn));

        if (existingBookCheck.length > 0) {
            return json({ error: 'This ISBN is already in your library.' }, { status: 409 });
        }
    }
    
    let hasImage = false;
    if (body.thumbnail){
        hasImage = true;
    }
    const bookID = crypto.randomUUID();
    const authorNames = body.author.split('; ').map((name) => name.trim());
    const seriesPosition = body.order === 0 ? null : body.order;
    const publishYear = body.publishYear === 0 ? null : body.publishYear;
    const pages = body.pages === 0 ? null : body.pages;

    try {
        await db.transaction(async (tx) => {
            await tx.insert(book).values({ uuid: bookID, title: body.title, series: body.series, seriesPosition: seriesPosition, isbn: body.isbn, publisher: body.publisher, publishYear: publishYear, pages: pages, format: body.format, status: body.status, hasImage: hasImage });

            for (const name of authorNames) {
                const existingAuthCheck = await tx.select().from(authors).where(eq(authors.name, name));

                if (existingAuthCheck.length === 0) {
                    const authorID = crypto.randomUUID();
                    await tx.insert(authors).values({ uuid: authorID, name });
                    await tx.insert(bookAuthors).values({ bookUuid: bookID, authorUuid: authorID });
                } else {
                    const authorID = existingAuthCheck[0].uuid;
                    await tx.insert(bookAuthors).values({ bookUuid: bookID, authorUuid: authorID });
                }
            }
        });
    } catch (error) {
        console.error('Failed to add book to library:', error);
        return json({ error: 'Something went wrong while saving the book.' }, { status: 500 });
    }

    return json({ uuid: bookID }, { status: 201 });
};
