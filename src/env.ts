import { defineEnvVars } from '@sveltejs/kit/env';
import path from 'node:path';

// @migration-task Review usage of dynamic environment variables. They fall back to the empty string if not present, which may not be what you want.
export const variables = defineEnvVars({
	COVERS_DIR: { schema: (input) => input || path.join(process.cwd(), 'covers') },
	GB_API_KEY: { schema: (input) => input ?? '' },
	DATABASE_URL: { schema: (input) => input ?? '' }
});
