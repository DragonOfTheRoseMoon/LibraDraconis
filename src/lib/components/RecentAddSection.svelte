<script lang="ts">
	import { Carousel } from '@skeletonlabs/skeleton-svelte';
	import BookCardBar from '$lib/components/BookCardBar.svelte';
	import type { BookWithImage } from '$lib/server/types';

	let { books }: { books: Pick<BookWithImage, 'uuid' | 'title' | 'hasImage'>[] } = $props();

	let slidesPerPage = $state(4);

	$effect(() => {
		const updateSlidesPerPage = () => {
			if (window.innerWidth < 640) slidesPerPage = 1;
			else if (window.innerWidth < 1024) slidesPerPage = 2;
			else if (window.innerWidth < 1280) slidesPerPage = 3;
			else slidesPerPage = 4;
		};
		updateSlidesPerPage();
		window.addEventListener('resize', updateSlidesPerPage);
		return () => window.removeEventListener('resize', updateSlidesPerPage);
	});
</script>
<div class="">
    <h1 class="text-2xl font-bold mb-4">Recently Added</h1>
    <Carousel slideCount={books.length} slidesPerPage={slidesPerPage} spacing="16px" padding="48px" autoSize loop>

    	<div class="relative">
    		<Carousel.Control>
    			<Carousel.PrevTrigger class="btn-icon preset-filled rounded-full absolute top-[50%] left-0 translate-y-[-50%]">
    				<span>&larr;</span>
    			</Carousel.PrevTrigger>
    			<Carousel.NextTrigger class="btn-icon preset-filled rounded-full absolute top-[50%] right-0 translate-y-[-50%]">
    				<span>&rarr;</span>
    			</Carousel.NextTrigger>
    		</Carousel.Control>
    		<Carousel.ItemGroup>
    		    {#each books as newBook, index}
    				<Carousel.Item index={index} class="flex justify-center items-center">
    					<BookCardBar book={newBook} />
    				</Carousel.Item>
    			{/each}
    		</Carousel.ItemGroup>
    	</div>
    	<Carousel.IndicatorGroup>
    		<Carousel.Context>
    			{#snippet children(carousel)}
    				{#each carousel().pageSnapPoints as _, index}
    					<Carousel.Indicator {index} />
    				{/each}
    			{/snippet}
    		</Carousel.Context>
    	</Carousel.IndicatorGroup>
    </Carousel>
</div>
