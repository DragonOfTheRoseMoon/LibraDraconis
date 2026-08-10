import { env } from '$env/dynamic/private';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const COVERS_DIR = env.COVERS_DIR ?? path.join(process.cwd(), 'covers');

function coverPath(bookId: string) {
	return path.join(COVERS_DIR, `${bookId}.jpg`);
}

export async function saveCoverImage(bookId: string, imageUrl: string): Promise<boolean> {
	try {
		const response = await fetch(imageUrl);
		if (!response.ok) return false;

		const buffer = Buffer.from(await response.arrayBuffer());
		await mkdir(COVERS_DIR, { recursive: true });
		await writeFile(coverPath(bookId), buffer);
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
