<script lang="ts">
	import FunFactCard from '#lib/components/stats/FunFactCard.svelte';
	import DonutChart from '#lib/components/stats/DonutChart.svelte';
	import type { ChartSliceInput } from '#lib/components/stats/types.js';
	import type { PageData } from './$types';
	import type { Ownership } from '#lib/server/db/schema.js';
	import { ownershipLabels } from '#lib/labels.js';

	let { data }: { data: PageData } = $props();

	const ownColors: Record<Ownership, string> = {
		own: 'var(--color-primary-500)',
		notown: 'var(--color-secondary-500)',
		wishlist: 'var(--color-tertiary-500)'
	};

	const slices = $derived<ChartSliceInput[]>(
		data.sliceStats.map((sliceStats) => ({
			label: ownershipLabels[sliceStats.status],
			value: sliceStats.total,
			color: ownColors[sliceStats.status]
		}))
	);
</script>

<div class="py-4">
	<DonutChart {slices} />
</div>

<div>
	<FunFactCard oldest={data.oldest} newest={data.newest} longest={data.longest} />
</div>
