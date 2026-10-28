<script lang="ts">
    import type { FunFacts } from '$lib/components/stats/types';

    let { oldest, newest, longest }: {
        oldest: FunFacts | null;
        newest: FunFacts | null;
        longest: FunFacts | null;
    } = $props();

    	let imageFailed = $state(false);

</script>



<div class="card mx-auto w-full max-w-xs preset-filled-surface-100-900 px-4 py-2 text-center">
    <div class="card mx-auto w-full max-w-md preset-filled-surface-200-800 p-4 my-2 text-center">
    	<p class="text-sm opacity-70">Oldest Book: </p>
    	<p class="text-xl font-bold">{oldest?.title ?? '—'}</p>

                {#if oldest?.hasImage && !imageFailed}
        			<img
        				src="/api/covers/{oldest?.uuid}"
        				class="w-24 aspect-2/3 mx-auto object-cover rounded"
        				alt="{oldest?.title} cover"
        				onerror={() => (imageFailed = true)}
        			/>
        		{:else}
        			<div class="w-full h-full flex flex-col items-center justify-center text-center gap-4 ">
        				<p class="text-xl opacity-70">{oldest?.title}</p>
        			</div>
        		{/if}
        <p class="text-xl font-bold">{oldest?.year ?? '—'}</p>
	</div>

     <div class="card mx-auto w-full max-w-md preset-filled-surface-300-700 p-4 my-2 text-center">
        	<p class="text-sm opacity-70">Newest Book: </p>
                 	<p class="text-xl font-bold">{newest?.title ?? '—'}</p>

                    {#if newest?.hasImage && !imageFailed}
                        <img
                        	src="/api/covers/{newest?.uuid}"
                        	class="w-24 aspect-2/3 mx-auto object-cover rounded"
                        	alt="{newest?.title} cover"
                        	onerror={() => (imageFailed = true)}
                        />
                    {:else}
                            <div class="w-full h-full flex flex-col items-center justify-center text-center gap-4 ">
                            	<p class="text-xl opacity-70">{newest?.title}</p>
                            </div>
                    {/if}
            <p class="text-xl font-bold">{newest?.year ?? '—'}</p>
    </div>

    <div class="card mx-auto w-full max-w-md preset-filled-surface-400-600 p-4 my-2 text-center">
        	<p class="text-sm opacity-70">Longest Book:</p>
        	<p class="text-xl font-bold">{longest?.title ?? '—'}</p>
                 {#if longest?.hasImage && !imageFailed}
                     <img
                     	src="/api/covers/{longest?.uuid}"
                     	class="w-24 aspect-2/3 mx-auto object-cover rounded"
                     	alt="{longest?.title} cover"
                     	onerror={() => (imageFailed = true)}
                     />
                 {:else}
                         <div class="w-full h-full flex flex-col items-center justify-center text-center gap-4 ">
                         	<p class="text-xl opacity-70">{longest?.title}</p>
                         </div>
                 {/if}
            <p class="text-xl font-bold">{longest?.pages ?? '—'} pages</p>

    </div>

    <!-- <p>Most Owned Author:</p>
    <p></p>
    <p>Largest Owned Book Series:</p>
    <p></p> -->

</div>
