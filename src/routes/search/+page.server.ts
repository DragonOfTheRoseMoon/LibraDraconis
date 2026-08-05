import { formatEnum,statusEnum } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		formats: formatEnum.enumValues,
		statuses: statusEnum.enumValues
	};
};
