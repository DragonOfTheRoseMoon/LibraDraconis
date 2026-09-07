import { env } from '$env/dynamic/private';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const COVERS_DIR = env.COVERS_DIR ?? path.join(process.cwd(), 'covers');

function coverPath(bookId: string) {
	return path.join(COVERS_DIR, `${bookId}.jpg`);
}

export async function writeCoverImage(bookId: string, buffer: Buffer): Promise<void> {
	await mkdir(COVERS_DIR, { recursive: true });
	await writeFile(coverPath(bookId), buffer);
}

export async function saveCoverImage(bookId: string, imageUrl: string): Promise<boolean> {
	try {
		const response = await fetch(imageUrl);
		if (!response.ok) return false;

		await writeCoverImage(bookId, Buffer.from(await response.arrayBuffer()));
		return true;
	} catch (error) {
		console.error(`Failed to save cover image for book ${bookId}:`, error);
		return false;
	}
}

export async function readCoverImage(bookId: string): Promise<Buffer | null> {
	try {
		return await readFile(coverPath(bookId));
	} catch {
		return null;
	}
}

export async function deleteCoverImage(bookId: string): Promise<void> {
	try {
		await unlink(coverPath(bookId));
	} catch {
		// No cover on disk for this book; nothing to clean up.
	}
}
