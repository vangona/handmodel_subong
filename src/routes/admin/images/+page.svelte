<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { apiGetMainImage, apiUploadMainImage, apiDeleteMainImage } from '$lib/api/mainImages';
	import type { MainImage } from '$lib/api/supabaseClient';

	let files: FileList | undefined;
	let loading = false;
	let errorMessage = '';
	let successMessage = '';
	let mainImages: MainImage[] = [];
	let isDragging = false;

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

	async function handleImageUpload() {
		if (!files || files.length === 0) return;

		loading = true;
		errorMessage = '';
		successMessage = '';

		try {
			for (const file of files) {
				await apiUploadMainImage(file);
			}

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

	async function handleImageDelete(imageId: string, imageUrl: string) {
		if (!confirm('이미지를 삭제하시겠습니까?')) return;

		try {
			await apiDeleteMainImage(imageId, imageUrl);
			successMessage = '이미지가 성공적으로 삭제되었습니다.';
			await loadMainImages();
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = '이미지 삭제 중 오류가 발생했습니다.';
			}
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
					class="w-full object-cover rounded-lg shadow-md"
				/>
				<div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
					<button 
						type="button" 
						on:click={() => handleImageDelete(image.id.toString(), image.url)}
						class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center"
					>
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
						</svg>
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.upload-zone {
		@apply transition-all duration-300;
		&.dragging {
			@apply bg-blue-50 border-blue-300;
		}
	}
</style> 