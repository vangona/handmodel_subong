<script lang="ts">
	import { onMount } from 'svelte';
	import handSrc from '$lib/assets/images/hero-hand.png';
	import { apiGetMainImage } from '$lib/api/mainImages';
	import type { MainImage } from '$lib/api/supabaseClient';

	// phrases를 export로 선언하여 부모 컴포넌트에서 받을 수 있도록 함
	export let phrases: string[] = [];

	let mainImage: MainImage | null = null;

	onMount(async () => {
		const images = await apiGetMainImage();
		mainImage = images[0];
	});
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

</style>
