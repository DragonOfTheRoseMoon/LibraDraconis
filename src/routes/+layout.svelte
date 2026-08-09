<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Toast } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/components/toaster';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}



<Toast.Group {toaster} class="flex flex-col gap-2">
	{#snippet children(toast)}
		<Toast {toast}class="card bg-surface-100-900 p-4 shadow-xl w-80 transition-all duration-300 ease-out translate-y-4 opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100">
		<Toast.Title class="font-bold">{toast.title}</Toast.Title>
		<Toast.Description class="text-sm opacity-80">{toast.description}</Toast.Description>
		</Toast>
	{/snippet}
</Toast.Group>

