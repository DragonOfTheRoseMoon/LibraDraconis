<script lang="ts">
    import type { PageData } from './$types';
   	import { SegmentedControl } from '@skeletonlabs/skeleton-svelte';
    import { ChevronLeft, ChevronRight} from '@lucide/svelte';

    import BookCardDetail from '$lib/components/BookCardDetail.svelte';
    import BookCardCover from '$lib/components/BookCardCover.svelte';


    let { data }: { data: PageData } = $props();


	let value = $state<string | null>('cover');

	let page = $state(1);
	let pageSize = $state(10);
	let pagedBooks = $derived(data.books.slice((page - 1) * pageSize, page * pageSize));
	let totalResults = $derived(data.books.length);
	let totalPages = $derived(Math.ceil(totalResults / pageSize));
	let minShown = $derived((page - 1) * pageSize + 1);
	let maxShown = $derived(Math.min(page * pageSize, totalResults));



	function requestNextPage() {
    page = Math.min(page + 1, totalPages);
	}

	function requestPreviousPage() {
    page = Math.max(page - 1, 1);
	}

</script>

<div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-8">

    <!-- Left spacer (reserved for future filters) -->
    <div></div>

    <!-- Pagination -->
    <div class="flex items-center gap-4">
		<button type="button" class="btn-icon btn-icon-2xl preset-filled rounded-full" onclick={requestPreviousPage} title="Previous Page" aria-label="Go">
			<ChevronLeft />
		</button>
		<h1 class="text-2xl"> {page} of {totalPages}</h1>
		<button type="button" class="btn-icon btn-icon-2xl preset-filled rounded-full" onclick={requestNextPage} title="Next Page" aria-label="Go">
			<ChevronRight />
		</button>
	</div>

    <!-- View Toggle + Books Per Page, side by side on the right -->
    <div class="flex items-center justify-end gap-4 pr-4">
        <label class="flex items-center gap-2">
       	<span class="label-text">View Per Page</span>
            <select class="select field-lg w-20" bind:value={pageSize} onchange={() => (page = 1)}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
            </select>
        </label>

        <SegmentedControl {value} onValueChange={(details) => (value = details.value)}>
    		<SegmentedControl.Control>
    			<SegmentedControl.Indicator />
    			<SegmentedControl.Item value="cover">
    				<SegmentedControl.ItemText>Cover</SegmentedControl.ItemText>
    				<SegmentedControl.ItemHiddenInput />
    			</SegmentedControl.Item>
    			<SegmentedControl.Item value="details">
    				<SegmentedControl.ItemText>Details</SegmentedControl.ItemText>
    				<SegmentedControl.ItemHiddenInput />
    			</SegmentedControl.Item>
    		</SegmentedControl.Control>
    	</SegmentedControl>
    </div>

</div>






{#if value === 'cover'}
    <div class="grid grid-cols-[repeat(auto-fill,15rem)] gap-4 justify-center">
    	{#each pagedBooks as book}
    		<BookCardCover {book} />
    	{/each}
    </div>

{:else if value === 'details'}
    <div class="space-y-4">
    	{#each pagedBooks as book}
    		<BookCardDetail {book} />
    	{/each}
    </div>
{/if}

<div class="flex justify-center mt-8">
	<p><code class="code"><span class="opacity-60"> Showing {minShown}-{maxShown} of {totalResults} Results</span> </code></p>
</div>
