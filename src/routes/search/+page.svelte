<script lang="ts">
	import type { PageData } from './$types';
    import logoDraconis from '$lib/assets/logoDraconis.svg'

	let { data }: { data: PageData } = $props();

	let format = $state('book');
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
			<input class="input" type="email" placeholder="Input 10 or 13 digit ISBN to search..." />
		</label>
		<div class="flex justify-end">
			<button type="submit" class="btn preset-filled">Search</button>
		</div>
	</fieldset>

	<fieldset class="fieldset grid grid-cols-4 gap-4 space-y-2">
		<legend class="legend">Book Info</legend>
		<label class="label col-span-2">
			<span class="label-text">Title</span>
			<input class="input" type="text" placeholder="Book Title" />
		</label>
		<label class="label col-span-2">
			<span class="label-text">Author</span>
			<input class="input" type="text" placeholder="Author" />
		</label>
		<label class="label col-span-2">
			<span class="label-text">Series</span>
			<input class="input" type="text" placeholder="Series Title" />
		</label>
		<label class="label">
			<span class="label-text">Series Order</span>
			<input class="input" type="number" placeholder="0" />
		</label>
		<label class="label">
			<span class="label-text">Publish Year</span>
			<input class="input" type="number" placeholder="0" />
		</label>
		<label class="label col-span-2">
			<span class="label-text">Publisher</span>
			<input class="input" type="text" placeholder="Publisher" />
		</label>
		<label class="label">
			<span class="label-text">Format</span>
			<select class="select field-lg" bind:value={format}>
				{#each data.formats as f (f)}
					<option value={f}>{f}</option>
				{/each}
			</select>
		</label>
		<label class="label">
			<span class="label-text">Pages</span>
			<input class="input" type="number" placeholder="0" />
		</label>
	</fieldset>

	<footer class="flex justify-end gap-x-2">
		<button type="submit" class="btn preset-filled">Clear</button>
		<button type="submit" class="btn preset-filled">Submit</button>
	</footer>
</form>