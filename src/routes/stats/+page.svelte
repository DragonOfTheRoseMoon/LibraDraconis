<script lang="ts">
    import DonutChart from '$lib/components/stats/DonutChart.svelte';
	import type { ChartSliceInput } from '$lib/components/stats/types'

	const slices: ChartSliceInput[] = [
		{ label: 'Read', value: 40, color: '#4b4453' },
		{ label: 'Unread', value: 90, color: '#845ec2' },
		{ label: 'wishlist', value: 30, color: '#b0a8b9' }
	];

</script>


<DonutChart slices={ slices }/>
