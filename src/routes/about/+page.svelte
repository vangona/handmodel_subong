<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import handSrc from '$lib/assets/images/hero-hand.png';
	import { getPageContent, type PageContent } from '$lib/api/pages';

	interface AboutSections {
		brief: string
		introduction: string
		activities: string[]
	}

	interface AboutContent {
		sections: AboutSections
	}

	function isAboutContent(content: any): content is AboutContent {
		return content?.sections?.brief !== undefined &&
			   content?.sections?.introduction !== undefined &&
			   Array.isArray(content?.sections?.activities)
	}

	let visible = false;
	let pageContent: PageContent | null = null;
	let isLoading = true;

	$: content = pageContent?.content || null;
	$: sections = isAboutContent(content) ? content.sections : null;

	onMount(async () => {
		pageContent = await getPageContent('intro');
		isLoading = false;
		visible = true;
	});

	const personSchema = {
		"@context": "https://schema.org",
		"@type": "Person",
		"name": "심수연",
		"jobTitle": "손모델",
		"url": "https://subong.vercel.app/about",
		"image": "https://umpactdflfdhwbufbzzp.supabase.co/storage/v1/object/public/post-images/0.6739137500664765.jpg",
		"description": "다년 간의 촬영 경험과 다양한 제품을 다뤄본 노하우를 바탕으로 원활한 소통과 만족스러운 결과물을 약속드립니다.",
		"sameAs": [
			"https://open.kakao.com/o/sBSr9QCc"
		]
	};
</script>

<svelte:head>
	<title>소개 | 손모델 심수연</title>
	<meta name="description" content="손모델 심수연의 포트폴리오 사이트 | 다년 간의 촬영 경험과 다양한 제품을 다뤄본 노하우를 바탕으로 원활한 소통과 만족스러운 결과물을 약속드립니다." />
	<meta name="keywords" content="손모델, 심수연, 소개, 경력, 특기, 주요 활동" />
	<meta property="og:title" content="손모델 심수연 | 소개" />
	<meta property="og:description" content="손모델 심수연의 포트폴리오 사이트 | 다년 간의 촬영 경험과 다양한 제품을 다뤄본 노하우를 바탕으로 원활한 소통과 만족스러운 결과물을 약속드립니다." />
	<meta property="og:image" content="https://umpactdflfdhwbufbzzp.supabase.co/storage/v1/object/public/post-images/0.6739137500664765.jpg" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://subong.vercel.app/about" />
	<script type="application/ld+json">
		{JSON.stringify(personSchema)}
	</script>
</svelte:head>

<div class="flex justify-center items-start pt-8 md:pt-12 min-h-screen w-full bg-offwhite bg-opacity-90 pb-24">
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		{#if visible && !isLoading && sections}
			<div class="bg-white rounded-lg shadow-xl overflow-hidden" in:fade={{ duration: 500, delay: 200 }}>
				<div class="md:flex w-full">
					<div class="p-8 flex flex-col justify-center items-center w-full">
						<h1 class="block mt-1 text-3xl leading-tight font-bold text-gray-900 font-serif" in:fly={{ y: 20, duration: 500, delay: 300 }}>손모델 심수연</h1>
						<p class="mt-4 text-gray-600" in:fly={{ y: 20, duration: 500, delay: 400 }}>{sections.brief}</p>
					</div>
				</div>

				<div class="px-8 py-6">
					<h2 class="text-2xl font-semibold text-gray-800 mb-4 font-serif" in:fly={{ y: 20, duration: 500, delay: 500 }}>소개</h2>
					<p class="text-gray-600 mb-6 whitespace-pre-line" in:fly={{ y: 20, duration: 500, delay: 600 }}>{sections.introduction}</p>
					
					<h2 class="text-2xl font-semibold text-gray-800 mb-4 font-serif" in:fly={{ y: 20, duration: 500, delay: 700 }}>주요 활동</h2>
					<ul class="list-disc pl-5 text-gray-600 space-y-2 mb-6" in:fly={{ y: 20, duration: 500, delay: 800 }}>
						{#each sections.activities as activity}
							<li>{activity}</li>
						{/each}
					</ul>
				</div>
				
				<div class="px-8 py-6 bg-gray-50">
					<div class="flex flex-col sm:flex-row gap-4 justify-between" in:fly={{ y: 20, duration: 500, delay: 1000 }}>
						<a href="https://www.instagram.com/handmodel_subong/" target="_blank" rel="noopener noreferrer" class="btn flex flex-1 items-center">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
							</svg>
						</a>
						<a href="https://open.kakao.com/o/sBSr9QCc" target="_blank" rel="noopener noreferrer" class="btn flex flex-1 items-center">
							<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 6.053-.172.702-.673 2.604-.766 2.992-.116.483.259.463.429.331.276-.197 2.755-1.877 3.866-2.641.524.074 1.062.113 1.612.113 4.971 0 9-3.185 9-7.115S16.971 3 12 3z"/>
							</svg>
						</a>
					</div>
				</div>
			</div>
		{:else if isLoading}
			<div class="flex justify-center items-center min-h-[50vh]">
				<p>로딩 중...</p>
			</div>
		{:else}
			<div class="flex justify-center items-center min-h-[50vh]">
				<p>컨텐츠를 불러올 수 없습니다.</p>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.btn {
		@apply py-1 px-4 rounded-lg text-sm font-semibold transition-colors duration-300;
	}
</style>

