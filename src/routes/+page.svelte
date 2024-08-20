<script lang="ts">
	import { getTest } from '$lib/api/test/testApis';
	import Hero from '$lib/components/my-ui/hero/hero.svelte';
	import handSrc from '$lib/assets/images/hero-hand.png';
</script>

<Hero />
<div class="min-h-screen">
	{#await getTest()}
		Loading...
	{:then data}
		<div class="grid grid-cols-2 grid-rows-2 gap-4 p-4">
			{#each data as testRow}
				<div class="card image-full aspect-square">
					<figure class="object-cover">
						<img src={handSrc} alt="hands" class="w-full object-cover" />
					</figure>
					<div class="card-body bg-transparent">
						<div class="card-title">
							{testRow.test}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/await}
</div>
