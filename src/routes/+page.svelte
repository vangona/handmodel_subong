<script lang="ts">
	import { apiGetPosts } from '$lib/api/posts';
	import Hero from '$lib/components/my-ui/hero/hero.svelte';
	import handSrc from '$lib/assets/images/hero-hand.png';
	import type { PostTable } from '$lib/api/supabaseClient';
	import { onMount } from 'svelte';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';

	$: selectedCategories = ['all'];
	let categorySet: Set<string> = new Set();
	let categoryArr: Array<string> = [];
	let fetchedData: Array<PostTable> = [];
	let processedData: Array<PostTable> = [];
	let errorMessage = '';

	async function mountPostFetchData() {
		try {
			const data = await apiGetPosts();
			data?.forEach((postRow) => {			
				postRow.category.forEach(item => categorySet.add(item));
			});

			categoryArr = Array.from(categorySet);
			categoryArr.unshift('all');

			errorMessage = '';
			fetchedData = data ?? [];
			processedData = fetchedData;
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = '데이터를 가져오는 중 오류가 발생했습니다.';
			}
		}
	}

	onMount(() => {
		mountPostFetchData();
	});

	function handleClickCategory(category: string) {
		if (category === 'all') {
			selectedCategories = ['all'];
			processedData = fetchedData;
		} else {
			selectedCategories = selectedCategories.filter(cat => cat !== 'all');
			if (selectedCategories.includes(category)) {
				selectedCategories = selectedCategories.filter(cat => cat !== category);
			} else {
				selectedCategories = [...selectedCategories, category];
			}
			
			if (selectedCategories.length === 0) {
				selectedCategories = ['all'];
				processedData = fetchedData;
			} else {
				processedData = fetchedData.filter(post => 
					post.category.some(cat => selectedCategories.includes(cat))
				);
			}
		}
	}
</script>

<svelte:head>
	<title>포트폴리오 메인 페이지</title>
	<meta name="description" content="손모델의 포트폴리오 사이트입니다." />
	<meta name="keywords" content="포트폴리오, 손모델, 사진" />
</svelte:head>

<Hero />
<div class="my-min-h-screen relative z-20 bg-offwhite bg-opacity-90 w-full md:ml-[360px] md:w-[calc(100%-360px)] pt-[100vh] md:pt-0 overflow-x-hidden">
	{#if errorMessage}
		<p class="error px-2 sm:px-4">{errorMessage}</p>
	{/if}
	{#if processedData.length > 0}
		<div class="card-container p-2 sm:p-4 md:p-8 lg:p-14">
			<h3 class="text-center mb-2 sm:mb-4 col-span-full text-sm sm:text-base">				
				선택된 카테고리 : {selectedCategories.join(', ')}
			</h3>
			<CategoryFilter categories={categoryArr} selectedCategories={selectedCategories} onSelect={handleClickCategory} />
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
				{#each processedData as postRow}
					<a href={`/post/${postRow.id}`} class="card--main card aspect-square">
						<div class="card-content w-full h-full relative overflow-hidden">
							<img src={handSrc} alt="hands" class="w-full h-full object-cover" />
							<div class="card-body absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
								<div class="card-title text-white text-center">
									<div class="text-lg font-bold mb-2">{postRow.title}</div>
									<div class="category-wrapper flex flex-wrap justify-center gap-2 mb-2">
										{#each postRow.category as categoryData}
											<span class="badge category-badge">{categoryData}</span>
										{/each}
									</div>
								</div>
								<div class="card-description text-white text-center text-sm">
									{postRow.description}
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{:else}
		<p class="px-2 sm:px-4">Loading...</p>
	{/if}
</div>

<style lang="postcss">
	.category-filter__wrapper {
		@apply flex flex-wrap gap-2 mb-4 justify-center;
	}

	.category-filter__item {
		@apply relative transition-all duration-200 ease-in-out cursor-pointer select-none py-2 px-4 rounded-md bg-primary text-primary-foreground border border-border text-sm font-medium;
		&:hover {
			@apply bg-primary-foreground text-primary shadow-md;
		}
		&:active {
			@apply transform scale-95;
		}
		&.selected {
			@apply bg-secondary text-secondary-foreground border-secondary shadow-md;
		}
		&::after {
			content: '';
			@apply absolute left-1/2 -bottom-1 w-0 h-0.5 bg-secondary transition-all duration-300 ease-in-out;
		}
		&.selected::after {
			@apply w-full left-0;
		}
	}

	.card--main {
		@apply transition-all duration-300 ease-in-out;
		&:hover {
			@apply transform scale-105;
		}
	}

	.badge {
		@apply bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold;
	}

	.card-container {
		@apply w-full;
	}
</style>
