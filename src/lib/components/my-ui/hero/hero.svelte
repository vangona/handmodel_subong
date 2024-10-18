<script lang="ts">
	import { onMount } from 'svelte';
	import MovingTitle from './moving-title.svelte';

	let scrollY: number;
	let innerHeight: number;
	let isMobile: boolean;

	$: opacity = isMobile ? Math.max(1 - scrollY / (innerHeight / 2), 0) : 1;

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
	class="hero fixed top-0 left-0 w-full md:w-[360px] pointer-events-none z-10"
	class:h-full={!isMobile}
	class:h-screen={isMobile}
	style="opacity: {opacity};"
>
	<div class="hero-overlay bg-warmgray-dark opacity-50"></div>
	<div class="hero-content aspect-[16/9] md:aspect-[9/10] w-full p-0 {isMobile ? 'flex items-center justify-center' : ''}">
		<MovingTitle />
	</div>
</div>

<style>
	.hero {
		transition: opacity 0.3s ease-out;
	}
</style>
