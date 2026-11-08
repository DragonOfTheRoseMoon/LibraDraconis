<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import RecentAddSection from '$lib/components/RecentAddSection.svelte';
	import { goto } from '$app/navigation';
	import logoDraconis from '$lib/assets/logoDraconis.svg';

	let { data }: { data: PageData } = $props();

	let quickSearchIsbn = $state('');

	function handleQuickSearch(event: SubmitEvent) {
		event.preventDefault();
		const trimmed = quickSearchIsbn.trim();
		if (!trimmed) return;
		const query = new URLSearchParams({ isbn: trimmed });
		// resolve() is applied to the path; the query string is appended after it
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(`${resolve('search')}?${query}`);
	}
</script>

<div class="m-9 flex items-center justify-center">
	<img src={logoDraconis} alt="LibraDraconis logo" class="w-80" />
</div>

<form
	class="mx-auto mt-6 mb-6 w-full max-w-xl space-y-3 card bg-surface-100-900 p-4"
	onsubmit={handleQuickSearch}
>
	<fieldset class="fieldset space-y-2">
		<legend class="legend">Quick Search by ISBN</legend>
		<div class="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-5">
			<label class="label md:col-span-4">
				<input
					class="input"
					type="text"
					placeholder="Input 10 or 13 digit ISBN to search..."
					bind:value={quickSearchIsbn}
				/>
			</label>

			<div class="flex justify-center md:col-span-1">
				<button type="submit" class="btn min-w-24 preset-filled">Search</button>
			</div>
		</div>
	</fieldset>
</form>

<RecentAddSection books={data.newBooks} />
