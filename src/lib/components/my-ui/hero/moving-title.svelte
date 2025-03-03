<script lang="ts">
	import { onMount } from 'svelte';
	import handSrc from '$lib/assets/images/hero-hand.png';
	import { apiGetMainImage } from '$lib/api/mainImages';
	import type { MainImage } from '$lib/api/supabaseClient';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	// phrases를 export로 선언하여 부모 컴포넌트에서 받을 수 있도록 함
	export let phrases: string[] = [];

	let isMobile = false;
	let mainImage: MainImage | null = null;

	let currentPhraseIndex = 0;
	let phraseInterval: ReturnType<typeof setInterval>;

	onMount(async () => {
		const images = await apiGetMainImage();
		mainImage = images[0];
		isMobile = window.innerWidth < 768;
	});

	onMount(() => {
		// 문구 자동 변경 인터벌 설정
		phraseInterval = setInterval(() => {
			currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
		}, 3000); // 3초마다 변경

		return () => {
			clearInterval(phraseInterval);
		};
	})
</script>

<div class="moving-container relative w-full h-full flex flex-col justify-between">
	<div class="relative flex-grow flex flex-col justify-center items-center overflow-hidden">
		<div class="w-full h-full flex items-center justify-center">
			{#if mainImage}
				<img 
					src={mainImage.url} 
					alt="손모델 심수연의 손" 
					class="w-full h-full object-cover"
					style="transform: translate(-50%, -50%) scale({mainImage.scale ?? 1}); position: absolute; top: {mainImage.position_y ?? 50}%; left: {mainImage.position_x ?? 50}%;"
				/>
			{:else}
				<img src={handSrc} alt="손모델 심수연의 손" class="max-w-full max-h-full object-contain" />
			{/if}
		</div>
		<div class="w-full px-6 z-10 mb-12 sm:hidden">
			<div class=" text-white flex flex-col w-full">
				<h2 class="text-xl font-bold mt-6 font-serif indent-1">
					손모델 심수연
				</h2>

				{#if phrases.length > 0}
					<div class="text-sm mt-2 mb-6 md:mb-8 font-serif h-6 overflow-hidden">
						<div class="phrase-container">
							{#each [phrases[currentPhraseIndex]] as phrase (currentPhraseIndex)}
								<p 
								in:fly={{ y: 20, duration: 300 }}
								out:fly={{ y: -20, duration: 300 }}
								animate:flip={{ duration: 400 }}>
									{phrase}
								</p>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.moving-container {
		height: 100vh;
	}
	@media (max-width: 768px) {
		.moving-container {
			height: calc(100vh - 60px); /* 모바일 네비게이션 바 높이를 고려 */
		}
	}

	.phrase-container {
		@apply relative;
	}

	.phrase-container p {
		@apply absolute left-0 right-0;
	}
</style>
