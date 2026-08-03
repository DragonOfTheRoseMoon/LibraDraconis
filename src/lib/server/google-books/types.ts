

export interface GoogleVolumesResponse {
	items?: {
		id: string;
		volumeInfo: {
			title: string;
			authors?: string[];
			publisher?: string;
			publishedDate?: string;
			industryIdentifiers?: { type: string; identifier: string }[];
			pageCount?: number;
			imageLinks?: { thumbnail?: string; smallThumbnail?: string };
		};
	}[];
}
