import { json } from '@sveltejs/kit';
import { searchBooks } from '$lib/server/google-books/client';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const isbn = url.searchParams.get('isbn');

	if (!isbn) {
		return json({ error: 'Missing isbn query parameter' }, { status: 400 });
	}

	const data = await searchBooks('isbn', isbn);
	return json(data);
};
