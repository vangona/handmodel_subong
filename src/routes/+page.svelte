<script lang="ts">
	import { apiGetPosts } from '$lib/api/posts'; // posts API로 변경
	import Hero from '$lib/components/my-ui/hero/hero.svelte';
	import handSrc from '$lib/assets/images/hero-hand.png';
	import type { PostTable } from '$lib/api/supabaseClient'; // PostTable 타입으로 변경
	import { onMount } from 'svelte';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';

	let categorySet: Set<string> = new Set();
	let categoryArr: Array<string> = [];
	let selectedCategory: string = 'all';
	const fetchedData: Array<PostTable> = []; // PostTable 타입으로 변경
	let processedData: Array<PostTable> = [];
	let errorMessage = '';

	async function mountPostFetchData() {
		try {
			const data = await apiGetPosts(); // posts API로 변경
			// category를 맵으로 변환
			data.forEach((postRow) => {			
				postRow.category.forEach(item => categorySet.add(item));
			});

			categoryArr = Array.from(categorySet);

			errorMessage = ''; // 데이터를 가져오면 에러메시지 초기화
			fetchedData.push(...data);
			processedData = fetchedData;
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
		processedData = category === 'all' ? fetchedData : fetchedData.filter(item => item.category.includes(category));
	}

	let showFloatingButton = false;
	let innerHeight: number;
	let isMobile: boolean;
	let scrollY: number;

	$: showFloatingButton = !isMobile || (isMobile && scrollY > innerHeight * 0.6);

	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 768; // md 브레이크포인트
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => {
			window.removeEventListener('resize', checkMobile);
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
<div class="min-h-screen relative z-20 bg-offwhite bg-opacity-90 w-full md:ml-[360px] md:w-[calc(100%-360px)] pt-[100vh] md:pt-0 overflow-x-hidden">
	{#if errorMessage}
		<p class="error px-2 sm:px-4">{errorMessage}</p>
	{/if}
	{#await processedData}
		<p class="px-2 sm:px-4">Loading...</p>
	{:then data}
		<div class="card-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-4 md:p-8 lg:p-14">
			<h3 class="text-center mb-2 sm:mb-4 col-span-full text-sm sm:text-base">				
				선택된 카테고리 : {selectedCategory}
			</h3>
			<CategoryFilter categories={categoryArr} selectedCategory={selectedCategory} onSelect={handleClickCategory} />
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
			{#each data as postRow}
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
	{/await}
</div>

<!-- 플로팅 버튼 수정 -->
{#if showFloatingButton}
	<a href="https://open.kakao.com/o/sUb0vbkf" 
	   target="_blank" 
	   class="floating-btn"
	   class:hidden={!showFloatingButton}>
		카카오톡 문의하기
	</a>
{/if}

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

	.floating-btn {
		@apply fixed bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-8 md:right-8 z-50 btn btn-primary;
		font-size: 0.75rem;
		padding: 0.5rem 0.75rem;
		transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
		@screen sm {
			font-size: 0.875rem;
			padding: 0.75rem 1rem;
		}
	}

	.floating-btn.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.card-container {
		@apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4;
		width: 100%;
	}

	.card--main {
		@apply transition-transform duration-300 ease-in-out;
		&:hover {
			@apply transform scale-105;
		}
	}

	.min-h-screen {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
	}

	.floating-btn {
		@apply fixed bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-8 md:right-8 z-50;
	}
</style>
