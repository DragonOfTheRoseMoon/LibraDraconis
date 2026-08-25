<script lang="ts">

    import type { BookWithImage } from '$lib/server/types';

    let { book }: { book: Pick<BookWithImage, 'uuid' | 'title' | 'hasImage'> } = $props();

    let imageFailed = $state(false);


</script>

<div class="card bg-surface-100-900 p-2 w-60 max-w-xl mx-auto space-y-3">

    <div class="grid grid-cols-1 gap-">

        <div class="md:col-span-1 md:row-span-3">
			<div class="aspect-2/3 w-full overflow-hidden rounded border border-surface-300-700 flex items-center justify-center text-center">

				{#if book.hasImage && !imageFailed}
					<img src="/api/covers/{book.uuid}" class="w-full h-full object-cover object-center" alt="{book.title} cover" onerror={() => imageFailed = true}>
				{:else}
					<p class="text-sm opacity-70">No image Available</p>
				{/if}
			</div>
		</div>
		<div class="md:col-span-1 md:row-span-3">
			<div class="w-full overflow-hidden border border-surface-300-700 flex items-center justify-center  text-center">
                <p class="text-sm">{book.title}</p>
			</div>
		</div>
    </div>
</div>
