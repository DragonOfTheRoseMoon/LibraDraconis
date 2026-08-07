<script lang="ts">
	import type { PageData } from './$types';
	import logoDraconis from '$lib/assets/logoDraconis.svg'
	import type { GoogleBookResult, BookEntryForm, AddBookPayload } from '$lib/server/types';

	let { data }: { data: PageData } = $props();

	const emptyForm: BookEntryForm = ({
			isbn: '',
			title: '',
			author: '',
			series: '',
			order: 0,
			publisher: '',
			publishYear: 0,
			format: 'book',
			status: 'unread',
			pages: 0
		});

	let form = $state({ ...emptyForm });
	let searchisbn = $state('');
	let searchError = $state('');
	let thumbnail = $state<string | null>(null);
	let hasSearched = $state(false);
	let submitError = $state('');
	let submitting = $state(false);


	function handleClear(){
		
		form = { ...emptyForm };
		searchisbn = '';
		thumbnail = null;
		hasSearched = false;
		searchError = '';
	}



	async function handleSearch(){

		


		try {
			const response = await fetch(`/api/search?isbn=${encodeURIComponent(searchisbn)}`);

			if (!response.ok) {
				searchError = `Could not find a book for ISBN "${searchisbn}".`;
				return;
			}
			searchError = '';
			const result: GoogleBookResult = await response.json();
			thumbnail = result.thumbnail;
			hasSearched = true;
			searchisbn = '';


			form = {
				...form,
				isbn: result.isbn ?? '',
				title: result.title,
				author: result.authors.join('; '),
				series: result.series ?? '',
				publisher: result.publisher ?? '',
				publishYear: result.publishYear ?? 0,
				pages: result.pageCount ?? 0
			};


		} catch {
			searchError = 'Something went wrong while searching. Check your connection and try again.';
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
			const payload: AddBookPayload = { ...form, thumbnail };

			const response = await fetch('/api/library', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const result = await response.json().catch(() => ({}));
				submitError = result.error ?? 'Could not add book to library.';
				return;
			}

			handleClear();
		} catch {
			submitError = 'Something went wrong while saving. Check your connection and try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex items-center justify-center m-9">
	<img src={logoDraconis} alt="LibraDraconis logo" class="w-80" />
</div>

<form class="card bg-surface-100-900 p-4 w-full max-w-xl mx-auto space-y-3">
	<header>
		<h3 class="h3">Search</h3>
	</header>
	<fieldset class="fieldset space-y-2">
		<legend class="legend">Search by ISBN</legend>
		<div class="grid grid-cols-1 md:grid-cols-5 gap-x-2 gap-y-4">
			<label class="label md:col-span-4">
				<input class="input" type="text" placeholder="Input 10 or 13 digit ISBN to search..." bind:value={searchisbn} />
			</label>

			<div class="flex justify-center md:col-span-1">
				<button type="button" class="btn preset-filled min-w-24" onclick={handleSearch}>Search</button>
			</div>

			{#if searchError}
				<p class="text-error-500 text-sm md:col-span-5">{searchError}</p>
			{/if}
		</div>
	</fieldset>

	<fieldset class="fieldset space-y-2">
		<legend class="legend">Book Info</legend>

		<div class="grid grid-cols-1 md:grid-cols-5 gap-x-2 gap-y-4 ">
			<div class="md:col-span-2 md:row-span-4">
				<div class="aspect-2/3 w-full overflow-hidden rounded border border-surface-300-700 flex items-center justify-center p-3 text-center">
					{#if thumbnail}
						<img src={thumbnail} alt="Book cover" class="h-full w-full object-cover" />
					{:else if hasSearched}
						<p class="text-sm opacity-70">No cover available</p>
					{:else}
						<p class="text-sm opacity-70">Search by ISBN to add to your library</p>
					{/if}
				</div>
			</div>

			<label class="label md:col-span-3">
				<span class="label-text">ISBN</span>
				<input class="input" type="text" placeholder="Book ISBN" bind:value={form.isbn} />
			</label>
			<label class="label md:col-span-3">
				<span class="label-text">Title</span>
				<input class="input" type="text" placeholder="Book Title" bind:value={form.title}/>
			</label>
			<label class="label md:col-span-3">
				<span class="label-text">Author</span>
				<input class="input" type="text" placeholder="Author" bind:value={form.author}/>
			</label>
			<label class="label md:col-span-2">
				<span class="label-text">Publisher</span>
				<input class="input" type="text" placeholder="Publisher" bind:value={form.publisher} />
			</label>
			<label class="label flex-1">
				<span class="label-text">Publish Year</span>
				<input class="input" type="number" min="0" placeholder="0" bind:value={form.publishYear}/>
			</label>
			<label class="label md:col-span-4">
				<span class="label-text">Series</span>
				<input class="input" type="text" placeholder="Series Title" bind:value={form.series}/>
			</label>
			<label class="label col-span-1">
				<span class="label-text">Series Order</span>
				<input class="input" type="number" min="0" placeholder="0" bind:value={form.order}/>
			</label>

			<div class="flex gap-4 md:col-span-5">

				<label class="label flex-1">
					<span class="label-text">Pages</span>
					<input class="input" type="number" min="0" placeholder="0" bind:value={form.pages}/>
				</label>
				<label class="label flex-1">
					<span class="label-text">Format</span>
					<select class="select field-lg" bind:value={form.format}>
						{#each data.formats as f (f)}
							<option value={f}>{f}</option>
						{/each}
					</select>
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

	<footer class="flex flex-col items-end gap-2">
		{#if submitError}
			<p class="text-error-500 text-sm">{submitError}</p>
		{/if}
		<div class="flex justify-end gap-x-2">
			<button type="button" class="btn preset-filled min-w-24" onclick={handleClear} disabled={submitting}>Clear</button>
			<button type="button" class="btn preset-filled" onclick={handleSubmit} disabled={submitting}>Add To Library</button>
		</div>
	</footer>
</form>