<script lang="ts">
	import { Carousel } from '@skeletonlabs/skeleton-svelte';
	import BookCardCover from '#lib/components/BookCardCover.svelte';
	import type { BookSummary } from '#lib/server/types.js';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	let { books }: { books: BookSummary[] } = $props();

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

<div class="mx-auto w-full max-w-5xl space-y-3 card bg-surface-100-900 p-4">
	<header>
		<h3 class="h3">Recently Added</h3>
	</header>
	<Carousel
		slideCount={books.length}
		{slidesPerPage}
		slidesPerMove={2}
		spacing="16px"
		padding="48px"
		autoSize
		loop
	>
		<div class="relative">
			<Carousel.Control>
				<Carousel.PrevTrigger
					class="absolute top-[50%] left-0 btn-icon translate-y-[-50%] rounded-full preset-filled shadow-[0_4px_12px_rgba(0,0,0,0.9)] btn-icon-2xl"
				>
					<ChevronLeft size={32} />
				</Carousel.PrevTrigger>
				<Carousel.NextTrigger
					class="absolute top-[50%] right-0 btn-icon translate-y-[-50%] rounded-full preset-filled shadow-[0_4px_12px_rgba(0,0,0,0.9)] btn-icon-2xl"
				>
					<ChevronRight size={32} />
				</Carousel.NextTrigger>
			</Carousel.Control>
			<Carousel.ItemGroup>
				{#each books as newBook, index (newBook.uuid)}
					<Carousel.Item {index} class="flex items-center justify-center">
						<BookCardCover book={newBook} />
					</Carousel.Item>
				{/each}
			</Carousel.ItemGroup>
		</div>
		<Carousel.IndicatorGroup>
			<Carousel.Context>
				{#snippet children(carousel)}
					<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
					{#each carousel().pageSnapPoints as _, index (index)}
						<Carousel.Indicator {index} />
					{/each}
				{/snippet}
			</Carousel.Context>
		</Carousel.IndicatorGroup>
	</Carousel>
</div>
