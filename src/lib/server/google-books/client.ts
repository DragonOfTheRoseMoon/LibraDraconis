import { env } from '$env/dynamic/private';
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
	const url = `${baseURL}${SEARCH_PREFIX[type]}${query}&key=${env.GB_API_KEY}`;
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


	let sourceId = rawResult.items[0].id;
	let title = volInfo.title;
	let authors = volInfo.authors ?? [];
	let series = "" //this doesn't ever seem to exist so im just going to blank it out on purpose.
	let publisher = volInfo.publisher ?? null;
	let publishYear = volInfo.publishedDate ? Number(volInfo.publishedDate.slice(0, 4)) : null;
	let isbn =
		volInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier ??
		volInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_10')?.identifier ??
		null;
	let pageCount = volInfo.pageCount ?? null;
	let thumbnail = volInfo.imageLinks?.thumbnail ?? null;
	let smallThumbnail = volInfo.imageLinks?.smallThumbnail ?? null;



	return {
		sourceId: sourceId,
		title: title,
		authors: authors,
		series: series,
		publisher: publisher,
		publishYear: publishYear,
		isbn: isbn,
		pageCount: pageCount,
		thumbnail: thumbnail,
		smallThumbnail: smallThumbnail
	};
}

