<script lang="ts">
	import type { Snippet } from 'svelte';
	import XIcon from '@lucide/svelte/icons/x';
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import type { BookWithAuthors } from '$lib/server/types';
	import BookCardDetail from '$lib/components/BookCardDetail.svelte';

	let { uuid, trigger }: { uuid: string; trigger: Snippet } = $props();

	const dialogAnimation =
		'transition transition-discrete opacity-0 translate-y-[100px] starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-y-[100px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0';

	let bookDetail = $state<BookWithAuthors | null>(null);
	let loading = $state(false);
	let loadError = $state('');

	async function handleOpenChange(details: { open: boolean }) {
		if (!details.open || bookDetail) return;

		loading = true;
		loadError = '';

		try {
			const response = await fetch(`/api/books/${uuid}`);

			if (!response.ok) {
				loadError = 'Could not load book details.';
				return;
			}

			bookDetail = await response.json();
		} catch {
			loadError = 'Something went wrong while loading the book.';
		} finally {
			loading = false;
		}
	}
</script>

<Dialog onOpenChange={handleOpenChange}>
	<Dialog.Trigger class="contents">
		{@render trigger()}
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/90" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
			<Dialog.Content class="w-full max-w-xl {dialogAnimation}">
				<div class="flex justify-end mb-2">
					<Dialog.CloseTrigger class="btn-icon hover:preset-tonal">
						<XIcon class="size-4" />
					</Dialog.CloseTrigger>
				</div>

				{#if loading}
					<p class="text-sm opacity-70 text-center">Loading...</p>
				{:else if loadError}
					<p class="text-error-500 text-sm text-center">{loadError}</p>
				{:else if bookDetail}
					<BookCardDetail book={bookDetail} />
				{/if}
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
