<script lang="ts">
	import type { BookSummary } from '$lib/server/types';
	import BookViewModal from '$lib/components/BookViewModal.svelte';

	let { book }: { book: BookSummary } = $props();

	let imageFailed = $state(false);
</script>

<BookViewModal uuid={book.uuid}>
	{#snippet trigger()}
		<div class="mx-auto w-60 max-w-xl space-y-3 card bg-surface-100-900 p-2">
			<div class="grid grid-cols-1 gap-2">
				<div class="md:col-span-1 md:row-span-3">
					<div
						class="flex aspect-2/3 w-full items-center justify-center overflow-hidden rounded border border-surface-300-700 text-center"
					>
						{#if book.hasImage && !imageFailed}
							<img
								src="/api/covers/{book.uuid}"
								class="h-full w-full object-cover object-center"
								alt="{book.title} cover"
								onerror={() => (imageFailed = true)}
							/>
						{:else}
							<div
								class="flex h-full w-full flex-col items-center justify-center gap-4 text-center"
							>
								<p class="text-xl opacity-70">{book.title}</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/snippet}
</BookViewModal>
