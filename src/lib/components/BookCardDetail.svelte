<script lang=ts>
    import type { BookWithAuthors } from '$lib/server/types';
    import PencilSparklesIcon from '@lucide/svelte/icons/pencil-sparkles';

    let { book }: { book: BookWithAuthors } = $props();

    let imageFailed = $state(false);


</script>


<div class="card bg-surface-100-900 p-4 w-full max-w-xl mx-auto space-y-3 relative">
	<a
		href="/library/{book.uuid}/edit"
		class="btn-icon preset-tonal absolute top-2 right-2"
		aria-label="Edit book"
	>
		<PencilSparklesIcon class="size-4" />
	</a>
	<div class="grid grid-cols-1 md:grid-cols-5 gap-x-2 gap-y-0">
		<div class="md:col-span-2 md:row-span-5">
			<div class="aspect-2/3 w-full overflow-hidden rounded border border-surface-300-700 flex items-center justify-center p-3 text-center">

				{#if book.hasImage && !imageFailed}
					<img src="/api/covers/{book.uuid}" class="w-full h-full object-cover object-center" alt="{book.title} cover" onerror={() => imageFailed = true}>
				{:else}
					<p class="text-sm opacity-70">No image Available</p>
				{/if}

			</div>
		</div>

		<dl class="contents">
			<div class="md:col-span-3">
				<dt class="font-bold">Title:</dt>
				<dd class="opacity-60">{book.title || '\u00A0'}</dd>
			</div>
			<div class="md:col-span-3">
				<dt class="font-bold">Author:</dt>
				<dd class="opacity-60">{book.authors.join(', ') || '\u00A0'}</dd>
			</div>
			<div class="md:col-span-2">
				<dt class="font-bold">Series</dt>
				<dd class="opacity-60">{book.series || '\u00A0'}</dd>
			</div>
			<div class="md:col-span-1">
				<dt class="font-bold">Order</dt>
				<dd class="opacity-60">{book.seriesPosition || '\u00A0'}</dd>
			</div>
			<div class="md:col-span-2">
				<dt class="font-bold">Publisher</dt>
				<dd class="opacity-60">{book.publisher || '\u00A0'}</dd>
			</div>
			<div class="md:col-span-1">
				<dt class="font-bold">Year</dt>
				<dd class="opacity-60">{book.publishYear || '\u00A0'}</dd>
			</div>
			<div class="md:col-span-1">
				<dt class="font-bold">Format</dt>
				<dd class="opacity-60">{book.format || '\u00A0'}</dd>
			</div>
			<div class="md:col-span-1">
				<dt class="font-bold">Pages</dt>
				<dd class="opacity-60">{book.pages || '\u00A0'}</dd>
			</div>
			<div class="md:col-span-1">
				<dt class="font-bold">Status</dt>
				<dd class="opacity-60">{book.status || '\u00A0'}</dd>
			</div>
		</dl>
	</div>
</div>
