import type { PageServerLoad } from './$types';
import { count } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { book } from '$lib/server/db/schema';


export const load: PageServerLoad = async () => {

  const rows = await db
    .select({ status: book.status, total: count() })
    .from(book)
    .groupBy(book.status);

  return { rows };

}
