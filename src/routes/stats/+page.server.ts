import type { PageServerLoad } from './$types';
import { count, sql, asc, desc, isNotNull } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { book } from '$lib/server/db/schema';


export const load: PageServerLoad = async () => {

  const sliceStats = await db
    .select({ status: book.status, total: count() })
    .from(book)
    .groupBy(book.status);


  const queryOldestBook = await db
  	.select()
  	.from(book)
  	.where(isNotNull(book.publishYear))
  	.orderBy(asc(book.publishYear), asc(book.addedOn))
  	.limit(1);

  const oldestRow = queryOldestBook[0];
  const oldest = oldestRow ? { title: oldestRow.title, uuid: oldestRow.uuid, hasImage: oldestRow.hasImage,  year: oldestRow.publishYear } : null;


  const queryNewestBook = await db
  	.select()
  	.from(book)
  	.where(isNotNull(book.publishYear))
  	.orderBy(desc(book.publishYear), desc(book.addedOn))
  	.limit(1);
  const newestRow = queryNewestBook[0];
  const newest = newestRow ? { title: newestRow.title, uuid: newestRow.uuid, hasImage: newestRow.hasImage,   year: newestRow.publishYear } : null;


  const queryLongestBook = await db
    .select()
    .from(book)
    .where(isNotNull(book.pages))
    .orderBy(desc(book.pages))
    .limit(1);

  const longestRow = queryLongestBook[0];
  const longest = longestRow ? { title: longestRow.title, uuid: longestRow.uuid, hasImage: longestRow.hasImage,   pages: longestRow.pages } : null;


  const month = sql<string>`date_trunc('month', ${book.addedOn})`;
  const monthlyAddedOnBooks = await db
    .select({ month, total: count() })
	  .from(book)
	  .groupBy(month)
    .orderBy(month);


  return { sliceStats, oldest, newest, longest, monthlyAddedOnBooks };

}
