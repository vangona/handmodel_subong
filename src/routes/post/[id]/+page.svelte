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

	let post: PostTable | null = null;
	let errorMessage = '';
	let loading = true;
	let swiper: Swiper;
	let thumbsSwiper: Swiper;
	let currentSlide = 1;
	let totalSlides = 0;

	onMount(async () => {
		const postId = Number($page.params.id);
		try {
			post = await apiGetPostById(postId);
			loading = false;
			totalSlides = post.images?.length || 0;
			// Swiper 초기화는 post 데이터가 로드된 후에 수행합니다.
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

<div class="container mx-auto px-4 py-12 max-w-3xl">
	{#if loading}
		<div class="flex justify-center items-center h-64">
			<div class="loader"></div>
		</div>
	{:else if errorMessage}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
			<strong class="font-bold">오류:</strong>
			<span class="block sm:inline">{errorMessage}</span>
		</div>
	{:else if post}
		<article class="bg-white shadow-lg rounded-lg overflow-hidden">
			{#if post.images && post.images.length > 0}
				<div class="swiper-container h-64 sm:h-96 relative">
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
				<div class="thumbs-swiper mt-4">
					<div class="swiper-wrapper">
						{#each post.images as image}
							<div class="swiper-slide">
								<img src={image} alt={post.title} class="w-full h-20 object-cover cursor-pointer">
							</div>
						{/each}
					</div>
				</div>
			{/if}
			<div class="p-6">
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
