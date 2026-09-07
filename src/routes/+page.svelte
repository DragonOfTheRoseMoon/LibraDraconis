<script lang="ts">
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
        goto(`/search?isbn=${encodeURIComponent(trimmed)}`);
    }
</script>

<div class="flex items-center justify-center m-9">
    <img src={logoDraconis} alt="LibraDraconis logo" class="w-80" />
</div>

<form class="card bg-surface-100-900 p-4 w-full max-w-xl mx-auto space-y-3 mt-6 mb-6" onsubmit={handleQuickSearch}>
    <fieldset class="fieldset space-y-2">
        <legend class="legend">Quick Search by ISBN</legend>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-x-2 gap-y-4">
            <label class="label md:col-span-4">
                <input class="input" type="text" placeholder="Input 10 or 13 digit ISBN to search..." bind:value={quickSearchIsbn} />
            </label>

            <div class="flex justify-center md:col-span-1">
                <button type="submit" class="btn preset-filled min-w-24">Search</button>
            </div>
        </div>
    </fieldset>
</form>

<RecentAddSection books={data.newBooks} />
