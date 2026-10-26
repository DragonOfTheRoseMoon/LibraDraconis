<script lang="ts">
	import DonutChart from '$lib/components/stats/DonutChart.svelte';
	import type { ChartSliceInput } from '$lib/components/stats/types';
	import type { PageData } from './$types';
	import type { Status } from '$lib/server/db/schema';

	let { data }: { data: PageData } = $props();

	const statusColors: Record<Status, string> = {
		read: 'var(--color-primary-500)',
		unread: 'var(--color-secondary-500)',
		wishlist: 'var(--color-tertiary-500)'
	};

	const slices = $derived<ChartSliceInput[]>(
		data.rows.map((row) => ({
			label: row.status,
			value: row.total,
			color: statusColors[row.status]
		}))
	);
</script>

<DonutChart {slices} />
