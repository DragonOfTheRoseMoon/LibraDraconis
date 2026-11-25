<script lang="ts">
	import { resolve } from '$app/paths';
	import type { BookWithAuthors } from '#lib/server/types.js';
	import PencilSparklesIcon from '@lucide/svelte/icons/pencil-sparkles';
	import { formatLabels, ownershipLabels } from '#lib/labels.js';

	let { book }: { book: BookWithAuthors } = $props();

	let imageFailed = $state(false);
</script>

<div class="relative mx-auto w-full max-w-xl space-y-3 card bg-surface-100-900 p-4">
	<a
		href={resolve('/library/[uuid]/edit', { uuid: book.uuid })}
		class="absolute top-2 right-2 btn-icon preset-tonal"
		aria-label="Edit book"
	>
		<PencilSparklesIcon class="size-4" />
	</a>
	<div class="grid grid-cols-1 gap-x-2 gap-y-0 md:grid-cols-5">
		<div class="md:col-span-2 md:row-span-5">
			<div
				class="flex aspect-2/3 w-full items-center justify-center overflow-hidden rounded border border-surface-300-700 p-3 text-center"
			>
				{#if book.hasImage && !imageFailed}
					<img
						src="/api/covers/{book.uuid}"
						class="h-full w-full object-cover object-center"
						alt="{book.title} cover"
						onerror={() => (imageFailed = true)}
					/>
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
				<dd class="opacity-60">{book.format ? formatLabels[book.format] : '\u00A0'}</dd>
			</div>
			<div class="md:col-span-1">
				<dt class="font-bold">Pages</dt>
				<dd class="opacity-60">{book.pages || '\u00A0'}</dd>
			</div>
			<div class="md:col-span-1">
				<dt class="font-bold">Ownership</dt>
				<dd class="opacity-60">{ownershipLabels[book.ownership]}</dd>
			</div>
		</dl>
	</div>
</div>
