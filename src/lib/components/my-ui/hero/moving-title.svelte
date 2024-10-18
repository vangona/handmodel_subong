<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap/dist/gsap';
	import handSrc from '$lib/assets/images/hero-hand.png';

	onMount(() => {
		gsap.to('.up', {
			y: -30,
			duration: 2,
			delay: 0.1,
			ease: 'expo'
		});

		gsap.to('.down', {
			y: 35,
			duration: 2,
			delay: 0.1,
			ease: 'expo'
		});
	});
</script>

<div class="moving-container relative h-full w-full">
	<span class="up absolute left-2 sm:left-4 md:left-5 top-[15%] md:top-[25%] z-0 font-serif text-white text-lg sm:text-xl md:text-2xl lg:text-4xl">Handmodel</span>
	<div class="absolute bottom-0 w-full">
		<img src={handSrc} alt="손모델 심수연의 손" class="z-10 w-full h-auto object-cover" />
	</div>
	<span class="down absolute bottom-[10%] md:bottom-[30%] right-2 sm:right-4 md:right-5 z-20 font-serif font-bold text-white text-lg sm:text-xl md:text-2xl lg:text-4xl">
		심 수 연
	</span>
</div>

<style>
	.moving-container {
		display: flex;
		min-height: 150px;
		max-height: 100vh;
	}

	.up,
	.down {
		margin: 0.25rem;
	}

	@media (min-width: 640px) {
		.up,
		.down {
			margin: 0.5rem;
		}
	}
</style>
