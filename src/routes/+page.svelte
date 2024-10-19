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
<div class="min-h-screen relative z-20 bg-offwhite bg-opacity-90 w-full md:ml-[360px] md:w-[calc(100%-360px)] overflow-x-hidden mt-[100vh] md:mt-0">
	{#if errorMessage}
		<p class="error px-2 sm:px-4">{errorMessage}</p>
	{/if}
	{#if processedData.length > 0}
		<div class="card-container p-4 sm:p-6 md:p-8 lg:p-12">
			<h2 class="text-3xl font-bold text-center mb-8">포트폴리오</h2>
			<div class="mb-8">
				<h3 class="text-xl font-semibold mb-4">카테고리 {(selectedCategories.length > 0 && !selectedCategories.includes('all')) ? " : " + selectedCategories.join(', ') : ''}</h3>
				<CategoryFilter categories={categoryArr} selectedCategories={selectedCategories} onSelect={handleClickCategory} />
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
				{#each processedData as postRow}
					<a href={`/post/${postRow.id}`} class="card--main group">
						<div class="aspect-square relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105">
							<img src={handSrc} alt="hands" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
							<div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
								<h3 class="text-white text-xl font-bold mb-2 text-center">{postRow.title}</h3>
								<div class="flex flex-wrap justify-center gap-2 mb-2">
									{#each postRow.category as categoryData}
										<span class="badge">{categoryData}</span>
									{/each}
								</div>
								<p class="text-white text-sm text-center line-clamp-3">{postRow.description}</p>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{:else}
		<div class="flex justify-center items-center h-64">
			<div class="loader"></div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.card--main {
		@apply block transition-all duration-300 ease-in-out;
	}

	.badge {
		@apply bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-semibold;
	}

	.loader {
		@apply border-4 border-gray-200 rounded-full w-12 h-12 animate-spin;
		border-top-color: #3498db;
	}

	:global(.category-filter__wrapper) {
		@apply flex flex-wrap gap-2 justify-center;
	}

	:global(.category-filter__item) {
		@apply relative transition-all duration-200 ease-in-out cursor-pointer select-none py-2 px-4 rounded-md bg-gray-200 text-gray-800 text-sm font-medium;
		&:hover {
			@apply bg-gray-300;
		}
		&:active {
			@apply transform scale-95;
		}
		&.selected {
			@apply bg-primary text-white;
		}
	}
</style>
