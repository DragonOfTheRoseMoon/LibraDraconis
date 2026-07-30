import { env } from '$env/dynamic/private';

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
	return await response.json();
}





