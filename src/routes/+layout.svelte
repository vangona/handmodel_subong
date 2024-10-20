<script lang="ts">
	import { onMount } from 'svelte';
	import Analytics from '$lib/components/common/Analytics.svelte';
	import TagManager from '$lib/components/common/TagManager.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';

	const items = [
		{ href: '/', label: '홈' },
		{ href: '/about', label: '소개' },
		{ href: '/contact', label: '연락처' },
		// { href: '/admin', label: '관리자' }
	];

	let isNavVisible = true;
	let lastScrollY = 0;
	let isMenuOpen = false;
	let innerHeight: number;
	let isMobile: boolean;

	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 768; // md 브레이크포인트
		};

		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const scrollThreshold = isMobile ? innerHeight * 0.6 : 50;

			if (currentScrollY < scrollThreshold) {
				isNavVisible = true;
			} else if (currentScrollY > lastScrollY) {
				isNavVisible = false;
			} else {
				isNavVisible = true;
			}

			lastScrollY = currentScrollY;
		}

		checkMobile();
		window.addEventListener('resize', checkMobile);
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('resize', checkMobile);
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<svelte:window bind:innerHeight />

<Analytics />
<TagManager />

<div class="overflow-x-hidden h-full">
	<nav class="fixed top-0 left-0 right-0 bg-primary text-white shadow-md p-2 sm:p-4 z-50 transition-all duration-300 ease-in-out"
		 class:translate-y-0={isNavVisible}
		 class:-translate-y-full={!isNavVisible}>
		<div class="container mx-auto flex justify-between items-center">
			<a href="/" class="text-lg sm:text-xl font-bold font-serif">손모델 심수연</a>
				<button class="md:hidden" on:click={toggleMenu}>
					<svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
					</svg>
				</button>
				<ul class="hidden md:flex space-x-2 sm:space-x-4 font-serif">
					{#each items as item}
						<li>
							<Button variant="ghost" class="hover:bg-gray-500 text-sm sm:text-base lg:text-lg px-2 py-1 sm:px-3 sm:py-2">
								<a href={item.href}>{item.label}</a>
							</Button>
						</li>
					{/each}
				</ul>
		</div>
	</nav>

	<!-- 모바일 메뉴 -->
	{#if isMenuOpen}
		<button class="fixed inset-0 bg-black bg-opacity-50 z-40" on:click={toggleMenu} />
		<div class="fixed top-0 right-0 h-full w-64 bg-primary text-white z-50 transform transition-transform duration-300 ease-in-out"
			 class:translate-x-0={isMenuOpen}
			 class:translate-x-full={!isMenuOpen}>
			<div class="p-4">
				<button class="absolute top-2 right-2" on:click={toggleMenu}>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
				<ul class="mt-8 space-y-4">
					{#each items as item}
						<li>
							<a href={item.href} class="block py-2 hover:bg-gray-700 rounded" on:click={toggleMenu}>{item.label}</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}

	<main class="md:pt-20">
		<slot />
	</main>
</div>

<style lang="postcss">
	nav {
		transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
	}
	
	nav.translate-y-0 {
		transform: translateY(0);
		opacity: 1;
	}
	
	nav.-translate-y-full {
		transform: translateY(-100%);
		opacity: 0;
	}
</style>
