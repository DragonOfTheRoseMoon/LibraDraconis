<script lang="ts">
	import type { BookSummary } from '$lib/server/types';

	let { book }: { book: BookSummary } = $props();

	let imageFailed = $state(false);
</script>

<div class="card bg-surface-100-900 p-2 w-60 max-w-xl mx-auto space-y-3">
	<div class="grid grid-cols-1 gap-2">
		<div class="md:col-span-1 md:row-span-3">
			<div class="aspect-2/3 w-full overflow-hidden rounded border border-surface-300-700 flex items-center justify-center text-center">
				{#if book.hasImage && !imageFailed}
					<img
						src="/api/covers/{book.uuid}"
						class="w-full h-full object-cover object-center"
						alt="{book.title} cover"
						onerror={() => (imageFailed = true)}
					/>
				{:else}
					<div class="w-full h-full flex flex-col items-center justify-center text-center gap-4 ">
						<p class="text-xl opacity-70">{book.title}</p>
						<p class="text-sm opacity-70">{book.authors}</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
