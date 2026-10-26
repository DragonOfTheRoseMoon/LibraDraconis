<script lang="ts">
	import type { ChartSliceInput, ChartSliceComputed } from '$lib/components/stats/types';

	let { slices }: { slices: ChartSliceInput[] } = $props();

	const SIZE = 240;
	const C = SIZE / 2;
	const R = 110; // outer radius
	const R_IN = 65; // inner radius (0 for a solid pie)
	const GAP = 0.04; // radians of gap between slices

	const total = $derived(slices.reduce((sum, s) => sum + s.value, 0));

	const point = (r: number, a: number) =>
		`${(C + r * Math.cos(a)).toFixed(2)} ${(C + r * Math.sin(a)).toFixed(2)}`;

	// Each slice gets an SVG arc path plus the angle of its midpoint (used for the "pop out" offset).
	const arcs = $derived.by<ChartSliceComputed[]>(() => {
		let angle = -Math.PI / 2; // start at 12 o'clock
		return slices.map((s) => {
			const sweep = (s.value / total) * Math.PI * 2;
			const a0 = angle + GAP / 2;
			const a1 = angle + sweep - GAP / 2;
			angle += sweep;
			const large = a1 - a0 > Math.PI ? 1 : 0;
			const svgPath = [
				`M ${point(R, a0)}`,
				`A ${R} ${R} 0 ${large} 1 ${point(R, a1)}`,
				`L ${point(R_IN, a1)}`,
				`A ${R_IN} ${R_IN} 0 ${large} 0 ${point(R_IN, a0)}`,
				'Z'
			].join(' ');
			const mid = (a0 + a1) / 2;
			return { ...s, svgPath, hoverDistX: Math.cos(mid) * 8, hoverDistY: Math.sin(mid) * 8 };
		});
	});

	let hovered = $state<number | null>(null);
	let mouse = $state({ x: 0, y: 0 });

	const active = $derived(hovered === null ? null : arcs[hovered]);

	function onMove(e: MouseEvent) {
		const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
		mouse = { x: e.clientX - box.left, y: e.clientY - box.top };
	}
</script>

<div class="card mx-auto w-full max-w-xs preset-filled-surface-100-900 p-5 text-center">
   	<header>
		<h3 class="h3">Library</h3>
	</header>
    <div class="flex flex-col items-center gap-6 p-6">
    	<!-- svelte-ignore a11y_no_static_element_interactions -->
    	<div class="chart" onmousemove={onMove} onmouseleave={() => (hovered = null)}>
    		<svg viewBox="0 0 {SIZE} {SIZE}" width={SIZE} height={SIZE} role="img" aria-label="Donut chart">
    			{#each arcs as a, i}
    				<path
    					d={a.svgPath}
    					fill={a.color}
    					class="slice"
    					class:dim={hovered !== null && hovered !== i}
    					style:transform={hovered === i ? `translate(${a.hoverDistX}px, ${a.hoverDistY}px)` : 'none'}
    					style:filter={hovered === i ? `drop-shadow(0 0 8px ${a.color})` : `drop-shadow(0 0 0px ${a.color})`}
    					role="img"
    					aria-label="{a.label}: {a.value}"
    					onmouseenter={() => (hovered = i)}
    				/>
    			{/each}

    			<!-- Donut centre readout -->
    			<text x={C} y={C - 5} text-anchor="middle" dominant-baseline="central" class="center-big">
    				{active ? active.value : total}
    			</text>
    			<text x={C} y={C + 24} text-anchor="middle" dominant-baseline="central" class="center-small">
    				{active ? active.label : 'Total'}
    			</text>
    		</svg>

    		{#if active}
    			<div class="tooltip" style:left="{mouse.x + 14}px" style:top="{mouse.y + 14}px">
    				<strong>{active.label}</strong>
    				{active.value} ({((active.value / total) * 100).toFixed(0)}%)
    			</div>
    		{/if}
    	</div>

    	<ul class="space-y-1">
    		{#each arcs as a, i}
    			<li
    				class="legend-item flex items-center gap-2"
    				class:active={hovered === i}
    				onmouseenter={() => (hovered = i)}
    				onmouseleave={() => (hovered = null)}
    			>
    				<span class="legend-dot" style:background={a.color}></span>
    				{a.label}: {((a.value / total) * 100).toFixed(0)}%
    			</li>
    		{/each}
    	</ul>
    </div>
</div>
<style>
	.chart {
		position: relative;
	}

	svg {
		overflow: visible;
	}

	.slice {
		cursor: pointer;
		transition:
			transform 0.2s ease,
			opacity 0.2s ease,
			filter 0.2s ease;
	}

	.slice.dim {
		opacity: 0.45;
	}

	.center-big {
		font-size: 35px;
		font-weight: 700;
		fill: currentColor;
	}

	.center-small {
		font-size: 12px;
		fill: currentColor;
		opacity: 0.7;
	}

	.tooltip {
		position: absolute;
		pointer-events: none;
		padding: 6px 10px;
		border-radius: 6px;
		background: rgb(20 20 30 / 0.92);
		color: white;
		font-size: 13px;
		white-space: nowrap;
		z-index: 10;
	}

	.legend-item {
		cursor: default;
		transition: opacity 0.2s ease;
	}

	.legend-item.active {
		font-weight: 800;
	}

	.legend-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		display: inline-block;
	}
</style>
