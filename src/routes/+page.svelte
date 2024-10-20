<script lang="ts">
	import { apiGetPosts } from '$lib/api/posts';
	import Hero from '$lib/components/my-ui/hero/hero.svelte';
	import handSrc from '$lib/assets/images/hero-hand.png';
	import type { PostTable } from '$lib/api/supabaseClient';
	import { onMount, afterUpdate } from 'svelte';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	let selectedCategories = ['all'];
	let categorySet: Set<string> = new Set();
	let categoryArr: Array<string> = [];
	let fetchedData: Array<PostTable> = [];
	let processedData: Array<PostTable> = [];
	let errorMessage = '';
	let scrollY = 0;

	const restoreCategories = () => {
			// 카테고리 필터 복원
			const storedCategories = sessionStorage.getItem('selectedCategories');
			if (storedCategories) {
				selectedCategories = JSON.parse(storedCategories);
				processedData = fetchedData.filter(post => 
					post.category.some(cat => selectedCategories.includes(cat))
				);
			}
	}

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

			restoreCategories()
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

	afterUpdate(() => {
		scrollY = window.scrollY;
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

	const handleClickPost = (event: MouseEvent, postId: number) => {
		event.preventDefault();
		if (browser) {
			sessionStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
		}
		goto(`/post/${postId}`);
	}
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>포트폴리오 메인 페이지</title>
	<meta name="description" content="손모델의 포트폴리오 사이트입니다." />
	<meta name="keywords" content="포트폴리오, 손모델, 사진" />
</svelte:head>

<Hero />
<div class="min-h-screen relative z-20 bg-offwhite bg-opacity-90 w-full md:ml-[360px] md:w-[calc(100%-360px)] overflow-x-hidden">
	{#if errorMessage}
		<p class="error px-2 sm:px-4">{errorMessage}</p>
	{/if}
	{#if processedData.length > 0}
		<div class="card-container py-4 sm:py-6 md:py-8 lg:py-12 px-1 mb-20 md:mb-0">
			<h2 class="text-3xl font-bold text-center my-8 font-serif text-gray-900">촬영기록</h2>
			<div class="mb-6 md:mb-10">
				<CategoryFilter categories={categoryArr} selectedCategories={selectedCategories} onSelect={handleClickCategory} />
			</div>
			<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
				{#each processedData as postRow}
					<a href={`/post/${postRow.id}`} class="card--main group relative" on:click={(e) => handleClickPost(e, postRow.id)}>
						<div class="aspect-square relative overflow-hidden rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:z-10 border border-gray-300">
							<img src={postRow.images && postRow.images.length > 0 ? postRow.images[0] : handSrc} alt={postRow.title} class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
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
	}
</style>
