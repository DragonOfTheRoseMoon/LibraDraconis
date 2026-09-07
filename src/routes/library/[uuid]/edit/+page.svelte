<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import type { BookEntryForm } from '$lib/server/types';
	import { toaster } from '$lib/components/toaster';
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';

	const dialogAnimation =
		'transition transition-discrete opacity-0 translate-y-[100px] starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-y-[100px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0';

	let { data }: { data: PageData } = $props();

	let form = $state<BookEntryForm>({ ...data.book });
	let submitError = $state('');
	let submitting = $state(false);
	let deleting = $state(false);
	let deleteError = $state('');
	let hasImage = $state(data.book.hasImage);
	let imageFailed = $state(false);
	let coverVersion = $state(0);
	let uploadingCover = $state(false);
	let coverError = $state('');
	let coverInput: HTMLInputElement | undefined = $state();

	async function handleCoverUpload(event: Event) {
		const file = (event.currentTarget as HTMLInputElement).files?.[0];
		if (!file) return;

		uploadingCover = true;
		coverError = '';

		try {
			const body = new FormData();
			body.append('cover', file);

			const response = await fetch(`/api/books/${data.book.uuid}/cover`, {
				method: 'PUT',
				body
			});

			if (!response.ok) {
				const result = await response.json().catch(() => ({}));
				coverError = result.error ?? 'Could not upload cover.';
				toaster.create({ title: 'Upload Failed', description: coverError, type: 'error' });
				return;
			}

			hasImage = true;
			imageFailed = false;
			coverVersion += 1;
			toaster.create({ title: 'Cover Updated', description: 'The book cover was uploaded.', type: 'success' });
		} catch {
			coverError = 'Something went wrong while uploading. Check your connection and try again.';
			toaster.create({ title: 'Upload Failed', description: coverError, type: 'error' });
		} finally {
			uploadingCover = false;
			if (coverInput) coverInput.value = '';
		}
	}

	async function handleSubmit() {
		if (!form.title.trim()) {
			submitError = 'Title is required.';
			return;
		}

		submitting = true;
		submitError = '';

		try {
			const response = await fetch(`/api/books/${data.book.uuid}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form)
			});

			if (!response.ok) {
				const result = await response.json().catch(() => ({}));
				submitError = result.error ?? 'Could not save changes.';
				toaster.create({
					title: 'Save Failed',
					description: submitError,
					type: 'error'
				});
				return;
			}

			toaster.create({
				title: 'Book Updated',
				description: 'Your changes were saved.',
				type: 'success'
			});

			goto('/library');
		} catch {
			submitError = 'Something went wrong while saving. Check your connection and try again.';
			toaster.create({
				title: 'Save Failed',
				description: submitError,
				type: 'error'
			});
		} finally {
			submitting = false;
		}
	}

	async function handleDelete() {
		deleting = true;
		deleteError = '';

		try {
			const response = await fetch(`/api/books/${data.book.uuid}`, { method: 'DELETE' });

			if (!response.ok) {
				const result = await response.json().catch(() => ({}));
				deleteError = result.error ?? 'Could not delete book.';
				toaster.create({
					title: 'Delete Failed',
					description: deleteError,
					type: 'error'
				});
				return;
			}

			toaster.create({
				title: 'Book Deleted',
				description: `"${data.book.title}" was removed from your library.`,
				type: 'success'
			});

			goto('/library');
		} catch {
			deleteError = 'Something went wrong while deleting. Check your connection and try again.';
			toaster.create({
				title: 'Delete Failed',
				description: deleteError,
				type: 'error'
			});
		} finally {
			deleting = false;
		}
	}
</script>

<form class="card bg-surface-100-900 p-4 w-full max-w-xl mx-auto space-y-3">
	<header>
		<h3 class="h3">Edit Book</h3>
	</header>

	<fieldset class="fieldset space-y-2">
		<legend class="legend">Book Info</legend>

		<div class="grid grid-cols-1 md:grid-cols-5 gap-x-2 gap-y-4 ">
			<div class="md:col-span-2 md:row-span-4 space-y-2">
				<label class="group relative aspect-2/3 w-full overflow-hidden rounded border border-surface-300-700 flex items-center justify-center p-3 text-center cursor-pointer">
					{#if hasImage && !imageFailed}
						<img
							src="/api/covers/{data.book.uuid}?v={coverVersion}"
							alt="Book cover"
							class="h-full w-full object-cover"
							onerror={() => (imageFailed = true)}
						/>
					{:else}
						<p class="text-sm opacity-70">No cover available</p>
					{/if}

					<div class="absolute inset-0 flex items-center justify-center bg-surface-950/70 opacity-0 group-hover:opacity-100 transition-opacity">
						<span class="text-sm font-medium text-white">
							{uploadingCover ? 'Uploading...' : 'Upload New Image'}
						</span>
					</div>

					<input
						bind:this={coverInput}
						type="file"
						accept="image/*"
						class="hidden"
						disabled={uploadingCover}
						onchange={handleCoverUpload}
					/>
				</label>
				{#if coverError}
					<p class="text-error-500 text-sm">{coverError}</p>
				{/if}
			</div>

			<label class="label md:col-span-3">
				<span class="label-text">ISBN</span>
				<input class="input" type="text" placeholder="Book ISBN" bind:value={form.isbn} />
			</label>
			<label class="label md:col-span-3">
				<span class="label-text">Title</span>
				<input class="input" type="text" placeholder="Book Title" bind:value={form.title} />
			</label>
			<label class="label md:col-span-3">
				<span class="label-text">Author</span>
				<input class="input" type="text" placeholder="Author" bind:value={form.author} />
			</label>
			<label class="label md:col-span-2">
				<span class="label-text">Publisher</span>
				<input class="input" type="text" placeholder="Publisher" bind:value={form.publisher} />
			</label>
			<label class="label flex-1">
				<span class="label-text">Publish Year</span>
				<input class="input" type="number" min="0" placeholder="0" bind:value={form.publishYear} />
			</label>
			<label class="label md:col-span-4">
				<span class="label-text">Series</span>
				<input class="input" type="text" placeholder="Series Title" bind:value={form.series} />
			</label>
			<label class="label col-span-1">
				<span class="label-text">Series Order</span>
				<input class="input" type="number" min="0" placeholder="0" bind:value={form.order} />
			</label>

			<div class="flex gap-4 md:col-span-5">
				<label class="label flex-1">
					<span class="label-text">Format</span>
					<select class="select field-lg" bind:value={form.format}>
						{#each data.formats as f (f)}
							<option value={f}>{f}</option>
						{/each}
					</select>
				</label>
				<label class="label flex-1">
					<span class="label-text">Pages</span>
					<input class="input" type="number" min="0" placeholder="0" bind:value={form.pages} />
				</label>
				<label class="label flex-1">
					<span class="label-text">Status</span>
					<select class="select field-lg" bind:value={form.status}>
						{#each data.statuses as f (f)}
							<option value={f}>{f}</option>
						{/each}
					</select>
				</label>
			</div>
		</div>
	</fieldset>

	<footer class="flex flex-col gap-2">
		{#if submitError}
			<p class="text-error-500 text-sm">{submitError}</p>
		{/if}
		<div class="flex justify-between items-center gap-x-2">
			<Dialog>
				<Dialog.Trigger class="btn preset-filled-error-500">Delete Book</Dialog.Trigger>
				<Portal>
					<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/90" />
					<Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
						<Dialog.Content class="card bg-surface-100-900 w-full max-w-md p-4 space-y-4 shadow-xl {dialogAnimation}">
							<Dialog.Title class="text-lg font-bold">Delete "{data.book.title}"?</Dialog.Title>
							<Dialog.Description>
								This permanently removes the book, its cover image, and author links. This can't be undone.
							</Dialog.Description>
							{#if deleteError}
								<p class="text-error-500 text-sm">{deleteError}</p>
							{/if}
							<footer class="flex justify-end gap-2">
								<Dialog.CloseTrigger class="btn preset-tonal">Cancel</Dialog.CloseTrigger>
								<button type="button" class="btn preset-filled-error-500" onclick={handleDelete} disabled={deleting}>
									Confirm Delete
								</button>
							</footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog>

			<div class="flex justify-end gap-x-2">
				<a class="btn preset-tonal min-w-24" href="/library">Cancel</a>
				<button type="button" class="btn preset-filled" onclick={handleSubmit} disabled={submitting}>Save Changes</button>
			</div>
		</div>
	</footer>
</form>
