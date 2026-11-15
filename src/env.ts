import { defineEnvVars } from '@sveltejs/kit/env';
import path from 'node:path';

export const variables = defineEnvVars({
	COVERS_DIR: { schema: (input) => input || path.join(process.cwd(), 'covers') },
	GB_API_KEY: {
		schema: (input) => {
			if (!input) throw new Error('GB_API_KEY is required');
			return input;
		}
	},
	DATABASE_URL: {
		schema: (input) => {
			if (!input) throw new Error('DATABASE_URL is required');
			return input;
		}
	}
});
