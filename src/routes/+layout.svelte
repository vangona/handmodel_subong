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
	import { Toaster } from 'svelte-sonner';
	import { getSiteSettings, type PageContent } from '$lib/api/pages';

	interface SettingsContent {
		site_title?: string
		menu_items?: Record<string, string>
	}

	function isSettingsContent(content: any): content is SettingsContent {
		return typeof content?.site_title === 'string' ||
			   (typeof content?.menu_items === 'object' && content?.menu_items !== null)
	}

	let settings: PageContent | null = null;
	
	let containerRef: HTMLDivElement;
	let isNavVisible = true;
	let lastScrollY = 0;
	let isMenuOpen = false;
	let innerHeight: number;
	let isMobile: boolean;
	let menuTransitionDuration = 300;
	let showScrollTopButton = false;
	let scrollY = 0;

	$: content = settings?.content || null;
	$: menuItems = isSettingsContent(content) && content.menu_items ? 
		Object.entries(content.menu_items).map(([href, label]) => ({ 
			href: href === 'home' ? '/' : `/${href}`, 
			label 
		})) : 
		[{ href: '/', label: '홈' }];
	$: siteTitle = isSettingsContent(content) ? content.site_title || 'Handmodel Subong' : 'Handmodel Subong';

	const handleClickBanner = () => {
		if ($page.url.pathname !== '/') return;
		isMobile && containerRef.scrollTop === 0 && containerRef.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
	}

	const handleScroll = (event: Event) => {
		const target = event.target as HTMLElement | null;
		if (!target) return;

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
		if (storedScrollY && !$page.url.searchParams.get('post')) {
			setTimeout(() => {
				containerRef.scrollTo({ top: parseInt(storedScrollY), behavior: 'smooth' });
			}, 100);
		}
	}

	function scrollToTop() {
		containerRef.scrollTo({ top: isMobile ? window.innerHeight + 0 : 0, behavior: 'smooth' });
	}

	beforeNavigate((navigated) => {
		if (browser) {
			if (navigated.to?.route.id === '/') {
				if (!navigated.to.url.searchParams.get('post')) {
					restoreScrollPosition();
				}
			} else {
				sessionStorage.setItem('scrollY', scrollY.toString());
			}
		}
	});

	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 768;
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		containerRef.addEventListener('click', handleClickBanner);

		if (browser) {
			restoreScrollPosition();
		}

		// Load site settings
		getSiteSettings().then(result => {
			settings = result;
		});

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
	<title>손모델 심수연 | 포트폴리오</title>
	<meta name="description" content="손모델 심수연의 포트폴리오 사이트입니다. 광고, 제품, 주얼리 등 다양한 분야의 손 모델링 작품을 만나보세요." />
	<meta name="keywords" content="손모델,심수연,포트폴리오,광고촬영,제품촬영,주얼리,핸드모델" />
	<meta name="author" content="심수연" />
	<meta property="og:site_name" content="손모델 심수연" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://subong.vercel.app" />
	<meta property="og:title" content="손모델 심수연 | 포트폴리오" />
	<meta property="og:description" content="손모델 심수연의 포트폴리오 사이트입니다. 광고, 제품, 주얼리 등 다양한 분야의 손 모델링 작품을 만나보세요." />
	<meta property="og:image" content="https://subong.vercel.app/og-image.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="손모델 심수연 | 포트폴리오" />
	<meta name="twitter:description" content="손모델 심수연의 포트폴리오 사이트입니다. 광고, 제품, 주얼리 등 다양한 분야의 손 모델링 작품을 만나보세요." />
	<meta name="twitter:image" content="https://subong.vercel.app/og-image.jpg" />
</svelte:head>

<svelte:window bind:innerHeight />

<Analytics />
<TagManager />

<div bind:this={containerRef} on:scroll={handleScroll} class="overflow-x-hidden h-full">
	<nav class="fixed top-0 left-0 right-0 bg-primary text-white shadow-md p-2 sm:p-4 z-50 transition-all duration-300 ease-in-out"
		 class:translate-y-0={isNavVisible}
		 class:-translate-y-full={!isNavVisible}>
		<div class="container mx-auto flex justify-between items-center">
			<a href="/" class="text-base sm:text-lg font-normal tracking-wider">{siteTitle}</a>
			<button class="md:hidden" on:click={toggleMenu}>
				<svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
				</svg>
			</button>
			<ul class="hidden md:flex space-x-2 sm:space-x-4 font-serif">
				{#each menuItems as item}
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
					{#each menuItems as item}
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

<Toaster richColors />

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
