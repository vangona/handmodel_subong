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

<div
	class="moving-container xs:text-5xl xs:min-h-[500px] relative h-full min-h-[400px] w-full text-4xl"
>
	<span class="up absolute left-5 top-[35%] z-0 font-serif text-white">Handmodel</span>
	<div class="absolute bottom-0 w-full">
		<img src={handSrc} alt="손모델 심수연의 손" class="z-10 w-full" />
	</div>
	<span class="down absolute bottom-[20%] right-5 z-20 font-serif font-bold text-white"
		>심 수 연</span
	>
</div>

<style>
	.moving-container {
		display: flex;
	}

	.up,
	.down {
		margin: 1rem;
	}
</style>
