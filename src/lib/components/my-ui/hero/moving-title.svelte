<script>
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import handSrc from '$lib/assets/images/hero-hand.png';

	let isMobile = false;

	onMount(() => {
		isMobile = window.innerWidth < 768;
		gsap.to('.up', {
			y: '-50%',
			duration: 1.5,
			delay: 0.1,
			ease: 'back'
		});

		gsap.to('.down', {
			y: '50%',
			duration: 1.5,
			delay: 0.1,
			ease: 'back'
		});
	});
</script>

<div class="moving-container relative w-full h-full flex flex-col justify-between">
	<div class="relative flex-grow flex flex-col justify-center items-center overflow-hidden">
		{#if isMobile}
			<span class="up absolute top-[35%] left-[10%] z-10 font-serif text-white text-2xl md:text-3xl">손모델</span>
		{/if}
		<div class="w-full h-full flex items-center justify-center">
			<img src={handSrc} alt="손모델 심수연의 손" class="max-w-full max-h-full object-contain" />
		</div>
		{#if isMobile}
			<span class="down absolute bottom-[30%] right-[10%] z-10 font-serif font-bold text-white text-3xl md:text-4xl">
				심 수 연
			</span>
		{/if}
	</div>
</div>

<style>
	.moving-container {
		height: 100vh;
	}

	.up,
	.down {
		text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
	}

	@media (max-width: 768px) {
		.moving-container {
			height: calc(100vh - 60px); /* 모바일 네비게이션 바 높이를 고려 */
		}
	}
</style>
