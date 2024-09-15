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
		<div class="card-container grid grid-cols-1 grid-rows-1 p-14">
			{#each data as testRow}
				<div class="card--main card image-full aspect-square">
					<figure class="object-cover">
						<img src={handSrc} alt="hands" class="w-full object-cover" />
					</figure>
					<div class="card-body items-center justify-center bg-transparent">
						<div class="card-title">
							<div>
								{testRow.test}
							</div>
							<div class="category-wrapper">
								{#each testRow.category as categoryData}
									<div class="badge category-badge">{categoryData}</div>
								{/each}
							</div>
						</div>
						<div class="card-actions">
							<div class="card-description">
								{testRow.description}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/await}
</div>

<style lang="scss">
	div.card.card--main {
		&::before {
			opacity: 0;
			transition: 200ms all ease-in-out;
			color: transparent;
		}
		&:hover::before {
			opacity: 0.75;
		}
		.card-title {
			display: flex;
			flex-direction: column;
			color: transparent;
			transition: 150ms all ease-in-out 50ms;
		}
		.category-wrapper {
			display: flex;
			gap: 8px;
			.category-badge {
				color: transparent;
				background-color: transparent;
				border-color: transparent;
				transition: 150ms all ease-in-out 50ms;
			}
		}
		.card-actions {
			.card-description {
				color: transparent;
				transition: 150ms all ease-in-out 50ms;
			}
		}
		&:hover .card-title {
			color: var(--fallback-nc, oklch(var(--nc) / var(--tw-text-opacity)));
		}
		&:hover .category-badge {
			color: black;			
			background-color: var(--fallback-nc, oklch(var(--nc) / var(--tw-text-opacity)));			
			border-color: var(--fallback-nc, oklch(var(--nc) / var(--tw-text-opacity)));	
		}
		&:hover .card-description {
			color: var(--fallback-nc, oklch(var(--nc) / var(--tw-text-opacity)));
		}
	}
</style>
