<script lang="ts">
	import { getTest } from '$lib/api/test/testApis';
	import Hero from '$lib/components/my-ui/hero/hero.svelte';
	import handSrc from '$lib/assets/images/hero-hand.png';
	import type { TestTable } from '$lib/api/supabaseClient';

	let categorySet: Set<string> = new Set();
	let categoryArr: Array<string> = [];
	let selectedCategory: string = 'all';
	const fetcehdData: Array<TestTable> = [];
	let processedData: Array<TestTable> = [];

	async function mountTestFetchData() {
		const data = await getTest();
		// category를 맵으로 변환
		data.forEach((testRow) => {			
			testRow.category.forEach(item => categorySet.add(item));
		});

		categoryArr = Array.from(categorySet);

		fetcehdData.push(...data);
		processedData = fetcehdData;
	}

	const handleClickCategory = (category: string) => {
		selectedCategory = category;
		processedData = category === 'all' ? fetcehdData : fetcehdData.filter(item => item.category.includes(category));
	}

	mountTestFetchData();
</script>

<Hero />
<div class="min-h-screen">
	{#await processedData}
		Loading...
	{:then data}
		<div class="card-container grid grid-cols-1 grid-rows-1 p-14">
			<h3 >				
				선택된 카테고리 : {selectedCategory}
			</h3>
			<div class="category-filter__wrapper">
				<button class="category-filter__item badge badge-lg badge-ghost" on:click={() => handleClickCategory('all')}>
					all
				</button>
				{#each categoryArr as category}
					<button class="category-filter__item badge badge-lg badge-ghost" on:click={() => handleClickCategory(category)}>
						{category}
					</button>
				{/each}
			</div>
			<swiper-container slides-per-view={1} centered-slides={true} pagination={true} mousewheel-control={true} effect={'cards'}>
				<swiper-slide>
					<swiper-zoom-container>
						<img src={handSrc} alt="hands" />
					</swiper-zoom-container>
				</swiper-slide>
				<swiper-slide>
					<swiper-zoom-container>
						<img src={handSrc} alt="hands" />
					</swiper-zoom-container>
				</swiper-slide>
				<swiper-slide>
					<swiper-zoom-container>
						<img src={handSrc} alt="hands" />
					</swiper-zoom-container>
				</swiper-slide>
			</swiper-container>
			{#each data as testRow}
				<div class="card--main card image-full aspect-square">
					<figure class="object-cover">
						<img src={handSrc} alt="hands" class="w-full object-cover" />
					</figure>
					<div class="card-body items-center justify-center bg-transparent">
						<div class="card-title hover-transition">
							<div>
								{testRow.test}
							</div>
							<div class="category-wrapper">
								{#each testRow.category as categoryData}
									<div class="badge category-badge hover-transition">{categoryData}</div>
								{/each}
							</div>
						</div>
						<div class="card-actions">
							<div class="card-description hover-transition">
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
	.category-filter__wrapper {
		display: flex;
		gap: 8px;
		margin-bottom: 16px;
	}
	.category-filter__item {
		position: relative;
		transition: transform 0.2s ease-in-out;
		user-select: none;
		&:hover {
			cursor: pointer;

		}
		&:active {
			transform: scale(0.95);
		}

	}

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
		}
		.hover-transition {
			color: transparent;
			transition: 150ms all ease-in-out 50ms;
			background-color: transparent;
			border-color: transparent;
		}
		.category-wrapper {
			display: flex;
			gap: 8px;
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

	swiper-container {
		min-height: 300px;
		max-width: 100%;
	}
</style>
