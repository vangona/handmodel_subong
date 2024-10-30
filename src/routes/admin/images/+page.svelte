<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { apiGetMainImage, apiUploadMainImage, apiUpdateImagePosition } from '$lib/api/mainImages';
	import ImagePositioner from '$lib/components/ui/ImagePositioner.svelte';
	import type { MainImage } from '$lib/api/supabaseClient';
	import imageCompression from 'browser-image-compression';

	let files: FileList | undefined;
	let loading = false;
	let errorMessage = '';
	let successMessage = '';
	let mainImages: MainImage[] = [];
	let isDragging = false;
	let showPositioner = false;
	let currentImage: MainImage | null = null;

	onMount(async () => {
		await loadMainImages();
	});

	async function loadMainImages() {
		try {
			mainImages = await apiGetMainImage();
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			}
		}
	}

	const compressImage = async (file: File) => {
		const options = {
			maxSizeMB: 1,
			maxWidthOrHeight: 1920,
			useWebWorker: true
		};

		try {
			return await imageCompression(file, options);
		} catch (error) {
			console.error('Image compression failed:', error);
			return file;
		}
	};

	async function handleImageUpload() {
		if (!files || files.length === 0) return;

		loading = true;
		errorMessage = '';
		successMessage = '';

		try {
			const compressedFile = await compressImage(files[0]);
			await apiUploadMainImage(compressedFile, 50, 50);
			successMessage = '이미지가 성공적으로 업로드되었습니다.';
			await loadMainImages();
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = '이미지 업로드 중 오류가 발생했습니다.';
			}
		} finally {
			loading = false;
			files = undefined;
		}
	}

	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (e.dataTransfer?.files) {
			files = e.dataTransfer.files;
			handleImageUpload();
		}
	}

	async function handlePositionSave(event: CustomEvent<{ positionX: number; positionY: number }>) {
		const { positionX, positionY } = event.detail;
		if (!currentImage) return;

		try {
			await apiUpdateImagePosition(currentImage.id.toString(), positionX, positionY);
			await loadMainImages();
			showPositioner = false;
			currentImage = null;
			successMessage = '이미지 위치가 업데이트되었습니다.';
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			}
		}
	}

	function handlePositionCancel() {
		showPositioner = false;
		currentImage = null;
	}

	function openPositioner(image: MainImage) {
		currentImage = image;
		showPositioner = true;
	}
</script>

<div class="admin-container p-4">
	<h1 class="text-2xl font-bold mb-6">메인 이미지 관리</h1>

	<div class="mb-8">
		<div 
			role="directory"
			class="upload-zone"
			class:dragging={isDragging}
			on:dragenter={handleDragEnter}
			on:dragleave={handleDragLeave}
			on:dragover|preventDefault
			on:drop={handleDrop}
		>
			<label for="imageUpload" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
				<div class="flex flex-col items-center justify-center pt-5 pb-6">
					<svg class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
					</svg>
					<p class="mb-2 text-sm text-gray-500"><span class="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭</p>
					<p class="text-xs text-gray-500">PNG, JPG (최대 10MB)</p>
				</div>
				<input 
					id="imageUpload" 
					type="file" 
					accept="image/*" 
					bind:files 
					on:change={handleImageUpload}
					class="hidden" 
					multiple
				/>
			</label>
		</div>

		{#if errorMessage}
			<p class="text-red-500 mt-4" in:fade>{errorMessage}</p>
		{/if}
		{#if successMessage}
			<p class="text-green-500 mt-4" in:fade>{successMessage}</p>
		{/if}
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each mainImages as image (image.id)}
			<div class="relative group" in:fade>
				<img 
					src={image.url} 
					alt="메인 이미지" 
					class="w-full h-full object-cover rounded-lg shadow-md"
					style="object-position: {image.position_x ?? 50}% {image.position_y ?? 50}%"
				/>
				<div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center gap-2">
					<button 
						type="button" 
						on:click={() => openPositioner(image)}
						class="btn btn-ghost text-white"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
						</svg>
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>

{#if showPositioner && currentImage}
	<ImagePositioner
		imageUrl={currentImage.url}
		positionX={currentImage.position_x ?? 50}
		positionY={currentImage.position_y ?? 50}
		on:save={handlePositionSave}
		on:cancel={handlePositionCancel}
	/>
{/if}

<style lang="postcss">
	.upload-zone {
		@apply transition-all duration-300;
		&.dragging {
			@apply bg-blue-50 border-blue-300;
		}
	}
</style> 