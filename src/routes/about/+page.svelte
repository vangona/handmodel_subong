<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import handSrc from '$lib/assets/images/hero-hand.png';

	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

<svelte:head>
	<title>소개 | 손모델 심수연</title>
	<meta name="description" content="손모델 심수연의 소개 페이지입니다. 경력, 특기, 주요 활동 등을 확인하세요." />
	<meta name="keywords" content="손모델, 심수연, 소개, 경력, 특기, 주요 활동" />
	<meta property="og:title" content="손모델 심수연 | 소개" />
	<meta property="og:description" content="손모델 심수연의 소개 페이지입니다. 경력, 특기, 주요 활동 등을 확인하세요." />
	<meta property="og:image" content="/og-image-about.jpg" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://subong.vercel.app/about" />
</svelte:head>

<div class="flex justify-center items-start pt-8 md:pt-12 min-h-screen w-full bg-offwhite bg-opacity-90 pb-24">
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		{#if visible}
			<div class="bg-white rounded-lg shadow-xl overflow-hidden" in:fade={{ duration: 500, delay: 200 }}>
				<div class="md:flex">
					<div class="md:flex-shrink-0">
						<img class="h-48 w-full object-cover md:h-full md:w-48" src={handSrc} alt="손모델 심수연" />
					</div>
					<div class="p-8">
						<div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold" in:fly={{ y: 20, duration: 500, delay: 300 }}>손모델</div>
						<h1 class="block mt-1 text-3xl leading-tight font-bold text-gray-900 font-serif" in:fly={{ y: 20, duration: 500, delay: 400 }}>심수연</h1>
						<p class="mt-2 text-gray-600" in:fly={{ y: 20, duration: 500, delay: 500 }}>다양한 광고와 촬영에서 활동하는 전문 손모델입니다.</p>
					</div>
				</div>
				
				<div class="px-8 py-6">
					<h2 class="text-2xl font-semibold text-gray-800 mb-4 font-serif" in:fly={{ y: 20, duration: 500, delay: 600 }}>소개</h2>
					<p class="text-gray-600 mb-6" in:fly={{ y: 20, duration: 500, delay: 700 }}>
						안녕하세요, 손모델 심수연입니다. 저는 섬세한 손동작과 아름다운 손 라인으로 다양한 제품과 브랜드의 매력을 전달하는 일을 하고 있습니다. 
						화장품, 주얼리, 전자기기 등 다양한 분야에서 활동하며, 각 제품의 특성을 살리는 최적의 손 표현을 위해 노력하고 있습니다.
					</p>
					
					<h2 class="text-2xl font-semibold text-gray-800 mb-4 font-serif" in:fly={{ y: 20, duration: 500, delay: 800 }}>주요 활동</h2>
					<ul class="list-disc pl-5 text-gray-600 space-y-2 mb-6" in:fly={{ y: 20, duration: 500, delay: 900 }}>
						<li>다수의 화장품 브랜드 광고 촬영</li>
						<li>주얼리 브랜드 카탈로그 및 화보 촬영</li>
						<li>IT 기기 제품 소개 영상 참여</li>
						<li>식품 광고 및 요리 프로그램 핸드 모델</li>
						<li>패션 액세서리 브랜드 SNS 콘텐츠 제작</li>
					</ul>
					
					<h2 class="text-2xl font-semibold text-gray-800 mb-4 font-serif" in:fly={{ y: 20, duration: 500, delay: 1000 }}>특기</h2>
					<ul class="list-disc pl-5 text-gray-600 space-y-2 mb-6" in:fly={{ y: 20, duration: 500, delay: 1100 }}>
						<li>섬세한 손동작 연출</li>
						<li>다양한 제품 특성에 맞는 포즈 구현</li>
						<li>장시간 촬영에도 안정적인 손 컨디션 유지</li>
						<li>빠른 손동작 요구되는 영상 촬영</li>
					</ul>
				</div>
				
				<div class="px-8 py-6 bg-gray-50">
					<h2 class="text-2xl font-semibold text-gray-800 mb-4 font-serif" in:fly={{ y: 20, duration: 500, delay: 1200 }}>연락처</h2>
					<div class="flex flex-col sm:flex-row gap-4" in:fly={{ y: 20, duration: 500, delay: 1300 }}>
						<a href="https://www.instagram.com/handmodel_subong/" target="_blank" rel="noopener noreferrer" class="btn btn-primary flex items-center justify-center">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
							</svg>
							인스타그램
						</a>
						<a href="https://open.kakao.com/o/sBSr9QCc" target="_blank" rel="noopener noreferrer" class="btn btn-warning flex items-center justify-center">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 6.053-.172.702-.673 2.604-.766 2.992-.116.483.259.463.429.331.276-.197 2.755-1.877 3.866-2.641.524.074 1.062.113 1.612.113 4.971 0 9-3.185 9-7.115S16.971 3 12 3z"/>
							</svg>
							카카오톡 오픈 채팅
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.btn {
		@apply py-1 px-4 rounded-lg text-sm font-semibold transition-colors duration-300;
	}
	.btn-primary {
		@apply bg-purple-600 text-white hover:bg-purple-700;
	}
	.btn-warning {
		@apply bg-yellow-500 text-white hover:bg-yellow-600;
	}
</style>
