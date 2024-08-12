<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import handSrc from '$lib/assets/images/hero-hand.png';

	onMount(() => {
		// onMount 이후 달아줘야함.
		gsap.registerPlugin(ScrollTrigger);

		gsap.to('.up', {
			y: -30,
			duration: 2,
			delay: 0.1,
			ease: 'expo',
			scrollTrigger: {
				trigger: '.app-container',
				start: 'top center',
				end: 'bottom center'
			}
		});

		gsap.to('.down', {
			y: 35,
			duration: 2,
			delay: 0.1,
			ease: 'expo',
			scrollTrigger: {
				trigger: '.app-container',
				start: 'top center',
				end: 'bottom center'
			}
		});
	});
</script>

<div
	class="moving-container xs:text-5xl xs:min-h-[500px] relative h-full min-h-[400px] w-full min-w-[360px] text-4xl"
>
	<span class="up absolute left-10 top-[25%] z-0 font-serif text-white">Handmodel</span>
	<div class="absolute bottom-0 w-full">
		<img src={handSrc} alt="손모델 심수연의 손" class="z-10 w-full" />
	</div>
	<span class="down absolute bottom-[30%] right-10 z-20 font-serif font-bold text-white"
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
