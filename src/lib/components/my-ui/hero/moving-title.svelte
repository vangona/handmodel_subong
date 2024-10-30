<script lang="ts">
	import { onMount } from 'svelte';
	import handSrc from '$lib/assets/images/hero-hand.png';
	import { apiGetMainImage } from '$lib/api/mainImages';

	let isMobile = false;
	let mainImage: string = '';

	onMount(async () => {
		mainImage = (await apiGetMainImage())[0].url;
		isMobile = window.innerWidth < 768;
	});
</script>

<div class="moving-container relative w-full h-full flex flex-col justify-between">
	<div class="relative flex-grow flex flex-col justify-center items-center overflow-hidden">
		<div class="w-full h-full flex items-center justify-center">
			{#if mainImage}
				<img src={mainImage} alt="손모델 심수연의 손" class="w-full h-full object-cover" />
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
