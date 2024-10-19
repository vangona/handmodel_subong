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
			categoryArr.unshift('all'); // 'all' 카테고리를 배열의 맨 앞에 추가

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

	const handleClickCategory = (category: 'all' | string) => {
		if (selectedCategories.length === 1 && selectedCategories.includes('all')) {
			selectedCategories = [category];
		} else if (selectedCategories.length > 1 && category === 'all') {
			selectedCategories = ['all'];
		} else if (selectedCategories.includes(category)) {
			selectedCategories = selectedCategories.filter(item => item !== category);
		} else {
			selectedCategories = selectedCategories.concat(category);
		}
		processedData = category === 'all' ? fetchedData : fetchedData.filter(item => item.category.includes(category));
	}

	let showFloatingButton = false;
	let innerHeight: number;
	let isDesktop: boolean;
	let scrollY: number;

	$: showFloatingButton = isDesktop || (!isDesktop && scrollY > innerHeight * 0.6);

	onMount(() => {
		mountPostFetchData();
		const checkDesktop = () => {
			isDesktop = window.innerWidth >= 768;
		};

		checkDesktop();
		window.addEventListener('resize', checkDesktop);

		return () => {
			window.removeEventListener('resize', checkDesktop);
		};
	});
</script>

<svelte:head>
	<title>포트폴리오 메인 페이지</title>
	<meta name="description" content="손모델의 포트폴리오 사이트입니다." />
	<meta name="keywords" content="포트폴리오, 손모델, 사진" />
</svelte:head>

<svelte:window bind:innerHeight bind:scrollY />

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
			<swiper-container slides-per-view="auto" centered-slides={true} pagination={true} mousewheel-control={true} effect={'cards'} class="col-span-full mb-4 sm:mb-8">
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
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
				{#each processedData as postRow}
					<a href={`/post/${postRow.id}`} class="card--main card image-full aspect-square">
						<figure class="object-cover">
							<img src={handSrc} alt="hands" class="w-full object-cover" />
						</figure>
						<div class="card-body items-center justify-center bg-transparent">
							<div class="card-title hover-transition">
								<div>
									{postRow.title}
								</div>
								<div class="category-wrapper">
									{#each postRow.category as categoryData}
										<div class="badge category-badge hover-transition">{categoryData}</div>
									{/each}
								</div>
							</div>
							<div class="card-actions">
								<div class="card-description hover-transition">
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

<!-- 플로팅 버튼 -->
<a href="https://open.kakao.com/o/sUb0vbkf" 
	target="_blank" 
	class="floating-btn"
	class:show={showFloatingButton}>
	카카오톡 문의하기
</a>

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

	.floating-btn {
		@apply fixed bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-8 md:right-8 z-50 btn btn-primary text-xs sm:text-sm py-2 px-3 sm:py-3 sm:px-4 opacity-0 pointer-events-none transition-all duration-300 ease-in-out;
		&.show {
			@apply opacity-100 pointer-events-auto;
		}
	}

	.card--main {
		@apply transition-all duration-300 ease-in-out;
		&:hover {
			@apply transform scale-105;
		}
		&::before {
			@apply opacity-0 transition-all duration-200 ease-in-out text-transparent;
		}
		&:hover::before {
			@apply opacity-75;
		}
		.card-title {
			@apply flex flex-col;
		}
		.hover-transition {
			@apply text-transparent transition-all duration-150 ease-in-out delay-100 bg-transparent border-transparent;
		}
		.category-wrapper {
			@apply flex flex-wrap gap-2;
		}
		&:hover .card-title,
		&:hover .card-description {
			@apply text-neutral-content;
		}
		&:hover .category-badge {
			@apply text-black bg-neutral-content border-neutral-content;
		}
	}

	swiper-container {
		@apply min-h-[300px] max-w-full;
	}

	.card-container {
		@apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 w-full;
	}

	.my-min-h-screen {
		@apply min-h-screen flex flex-col items-center justify-start;
	}

	.error {
		@apply text-red-500 font-bold;
	}
</style>
