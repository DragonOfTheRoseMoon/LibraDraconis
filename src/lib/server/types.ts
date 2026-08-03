

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