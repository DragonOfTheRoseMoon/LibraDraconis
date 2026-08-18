<script lang=ts>
    import type { BookWithAuthors } from '$lib/server/types';

    let { book }: { book: BookWithAuthors } = $props();

</script>


<div class="card bg-surface-100-900 p-4 w-full max-w-xl mx-auto space-y-3">
	<div class="grid grid-cols-1 md:grid-cols-5 gap-x-2 gap-y-4 ">
		<div class="md:col-span-2 md:row-span-4">
			<div class="aspect-2/3 w-full overflow-hidden rounded border border-surface-300-700 flex items-center justify-center p-3 text-center">
					<p class="text-sm opacity-70">Search by ISBN to add to your library</p>
			</div>
		</div>

		<div class="md:col-span-3">
			<dl class="space-y-2">
				<div>
					<dt class="font-bold">Title:</dt>
					<dd class="opacity-60">{book.title || '\u00A0'}</dd>
				</div>
				<div>
					<dt class="font-bold">Author:</dt>
					<dd class="opacity-60">{book.authors.join(', ') || '\u00A0'}</dd>
				</div>
				<div class="flex gap-8">
					<div>
						<dt class="font-bold">Series</dt>
						<dd class="opacity-60">{book.series || '\u00A0'}</dd>

					</div>
					<div>
						<dt class="font-bold">Order</dt>
						<dd class="opacity-60">{book.seriesPosition || '\u00A0'}</dd>
					</div>
				</div>
				<div class="flex gap-4">
					<div>
						<dt class="font-bold">Publisher</dt>
						<dd class="opacity-60">{book.publisher || '\u00A0'}</dd>
					</div>
					<div>
						<dt class="font-bold">Year</dt>
						<dd class="opacity-60">{book.publishYear || '\u00A0'}</dd>
					</div>
				</div>
				<div class="flex gap-8">
					<div>
						<dt class="font-bold">format</dt>
						<dd class="opacity-60">{book.format || '\u00A0'}</dd>
					</div>
					<div>
						<dt class="font-bold">status</dt>
						<dd class="opacity-60">{book.status || '\u00A0'}</dd>
					</div>
				</div>

			</dl>
		</div>
	</div>
</div>