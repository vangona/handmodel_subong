<script lang="ts">
	import { onMount } from 'svelte';
	import Analytics from '$lib/components/common/Analytics.svelte';
	import TagManager from '$lib/components/common/TagManager.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';
	import { slide, fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { beforeNavigate } from '$app/navigation';

	const items = [
		{ href: '/', label: '홈' },
		{ href: '/about', label: '소개' },
		{ href: '/contact', label: '함께 하기' },
		// { href: '/admin', label: '관리자' }
	];

	
	let containerRef: HTMLDivElement;
	let isNavVisible = true;
	let lastScrollY = 0;
	let isMenuOpen = false;
	let innerHeight: number;
	let isMobile: boolean;
	let menuTransitionDuration = 300; // 밀리초 단위
	let showScrollTopButton = false;
	let scrollY = 0;
	
	const handleClickBanner = () => {
		if ($page.url.pathname !== '/') return;
		isMobile && containerRef.scrollTop === 0 && containerRef.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
	}

	const handleScroll = (event: Event) => {
		const target = event.target as HTMLElement | null;
		if (!target) return;  // target이 null이면 함수 종료

		const currentScrollY = target.scrollTop;
		const scrollThreshold = isMobile ? target.clientHeight * 0.6 : 50;

		if (currentScrollY < scrollThreshold) {
			isNavVisible = true;
		} else if (currentScrollY > lastScrollY) {
			isNavVisible = false;
		} else {
			isNavVisible = true;
		}

		showScrollTopButton = isMobile ? currentScrollY > window.innerHeight + 50 : currentScrollY > 50;

		lastScrollY = currentScrollY;
		scrollY = currentScrollY;
	}

	function restoreScrollPosition() {
		if ($page.url.pathname !== '/') return;
		const storedScrollY = sessionStorage.getItem('scrollY');
		if (storedScrollY) { 
			setTimeout(() => {
				containerRef.scrollTo({ top: parseInt(storedScrollY), behavior: 'smooth' });
			}, 100);
		}
	}

	function scrollToTop() {
		containerRef.scrollTo({ top: isMobile ? window.innerHeight + 0 : 0, behavior: 'smooth' });
	}

	// 페이지 이동 완료 후 실행
	beforeNavigate((navigated) => {
		if (browser) {
			if (navigated.to?.route.id === '/') {
				restoreScrollPosition();
			} else {
				sessionStorage.setItem('scrollY', scrollY.toString());
			}
		}
	});

	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 768; // md 브레이크포인트
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		containerRef.addEventListener('click', handleClickBanner);

		if (browser) {
			restoreScrollPosition();
		}

		return () => {
			window.removeEventListener('resize', checkMobile);
			containerRef.removeEventListener('click', handleClickBanner);
		};
	});

	let currentPath = '';

	$: if (browser && $page.url.pathname !== currentPath) {
		currentPath = $page.url.pathname;
	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="icon" href="/favicon.png" />
	<meta name="theme-color" content="#ffffff" />
</svelte:head>

<svelte:window bind:innerHeight />

<Analytics />
<TagManager />

<div bind:this={containerRef} on:scroll={handleScroll} class="overflow-x-hidden h-full">
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
		<div class="fixed top-0 right-0 h-[320px] w-full bg-primary text-white z-50 overflow-hidden"
			 transition:slide={{duration: menuTransitionDuration}}>
			<div class="p-8">
				<button class="absolute top-2 right-9" on:click={toggleMenu}>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
				<ul class="mt-8 space-y-4">
					{#each items as item}
						<li>
							<a href={item.href} class="block py-2 hover:bg-gray-700 rounded font-serif" on:click={toggleMenu}>{item.label}</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}

	<a
		href="https://open.kakao.com/o/sBSr9QCc"
		target="_blank"
		rel="noopener noreferrer"
		class="fixed bottom-8 right-8 bg-primary text-white p-2 rounded-full shadow-lg z-40 hover:bg-primary-dark transition-colors duration-300"
		transition:fade
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 p-0.5" viewBox="0 0 208 191" fill="currentColor">
			<path fill-rule="evenodd" clip-rule="evenodd" d="M104 0C46.56 0 0 36.71 0 82C0 111.14 18.86 136.78 47.35 152.51L35.26 190.39C34.34 193.38 37.51 195.97 40.17 194.45L87.12 164.41C92.65 165.46 98.31 166 104 166C161.44 166 208 129.29 208 84C208 38.71 161.44 0 104 0Z"/>
		</svg>
	</a>
	{#if showScrollTopButton}
		<a
			href="https://open.kakao.com/o/sBSr9QCc"
			target="_blank"
			rel="noopener noreferrer"
			class="fixed bottom-20 right-8 bg-primary text-white p-2 rounded-full shadow-lg z-40 hover:bg-primary-dark transition-colors duration-300"
			transition:fade
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 p-0.5" viewBox="0 0 208 191" fill="currentColor">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M104 0C46.56 0 0 36.71 0 82C0 111.14 18.86 136.78 47.35 152.51L35.26 190.39C34.34 193.38 37.51 195.97 40.17 194.45L87.12 164.41C92.65 165.46 98.31 166 104 166C161.44 166 208 129.29 208 84C208 38.71 161.44 0 104 0Z"/>
			</svg>
		</a>
		<button
			on:click={scrollToTop}
			class="fixed bottom-8 right-8 bg-primary text-white p-2 rounded-full shadow-lg z-40 hover:bg-primary-dark transition-colors duration-300"
			transition:fade
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
			</svg>
		</button>
	{/if}

	<main class="md:pt-[72px]">
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
