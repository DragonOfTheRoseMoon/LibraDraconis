import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.js';
import { book } from '#lib/server/db/schema.js';
import { writeCoverImage } from '#lib/server/covers.js';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request }) => {
	const formData = await request.formData();
	const file = formData.get('cover');

	if (!(file instanceof File) || !file.type.startsWith('image/')) {
		return Response.json({ error: 'A valid image file is required.' }, { status: 400 });
	}

	try {
		const buffer = Buffer.from(await file.arrayBuffer());
		await writeCoverImage(params.uuid, buffer);
		await db.update(book).set({ hasImage: true }).where(eq(book.uuid, params.uuid));
	} catch (error) {
		console.error(`Failed to upload cover for book ${params.uuid}:`, error);
		return Response.json(
			{ error: 'Something went wrong while uploading the cover.' },
			{ status: 500 }
		);
	}

	return Response.json({ uuid: params.uuid });
};
