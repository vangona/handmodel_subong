<script lang="ts">
	import { apiGetPosts } from '$lib/api/posts';
	import Hero from '$lib/components/my-ui/hero/hero.svelte';
	import handSrc from '$lib/assets/images/hero-hand.png';
	import type { PostTable } from '$lib/api/supabaseClient';
	import { onMount, afterUpdate } from 'svelte';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';
	import ImagePreview from '$lib/components/ui/ImagePreview.svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import PostDetail from '$lib/components/my-ui/post/PostDetail.svelte';
	import { postStore, filteredPosts } from '$lib/stores/postStore';
	import { supabase } from '$lib/api/supabaseClient';
	import type { PageData } from './$types';

	export let data: PageData;

	let mobile_phrases: string[] = [];

	let selectedCategories = ['all'];
	let categorySet: Set<string> = new Set();
	let categoryArr: Array<string> = [];
	let fetchedData: Array<PostTable> = [];
	let processedData: Array<PostTable> = [];
	let errorMessage = '';
	let scrollY = 0;
	let loading = true;
	let isLoading = false;
	let observer: IntersectionObserver;
	let loadMoreTrigger: HTMLDivElement;

	// 선택된 게시글 상태 관리
	$: selectedPostId = $page.url.searchParams.get('post');
	$: selectedPost = selectedPostId 
		? processedData.find(post => post.id.toString() === selectedPostId)
		: null;

	// 뒤로가기 시 상태 복원
	function restoreState() {
		// 카테고리 필터 복원
		const storedCategories = sessionStorage.getItem('selectedCategories');
		if (storedCategories) {
			selectedCategories = JSON.parse(storedCategories);
			processedData = fetchedData.filter(post => 
				post.category?.some(cat => selectedCategories[0] === 'all' || selectedCategories.includes(cat)) ?? false
			);
		}

		// 스크롤 위치 복원
		const storedScrollY = sessionStorage.getItem('scrollY');
		if (storedScrollY) {
			window.scrollTo(0, parseInt(storedScrollY));
		}
	}

	function handleClickPost(event: MouseEvent, postId: number) {
		event.preventDefault();
		// 현재 스크롤 위치와 카테고리 상태 저장
		sessionStorage.setItem('scrollY', scrollY.toString());
		sessionStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
		// URL 파라미터 업데이트
		const url = new URL(window.location.href);
		url.searchParams.set('post', postId.toString());
		goto(url.toString(), { replaceState: true, noScroll: true });
	}

	async function mountPostFetchData() {
		try {
			const data = await apiGetPosts();
			data?.forEach((postRow) => {			
				postRow.category?.forEach(item => categorySet.add(item));
			});

			categoryArr = Array.from(categorySet);
			categoryArr.unshift('all');

			errorMessage = '';
			fetchedData = data ?? [];
			processedData = fetchedData;

			restoreState();
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

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
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
			post.category?.some(cat => selectedCategories[0] === 'all' || selectedCategories.includes(cat)) ?? false
		);
	}

	// ESC 키로 상세보기 닫기
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && selectedPostId) {
			const url = new URL(window.location.href);
			url.searchParams.delete('post');
			goto(url.toString(), { replaceState: true });
		}
	}

	function handleClosePost() {
		const url = new URL(window.location.href);
		url.searchParams.delete('post');
		goto(url.toString(), { replaceState: true, noScroll: true });
	}

	// 그리드 투명도 상태 관리
	$: isDetailView = !!selectedPost;

	// SEO 메타 데이터
	$: metaTitle = selectedPost 
		? `${selectedPost.title} | 손모델 심수연 포트폴리오` 
		: '손모델 심수연 | 포트폴리오';
	$: metaDescription = selectedPost
		? selectedPost.description?.slice(0, 150) + (selectedPost.description && selectedPost.description.length > 150 ? '...' : '')
		: `손모델 심수연의 포트폴리오 | ${new Date().getFullYear() - 2019}년 간의 촬영 경험과 다양한 제품을 다뤄본 노하우를 바탕으로 원활한 소통과 만족스러운 결과물을 약속드립니다.`;
	$: metaImage = selectedPost?.images?.[0] ?? 'https://umpactdflfdhwbufbzzp.supabase.co/storage/v1/object/public/post-images/0.6739137500664765.jpg';

	// 초기 데이터 설정
	$: {
		if (data.posts) {
			postStore.setPosts(data.posts);
		}
	}

	async function loadMorePosts() {
		if (isLoading || !$postStore.hasMore) return;
		isLoading = true;

		const { data: posts, error } = await supabase
			.from('posts')
			.select('*')
			.order('order', { ascending: true })
			.range(
				$postStore.currentPage * $postStore.pageSize,
				($postStore.currentPage + 1) * $postStore.pageSize - 1
			);

		if (error) {
			console.error('추가 게시글 로딩 실패:', error);
		} else {
			postStore.addPosts(posts);
		}

		isLoading = false;
	}

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadMorePosts();
				}
			},
			{ rootMargin: '100px' }
		);

		if (loadMoreTrigger) {
			observer.observe(loadMoreTrigger);
		}

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDescription} />
	<meta name="keywords" content="손모델, 심수연, 포트폴리오, 광고, 촬영, 핸드모델" />
	<meta property="og:title" content={metaTitle} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:image" content={metaImage} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	{#if selectedPost}
		<link rel="canonical" href={$page.url.href} />
	{/if}
	<script type="application/ld+json">
{
	"@context": "https://schema.org",
	"@type": "WebSite",
	"name": "손모델 심수연 | 포트폴리오",
	"url": "https://subong.vercel.app",
	"description": "손모델 심수연의 포트폴리오입니다.",
	"publisher": {
		"@type": "Person",
		"name": "심수연",
		"jobTitle": "손모델"
	},
	"potentialAction": {
		"@type": "SearchAction",
		"target": "https://subong.vercel.app/?category={search_term_string}",
		"query-input": "required name=search_term_string"
	}
}
	</script>
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<Hero phrases={mobile_phrases} />

{#if selectedPost}
	<PostDetail 
		post={selectedPost} 
		posts={processedData}
		onClose={handleClosePost} 
	/>
{/if}

<div 
	class="min-h-screen relative z-20 bg-gradient-to-b from-white via-gray-50/30 to-white w-full md:ml-[360px] md:w-[calc(100%-360px)] overflow-x-hidden md:px-8 px-4"
	class:opacity-20={isDetailView}
	class:pointer-events-none={isDetailView}
	style="transition: opacity 300ms ease-out"
>
	{#if errorMessage}
		<p class="error px-2 sm:px-4 text-red-600 text-center mt-8" in:fade>{errorMessage}</p>
	{/if}
	{#if loading}
		<div class="flex justify-center items-center h-64" in:fade>
			<div class="loader"></div>
		</div>
	{:else if processedData.length > 0}
		<div class="card-container py-6 sm:py-8 md:py-10 lg:py-12 mb-20 md:mb-0" in:fade={{ duration: 300, delay: 200 }}>
			<div class="mb-8 md:mb-12 sticky top-0 md:top-4 z-10 bg-gradient-to-b from-white via-white/98 to-white/0 pb-6 pt-4 -mt-4" class:opacity-50={isDetailView}>
				<CategoryFilter categories={categoryArr} selectedCategories={selectedCategories} onSelect={handleClickCategory} />
			</div>
			<div 
				class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
				class:opacity-30={isDetailView}
			>
				{#each processedData as postRow, index}
					<a 
						href={`/post/${postRow.id}`} 
						class="card--main group relative" 
						class:opacity-100={selectedPostId === postRow.id.toString()}
						class:scale-105={selectedPostId === postRow.id.toString()}
						on:click={(e) => handleClickPost(e, postRow.id)}
						in:fade={{ duration: 400, delay: 60 * (index % 10) }}
					>
						<div class="card-inner">
							<div class="aspect-square relative overflow-hidden rounded-2xl bg-white shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
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
							<!-- 호버 오버레이 -->
							<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl">
								<div class="absolute bottom-0 left-0 right-0 p-5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
									<h3 class="text-white text-lg md:text-xl font-medium mb-2 tracking-wide">
										{postRow.title}
									</h3>
									<div class="flex flex-wrap gap-2">
										{#each postRow.category || [] as categoryData}
											<span class="badge">{categoryData}</span>
										{/each}
									</div>
								</div>
								
								<!-- 코너 데코레이션 -->
								<div class="absolute top-3 right-3 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
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
		@apply block transition-all duration-300 ease-out;
		transform-style: preserve-3d;
		perspective: 1000px;
	}
	
	.card--main:hover .card-inner {
		transform: translateY(-6px) scale(1.02);
	}
	
	.card-inner {
		@apply transition-all duration-300 ease-out;
		will-change: transform;
	}

	.badge {
		@apply bg-white/95 backdrop-blur-md text-gray-700 px-3 py-1 rounded-full text-xs font-medium;
		@apply border border-white/50;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
	}

	.loader {
		@apply border-4 border-gray-200 rounded-full w-12 h-12 animate-spin;
		border-top-color: #374151;
	}
	
	/* 전역 배경 효과 */
	:global(body) {
		background: linear-gradient(180deg, 
			#ffffff 0%, 
			#fafaf9 50%, 
			#ffffff 100%
		);
		min-height: 100vh;
	}

</style>

{#if $postStore.hasMore && isLoading}
	<div 
		class="w-full h-32 flex items-center justify-center"
		bind:this={loadMoreTrigger}
	>
		{#if isLoading}
			<div class="flex items-center gap-2 text-gray-500">
				<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
				</svg>
				<span>게시글 불러오는 중...</span>
			</div>
		{/if}
	</div>
{/if}
