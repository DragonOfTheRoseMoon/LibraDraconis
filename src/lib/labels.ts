import type { Format, Ownership } from '#lib/server/db/schema.js';

// Display text for each book format value stored in the database.
export const formatLabels: Record<Format, string> = {
	book: 'Print',
	ebook: 'E-book',
	audiobook: 'Audiobook'
};

// Display text for each ownership value stored in the database.
// Typed as Record<Ownership, string> so TypeScript errors if a value is added to the enum
// and no label is written for it.
export const ownershipLabels: Record<Ownership, string> = {
	own: 'Owned',
	notown: 'Not owned',
	wishlist: 'Wishlist'
};
