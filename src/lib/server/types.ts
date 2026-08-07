import type { Format, Status } from '$lib/server/db/schema';

export interface GoogleBookResult {
    
		sourceId: string;
		title: string;
		authors: string[];
		series: string | null;
		pageCount: number | null;
		isbn: string | null;
		publisher: string | null;
		publishYear: number | null;
		thumbnail: string | null;
		smallThumbnail: string | null;

}

export type BookEntryForm = {
	
		isbn: string;
		title: string;
		author: string;
		series: string;
		order: number;
		publisher: string;
		publishYear: number;
		format: Format;
		pages: number;
		status: Status;
	};

export type AddBookPayload = BookEntryForm & { thumbnail: string | null; };