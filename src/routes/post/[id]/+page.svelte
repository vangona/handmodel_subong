<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { apiGetPostById } from '$lib/api/posts';
	import Swiper from 'swiper';
	import { Navigation, Pagination, Thumbs } from 'swiper/modules';
	import type { PostTable } from '$lib/api/supabaseClient';
	import 'swiper/css';
	import 'swiper/css/navigation';
	import 'swiper/css/pagination';
	import 'swiper/css/thumbs';
	import { fade, fly } from 'svelte/transition';

	let post: PostTable | null = null;
	let errorMessage = '';
	let loading = true;
	let swiper: Swiper;
	let thumbsSwiper: Swiper;
	let currentSlide = 1;
	let totalSlides = 0;

	$: imageSchema = post ? {
		"@context": "https://schema.org",
		"@type": "ImageObject",
		"name": post.title,
		"description": post.description,
		"contentUrl": post.images[0],
		"thumbnailUrl": post.images[0],
		"datePublished": post.created_at,
		"author": {
			"@type": "Person",
			"name": "심수연",
			"jobTitle": "손모델",
			"url": "https://subong.vercel.app/about"
		},
		"keywords": post.category.join(", "),
		"license": "All rights reserved",
		"acquireLicensePage": "https://subong.vercel.app/contact"
	} : null;

	onMount(async () => {
		const postId = Number($page.params.id);
		try {
			post = await apiGetPostById(postId);
			loading = false;
			totalSlides = post.images?.length || 0;
			
			setTimeout(() => {
				thumbsSwiper = new Swiper('.thumbs-swiper', {
					spaceBetween: 10,
					slidesPerView: 4,
					freeMode: true,
					watchSlidesProgress: true,
				});

				swiper = new Swiper('.swiper-container', {
					modules: [Navigation, Pagination, Thumbs],
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev',
					},
					pagination: {
						el: '.swiper-pagination',
						type: 'bullets',
					},
					thumbs: {
						swiper: thumbsSwiper,
					},
					loop: true,
					on: {
						slideChange: function (this: Swiper) {
							currentSlide = (this.realIndex % totalSlides) + 1;
						}
					}
				});
			}, 0);
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = '알 수 없는 오류가 발생했습니다.';
			}
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{post ? `${post.title} | 손모델 심수연` : '손모델 심수연'}</title>
	<meta name="description" content={post ? post.description : '손모델 심수연의 포트폴리오 상세 페이지입니다.'} />
	<meta name="keywords" content={post ? `손모델, 심수연, ${post.category.join(', ')}` : '손모델, 심수연, 포트폴리오'} />
	<meta property="og:title" content={post ? `${post.title} | 손모델 심수연` : '손모델 심수연'} />
	<meta property="og:description" content={post ? post.description : '손모델 심수연의 포트폴리오 상세 페이지입니다.'} />
	<meta property="og:image" content={post && post.images && post.images.length > 0 ? post.images[0] : 'https://umpactdflfdhwbufbzzp.supabase.co/storage/v1/object/public/post-images/0.6739137500664765.jpg'} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={`https://subong.vercel.app/post/${$page.params.id}`} />
	<script type="application/ld+json">
		{JSON.stringify(data.imageSchema)}
	</script>
</svelte:head>

<div class="container mx-auto px-4 py-12 max-w-3xl">
	{#if loading}
		<div class="flex justify-center items-center h-64" in:fade>
			<div class="loader"></div>
		</div>
	{:else if errorMessage}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert" in:fade>
			<strong class="font-bold">오류:</strong>
			<span class="block sm:inline">{errorMessage}</span>
		</div>
	{:else if post}
		<article class="bg-white shadow-lg rounded-lg overflow-hidden" in:fade={{ duration: 300 }}>
			{#if post.images && post.images.length > 0}
				<div class="swiper-container h-64 sm:h-96 relative" in:fly={{ y: 20, duration: 300, delay: 150 }}>
					<div class="swiper-wrapper">
						{#each post.images as image}
							<div class="swiper-slide">
								<img src={image} alt={post.title} class="w-full h-full object-contain">
							</div>
						{/each}
					</div>
					<div class="swiper-pagination"></div>
					<div class="swiper-button-prev"></div>
					<div class="swiper-button-next"></div>
					<div class="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded z-10">
						{currentSlide} / {totalSlides}
					</div>
				</div>
				<div class="thumbs-swiper mt-4" in:fly={{ y: 20, duration: 300, delay: 300 }}>
					<div class="swiper-wrapper">
						{#each post.images as image}
							<div class="swiper-slide">
								<img src={image} alt={post.title} class="w-full h-20 object-cover cursor-pointer">
							</div>
						{/each}
					</div>
				</div>
			{/if}
			<div class="p-6" in:fly={{ y: 20, duration: 300, delay: 300 }}>
				<h1 class="text-3xl font-bold mb-4 text-gray-800 font-serif">{post.title}</h1>
				<div class="mb-4 flex flex-wrap">
					{#each post.category as category}
						<span class="badge mr-2 mb-2">{category}</span>
					{/each}
				</div>
				<p class="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">{post.description}</p>
			</div>
		</article>
	{/if}
</div>

<style lang="postcss">
	.badge {
		@apply bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold;
	}
	.loader {
		@apply border-4 border-gray-200 rounded-full w-12 h-12 animate-spin;
		border-top-color: #3498db;
	}
	:global(.swiper-button-next),
	:global(.swiper-button-prev) {
		color: white;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
	}
	:global(.swiper-pagination-bullet) {
		background: white;
		opacity: 0.7;
	}
	:global(.swiper-pagination-bullet-active) {
		opacity: 1;
	}
	:global(.thumbs-swiper .swiper-slide-thumb-active) {
		opacity: 1;
		border: 2px solid #3498db;
	}
	:global(.thumbs-swiper .swiper-slide) {
		opacity: 0.6;
		transition: opacity 0.3s ease;
	}
</style>
