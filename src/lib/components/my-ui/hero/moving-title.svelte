<script>
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import handSrc from '$lib/assets/images/hero-hand.png';

	onMount(() => {
		gsap.to('.up', {
			y: -20,
			duration: 2,
			delay: 0.1,
			ease: 'expo'
		});

		gsap.to('.down', {
			y: 20,
			duration: 2,
			delay: 0.1,
			ease: 'expo'
		});
	});
</script>

<div class="moving-container relative h-full w-full overflow-hidden flex flex-col justify-between">
	<span class="up absolute left-5 top-[35%] md:top-[37%] z-0 font-serif text-white text-3xl md:text-4xl">손모델</span>
	<div class="absolute top-[15%] md:top-[20%] w-full h-[160%] md:h-[70%]">
		<img src={handSrc} alt="손모델 심수연의 손" class="z-10 w-full object-cover" />
	</div>
	<span class="down absolute bottom-[35%] md:bottom-[37%] right-5 z-20 font-serif font-bold text-white text-3xl md:text-4xl">
		심 수 연
	</span>
</div>

<style>
	.moving-container {
		min-height: 100vh;
	}

	.up,
	.down {
		margin: 0.5rem;
	}
</style>
