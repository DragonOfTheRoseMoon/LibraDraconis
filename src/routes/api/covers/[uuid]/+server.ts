import { readCoverImage } from '$lib/server/covers';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const buffer = await readCoverImage(params.uuid);

	if (!buffer) {
		return new Response(null, { status: 404 });
	}

	return new Response(new Uint8Array(buffer), {
		headers: {
			'Content-Type': 'image/jpeg',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
