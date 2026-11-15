<script lang="ts">
	import type { FunFacts } from '#lib/components/stats/types.js';

	let {
		oldest,
		newest,
		longest
	}: {
		oldest: FunFacts | null;
		newest: FunFacts | null;
		longest: FunFacts | null;
	} = $props();

	let failed: Record<string, boolean> = $state({});
</script>

{#snippet card(label: string, book: FunFacts | null, stat: string, preset: string)}
	<div
		class="mx-auto w-full max-w-md card {preset} my-1 flex flex-row items-center gap-4 p-4 text-left transition-transform duration-200 hover:scale-[1.03] md:my-2 md:flex-col md:gap-0 md:text-center"
	>
		{#if book?.hasImage && !failed[book.uuid]}
			<img
				src="/api/covers/{book.uuid}"
				class="order-1 aspect-2/3 w-24 shrink-0 rounded object-cover shadow-[0_8px_20px_rgb(0_0_0/0.7)] md:order-3 md:mt-2 md:w-30"
				alt="{book.title} cover"
				onerror={() => (failed[book.uuid] = true)}
			/>
		{:else}
			<div
				class="order-1 flex w-24 shrink-0 items-center justify-center text-center md:order-3 md:mt-2 md:w-full"
			>
				<p class="text-xl opacity-70">{book?.title}</p>
			</div>
		{/if}

		<!-- On small screens this is one block beside the cover; from md up, `contents` lets its children join the card's column and `order` slots the cover between them -->
		<div class="order-2 flex flex-col gap-1 md:contents">
			<p class="text-sm opacity-70 md:order-1">{label}</p>
			<p class="text-xl font-bold md:order-2 md:min-h-14">{book?.title ?? '—'}</p>
			<p class="text-xl font-bold md:order-4 md:mt-auto md:pt-2">{stat}</p>
		</div>
	</div>
{/snippet}

<div class="mx-auto w-7/8 max-w-3xl card preset-filled-surface-100-900 px-4 py-2 text-center">
	<fieldset class="fieldset">
		<legend class="legend text-left">Highlights</legend>
		<div class="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
			{@render card(
				'Oldest Book:',
				oldest,
				`${oldest?.year ?? '—'}`,
				'preset-filled-surface-200-800'
			)}
			{@render card(
				'Newest Book:',
				newest,
				`${newest?.year ?? '—'}`,
				'preset-filled-surface-300-700'
			)}
			{@render card(
				'Longest Book:',
				longest,
				`${longest?.pages ?? '—'} pages`,
				'preset-filled-surface-400-600'
			)}
		</div>
	</fieldset>
</div>
