import { GB_API_KEY } from '$app/env/private';
import type { GoogleVolumesResponse } from './types';
import type { GoogleBookResult } from '../types';

const baseURL = 'https://www.googleapis.com/books/v1/volumes?q=';

const SEARCH_PREFIX = {
	isbn: 'isbn:',
	title: 'intitle:',
	author: 'inauthor:'
} as const;

type SearchType = keyof typeof SEARCH_PREFIX;

export async function searchBooks(type: SearchType, query: string) {
	const url = `${baseURL}${SEARCH_PREFIX[type]}${query}&key=${GB_API_KEY}`;
	const response = await fetch(url);

	if (!response.ok) throw new Error(`Google Books API error: ${response.status}`);
	const rawResult = await response.json();
	return toGoogleBookResult(rawResult);
}

function toGoogleBookResult(rawResult: GoogleVolumesResponse): GoogleBookResult {
	if (!rawResult.items || rawResult.items.length === 0) {
		throw new Error('No book found for this search.');
	}
	const volInfo = rawResult.items[0].volumeInfo;

	const sourceId = rawResult.items[0].id;
	const title = volInfo.title;
	const authors = volInfo.authors ?? [];
	const series = ''; //this doesn't ever seem to exist so im just going to blank it out on purpose.
	const publisher = volInfo.publisher ?? null;
	const publishYear = volInfo.publishedDate ? Number(volInfo.publishedDate.slice(0, 4)) : null;
	const isbn =
		volInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier ??
		volInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_10')?.identifier ??
		null;
	const pageCount = volInfo.pageCount ?? null;
	const thumbnail = volInfo.imageLinks?.thumbnail ?? null;
	const smallThumbnail = volInfo.imageLinks?.smallThumbnail ?? null;

	return {
		sourceId,
		title,
		authors,
		series,
		publisher,
		publishYear,
		isbn,
		pageCount,
		thumbnail,
		smallThumbnail
	};
}
