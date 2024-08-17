<script lang="ts">
	import { getTest } from '$lib/api/test/testApis';
	import Hero from '$lib/components/my-ui/hero/hero.svelte';
</script>

<Hero />
<div class="min-h-screen">
	{#await getTest()}
		Loading...
	{:then data}
		{#each data as testRow}
			<div>{testRow.test}</div>
		{/each}
	{/await}
</div>
