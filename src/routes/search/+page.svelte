<script lang="ts">
	import type { PageData } from './$types';
	import logoDraconis from '$lib/assets/logoDraconis.svg'
	import type { Format } from '$lib/server/db/schema';
	import type { GoogleBookResult } from '$lib/server/types';



	let { data }: { data: PageData } = $props();

	type BookForm = {
		isbn: string;
		title: string;
		author: string;
		series: string;
		order: number;
		publisher: string;
		publishYear: number;
		format: Format;
		pages: number;
	};

	const emptyForm: BookForm = ({
			isbn: '',
			title: '',
			author: '',
			series: '',
			order: 0,
			publisher: '',
			publishYear: 0,
			format: 'book',
			pages: 0
		});

	let form = $state({ ...emptyForm });
	let searchisbn = $state('');
	let searchError = $state('');

	function handleClear(){
		form = { ...emptyForm };
		searchisbn = '';
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

			form = {
				...form,
				isbn: result.isbn ?? '',
				title: result.title,
				author: result.authors.join(', '),
				series: result.series ?? '',
				publisher: result.publisher ?? '',
				publishYear: result.publishYear ?? 0,
				pages: result.pageCount ?? 0
			};


		} catch {
			searchError = 'Something went wrong while searching. Check your connection and try again.';
		}
	}




//	async function handleSubmit()  :Complete after database endpoints set up
</script>

<div class="flex items-center justify-center m-9">
	<img src={logoDraconis} alt="LibraDraconis logo" class="w-80" />
</div>

<form class="card bg-surface-100-900 p-4 w-full max-w-lg mx-auto space-y-4">
	<header>
		<h3 class="h3">Search</h3>
	</header>
	<fieldset class="fieldset space-y-2">
		<legend class="legend">Search by ISBN</legend>
		<label class="label">
			<input class="input" type="text" placeholder="Input 10 or 13 digit ISBN to search..." bind:value={searchisbn} />
		</label>
		{#if searchError}
			<p class="text-error-500 text-sm">{searchError}</p>
		{/if}
		<div class="flex justify-end">
			<button type="button" class="btn preset-filled" onclick={handleSearch}>Search</button>
		</div>
	</fieldset>

	<fieldset class="fieldset grid grid-cols-4 gap-4 space-y-2">
		<legend class="legend">Book Info</legend>
				<label class="label col-span-2">
			<span class="label-text">ISBN</span>
			<input class="input" type="text" placeholder="Book ISBN" bind:value={form.isbn} />
		</label>
		<label class="label col-span-2">
			<span class="label-text">Title</span>
			<input class="input" type="text" placeholder="Book Title" bind:value={form.title}/>
		</label>
		<label class="label col-span-2">
			<span class="label-text">Author</span>
			<input class="input" type="text" placeholder="Author" bind:value={form.author}/>
		</label>
		<label class="label col-span-2">
			<span class="label-text">Series</span>
			<input class="input" type="text" placeholder="Series Title" bind:value={form.series}/>
		</label>
		<label class="label">
			<span class="label-text">Series Order</span>
			<input class="input" type="number" min="0" placeholder="0" bind:value={form.order}/>
		</label>
		<label class="label">
			<span class="label-text">Publish Year</span>
			<input class="input" type="number" min="0" placeholder="0" bind:value={form.publishYear}/>
		</label>
		<label class="label col-span-2">
			<span class="label-text">Publisher</span>
			<input class="input" type="text" placeholder="Publisher" bind:value={form.publisher} />
		</label>
		<label class="label">
			<span class="label-text">Format</span>
			<select class="select field-lg" bind:value={form.format}>
				{#each data.formats as f (f)}
					<option value={f}>{f}</option>
				{/each}
			</select>
		</label>
		<label class="label">
			<span class="label-text">Pages</span>
			<input class="input" type="number" min="0" placeholder="0" bind:value={form.pages}/>
		</label>
	</fieldset>

	<footer class="flex justify-end gap-x-2">
		<button type="button" class="btn preset-filled" onclick={handleClear}>Clear</button>
			<button type="button" class="btn preset-filled" onclick={handleSubmit}>Add To Collection</button>
	</footer>
</form>