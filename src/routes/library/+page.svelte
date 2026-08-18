<script lang="ts">
    import type { PageData } from './$types';
    import BookCard from '$lib/components/BookCard.svelte';

    let { data }: { data: PageData } = $props();



</script>




<div class="space-y-4">
	{#each data.books as book}
		<BookCard {book} />
	{/each}
</div>

