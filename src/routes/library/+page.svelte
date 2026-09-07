<script lang="ts">
    import type { PageData } from './$types';
    import BookCardDetail from '$lib/components/BookCardDetail.svelte';


    let { data }: { data: PageData } = $props();



</script>




<div class="space-y-4">
	{#each data.books as book}
		<BookCardDetail {book} />
	{/each}
</div>
