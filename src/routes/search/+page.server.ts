import { formatEnum, ownEnum } from '#lib/server/db/schema.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		formats: formatEnum.enumValues,
		statuses: ownEnum.enumValues
	};
};
