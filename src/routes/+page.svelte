<script lang="ts">
    import type { PageData } from './$types';
    import RecentAddSection from '$lib/components/RecentAddSection.svelte';

    let { data }: { data: PageData } = $props();


</script>





<RecentAddSection books={data.newBooks} />
