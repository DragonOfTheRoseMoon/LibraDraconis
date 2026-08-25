<script lang="ts">
    import type { PageData } from './$types';
    import BookCardBar from '$lib/components/BookCardBar.svelte';

    let { data }: { data: PageData } = $props();


</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>



<div class="space-y-4">
	{#each data.newBooks as newBook}
		<BookCardBar book={newBook} />
	{/each}
</div>
