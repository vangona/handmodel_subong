<script lang="ts">
	import { apiGetPosts } from '$lib/api/posts';
	import Hero from '$lib/components/my-ui/hero/hero.svelte';
	import handSrc from '$lib/assets/images/hero-hand.png';
	import type { PostTable } from '$lib/api/supabaseClient';
	import { onMount, afterUpdate } from 'svelte';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';
	import ImagePreview from '$lib/components/ui/ImagePreview.svelte';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';

	let selectedCategories = ['all'];
	let categorySet: Set<string> = new Set();
	let categoryArr: Array<string> = [];
	let fetchedData: Array<PostTable> = [];
	let processedData: Array<PostTable> = [];
	let errorMessage = '';
	let scrollY = 0;
	let loading = true;

	const restoreCategories = () => {
		// 카테고리 필터 복원
		const storedCategories = sessionStorage.getItem('selectedCategories');
		if (storedCategories) {
			selectedCategories = JSON.parse(storedCategories);
			processedData = fetchedData.filter(post => 
				post.category.some(cat => selectedCategories[0] === 'all'  || selectedCategories.includes(cat))
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

			restoreCategories();
			loading = false;
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = '데이터를 가져오는 중 오류가 발생했습니다.';
			}
			loading = false;
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
		} else {
			selectedCategories = selectedCategories.filter(cat => cat !== 'all');
			const index = selectedCategories.indexOf(category);
			if (index > -1) {
				selectedCategories.splice(index, 1);
			} else {
				selectedCategories.push(category);
			}
			if (selectedCategories.length === 0) {
				selectedCategories = ['all'];
			}
		}
		selectedCategories = [...selectedCategories];
		sessionStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
		
		processedData = fetchedData.filter(post => 
			post.category.some(cat => selectedCategories[0] === 'all' || selectedCategories.includes(cat))
		);
	}

	function handleClickPost(event: MouseEvent, postId: number) {
		event.preventDefault();
		sessionStorage.setItem('scrollY', scrollY.toString());
		sessionStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
		goto(`/post/${postId}`);
	}
</script>

<svelte:head>
	<title>손모델 심수연 | 포트폴리오</title>
	<meta name="description" content="손모델 심수연의 포트폴리오 사이트입니다. 다양한 광고와 촬영 작품을 확인하세요." />
	<meta name="keywords" content="손모델, 심수연, 포트폴리오, 광고, 촬영, 핸드모델" />
	<meta property="og:title" content="손모델 심수연 | 포트폴리오" />
	<meta property="og:description" content="손모델 심수연의 포트폴리오 사이트입니다. 다양한 광고와 촬영 작품을 확인하세요." />
	<meta property="og:image" content="/og-image.jpg" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://subong.vercel.app" />
</svelte:head>

<Hero />
<div class="min-h-screen relative z-20 bg-offwhite bg-opacity-90 w-full md:ml-[360px] md:w-[calc(100%-360px)] overflow-x-hidden md:px-3 px-2">
	{#if errorMessage}
		<p class="error px-2 sm:px-4 text-red-600 text-center mt-8" in:fade>{errorMessage}</p>
	{/if}
	{#if loading}
		<div class="flex justify-center items-center h-64" in:fade>
			<div class="loader"></div>
		</div>
	{:else if processedData.length > 0}
		<div class="card-container py-4 sm:py-6 md:py-8 lg:py-12 mb-20 md:mb-0" in:fade={{ duration: 300, delay: 200 }}>
			<h2 class="text-3xl font-bold text-center my-8 font-serif text-gray-900">촬영기록</h2>
			<div class="mb-6 md:mb-10">
				<CategoryFilter categories={categoryArr} selectedCategories={selectedCategories} onSelect={handleClickCategory} />
			</div>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4 gap-2">
				{#each processedData as postRow, index}
					<a 
						href={`/post/${postRow.id}`} 
						class="card--main group relative" 
						on:click={(e) => handleClickPost(e, postRow.id)}
						in:fly={{ y: 20, duration: 300, delay: 100 * index }}
					>
						<div class="aspect-square relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:z-10 border border-gray-300 rounded-lg shadow-md">
							{#if postRow.images && postRow.images.length > 0}
								<div class="w-full h-full">
									<ImagePreview
										imageUrl={postRow.images[0]}
										positionX={postRow.thumbnail_position_x ?? 50}
										positionY={postRow.thumbnail_position_y ?? 50}
										scale={postRow.thumbnail_scale ?? 1}
										aspectRatio="1:1"
										mode="display"
									/>
								</div>
							{:else}
								<img src={handSrc} alt={postRow.title} class="w-full h-full object-cover" />
							{/if}
							<div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
								<h3 class="text-white text-xl font-bold mb-2 text-center font-serif">{postRow.title}</h3>
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
		<p class="text-center text-gray-600 mt-8" in:fade>표시할 데이터가 없습니다.</p>
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
