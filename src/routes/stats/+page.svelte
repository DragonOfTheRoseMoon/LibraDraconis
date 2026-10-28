<script lang="ts">
    import FunFactCard from '$lib/components/stats/FunFactCard.svelte';
	import DonutChart from '$lib/components/stats/DonutChart.svelte';
	import type { ChartSliceInput} from '$lib/components/stats/types';
	import type { PageData } from './$types';
	import type { Status } from '$lib/server/db/schema';

	let { data }: { data: PageData } = $props();

	const statusColors: Record<Status, string> = {
		read: 'var(--color-primary-500)',
		unread: 'var(--color-secondary-500)',
		wishlist: 'var(--color-tertiary-500)'
	};

	const slices = $derived<ChartSliceInput[]>(
		data.sliceStats.map((sliceStats) => ({
			label: sliceStats.status,
			value: sliceStats.total,
			color: statusColors[sliceStats.status]
		}))
	);
</script>

<div class="py-4">
    <DonutChart {slices}  />
</div>

<div>
    <FunFactCard oldest={data.oldest} newest={data.newest} longest={data.longest} />
</div>
