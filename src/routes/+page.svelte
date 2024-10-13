<script lang="ts">
	import { getTest } from '$lib/api/test/testApis';
	import Hero from '$lib/components/my-ui/hero/hero.svelte';
	import handSrc from '$lib/assets/images/hero-hand.png';
	import type { TestTable } from '$lib/api/supabaseClient';
	import { onMount } from 'svelte';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';

	let categorySet: Set<string> = new Set();
	let categoryArr: Array<string> = [];
	let selectedCategory: string = 'all';
	const fetcehdData: Array<TestTable> = [];
	let processedData: Array<TestTable> = [];
	let errorMessage = '';

	async function mountTestFetchData() {
		try {
			const data = await getTest();
			// category를 맵으로 변환
			data.forEach((testRow) => {			
				testRow.category.forEach(item => categorySet.add(item));
			});

			categoryArr = Array.from(categorySet);

			errorMessage = ''; // 데이터를 가져오면 에러메시지 초기화
			fetcehdData.push(...data);
			processedData = fetcehdData;
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = '데이터를 가져오는 중 오류가 발생했습니다.';
			}
		}
	}

	const handleClickCategory = (category: string) => {
		selectedCategory = category;
		processedData = category === 'all' ? fetcehdData : fetcehdData.filter(item => item.category.includes(category));
	}

	onMount(() => {
		mountTestFetchData();
	});
</script>

<svelte:head>
	<title>포트폴리오 메인 페이지</title>
	<meta name="description" content="손모델의 포트폴리오 사이트입니다." />
	<meta name="keywords" content="포트폴리오, 손모델, 사진" />
</svelte:head>

<Hero />
<div class="min-h-screen">
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}
	{#await processedData}
		Loading...
	{:then data}
		<div class="card-container grid grid-cols-1 grid-rows-1 p-14">
			<h3>				
				선택된 카테고리 : {selectedCategory}
			</h3>
			<CategoryFilter categories={categoryArr} selectedCategory={selectedCategory} onSelect={handleClickCategory} />
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
		justify-content: center;
	}

	.category-filter__item {
		position: relative;
		transition: transform 0.2s ease-in-out, background-color 0.3s ease, box-shadow 0.3s ease;
		user-select: none;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		background-color: var(--primary);
		color: var(--primary-foreground);
		border: 1px solid var(--border);
		font-size: 1rem;
		font-weight: 500;
		&:hover {
			cursor: pointer;
			background-color: var(--primary-foreground);
			color: var(--primary);
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		}
		&:active {
			transform: scale(0.95);
		}
		&.selected {
			background-color: var(--secondary);
			color: var(--secondary-foreground);
			border-color: var(--secondary);
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
		}
		&::after {
			content: '';
			position: absolute;
			left: 50%;
			bottom: -4px;
			width: 0;
			height: 2px;
			background-color: var(--secondary);
			transition: width 0.3s ease, left 0.3s ease;
		}
		&.selected::after {
			width: 100%;
			left: 0;
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
