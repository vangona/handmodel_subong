<script lang="ts">
	import { onMount } from 'svelte';
	import MovingTitle from './moving-title.svelte';

	export let phrases: string[] = [];

	let scrollY: number;
	let innerHeight: number;
	let isMobile: boolean;

	$: opacity = isMobile ? Math.max(1 - scrollY / (innerHeight * 0.6), 0) : 1;

	function scrollToContent() {
		if (isMobile) {
			window.scrollTo({
				top: innerHeight,
				behavior: 'smooth'
			});
		}
	}

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

<svelte:window bind:scrollY bind:innerHeight />

<div 
	role={isMobile ? 'button' : 'banner'}
	class="hero md:fixed top-0 left-0 w-full md:w-[360px] z-30 overflow-hidden"
	class:h-full={!isMobile}
	class:min-h-screen={isMobile}
	style="opacity: {isMobile ? opacity : 1};"
	on:click={scrollToContent}
>
	<div class="hero-overlay bg-warmgray-dark opacity-50"></div>
	<div class="hero-content w-full h-full p-0">
		<MovingTitle {phrases} />
	</div>
</div>

<style>
	.hero {
		transition: opacity 0.3s ease-out;
	}
</style>
