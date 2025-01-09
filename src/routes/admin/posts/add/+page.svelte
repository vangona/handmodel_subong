<script lang="ts">
	import { goto } from '$app/navigation';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';
	import { onMount } from 'svelte';
	import { apiPostAddPost, apiUploadImage, apiDeleteImage } from '$lib/api/posts';
	import { apiGetCategories } from '$lib/api/categories';
	import { dndzone } from 'svelte-dnd-action';
	import type { DndEvent } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { DND_FLIP_DURATION } from '$lib/constants/ui';
	import imageCompression from 'browser-image-compression';

	interface DndImageItem {
		id: string;
		url: string;
	}
	let title = '';
	let description = '';
	let categories: Array<string> = [];
	let errorMessage = '';
	let categoryArr: Array<string> = [];
	let successMessage = '';
	let images: DndImageItem[] = [];
	let files: FileList;

	let dragCounter = 0;
	let isDragging = false;

	const handleAddPost = async () => {
		try {
			await apiPostAddPost({ title, description, category: categories, images: Array.from(images, item => item.url) });
			successMessage = '포스트가 성공적으로 추가되었습니다.';
			goto('/admin/posts');
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = '알 수 없는 오류가 발생했습니다.';
			}
		}
	};

	const handleCategorySelect = (category: string) => {
		if (!categories.includes(category)) {
			categories = [...categories, category];
		} else {
			categories = categories.filter(cat => cat !== category);
		}
	};

	const handleImageDelete = async (imageItem: DndImageItem) => {
		try {
			await apiDeleteImage(imageItem.url);
			images = images.filter(img => img.id !== imageItem.id);
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = 'Image Delete Error: ' + error.message;
			} else {
				errorMessage = 'Image Delete Error: 이미지 삭제 중 오류가 발생했습니다.';
			}
		}
	};

	const handleDndConsider = (e: CustomEvent<DndEvent<DndImageItem>>) => {
		images = e.detail.items;
	};

	const handleDndFinalize = (e: CustomEvent<DndEvent<DndImageItem>>) => {
		images = e.detail.items;
	};

	const handleDragEnter = (e: DragEvent) => {
		e.preventDefault();
		dragCounter++;
		isDragging = true;
	};

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		dragCounter--;
		if (dragCounter === 0) {
			isDragging = false;
		}
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
	};

	const compressImage = async (file: File) => {
		const options = {
		maxSizeMB: 0.5, // 512KB
		maxWidthOrHeight: 1920,
		useWebWorker: true
		};

		try {
			return await imageCompression(file, options);
		} catch (error) {
			console.error('Image compression failed:', error);
			return file; // 압축 실패 시 원본 파일 반환
		}
	};

	const handleImageUpload = async () => {
		for (let file of files) {
		try {
			const compressedFile = await compressImage(file);
			const imageUrl = await apiUploadImage(compressedFile);
			images = [...images, { id: imageUrl, url: imageUrl }];
		} catch (error) {
			if (error instanceof Error) {
			errorMessage = 'Image Upload Error: ' + error.message;
			} else {
			errorMessage = 'Image Upload Error: 이미지 업로드 중 오류가 발생했습니다.';
			}
		}
		}
	};

	const handleDrop = async (e: DragEvent) => {
		e.preventDefault();
		isDragging = false;
		dragCounter = 0;

		if (e.dataTransfer && e.dataTransfer.files) {
		const droppedFiles = e.dataTransfer.files;
		for (let file of droppedFiles) {
			if (file.type.startsWith('image/')) {
			try {
				const compressedFile = await compressImage(file);
				const imageUrl = await apiUploadImage(compressedFile);
				images = [...images, { id: imageUrl, url: imageUrl }];
			} catch (error) {
				if (error instanceof Error) {
				errorMessage = error.message;
				} else {
				errorMessage = '이미지 업로드 중 오류가 발생했습니다.';
				}
			}
			}
		}
		}
	};

	onMount(() => {
		(async () => {
			try {
				const categoryData = await apiGetCategories();
				categoryArr = categoryData.map(cat => cat.name);
			} catch (error) {
				if (error instanceof Error) {
					errorMessage = error.message;
				} else {
					errorMessage = '알 수 없는 오류가 발생했습니다.';
				}
			}
		})();

		const dropZone = document.getElementById('dropZone');
		if (dropZone) {
			dropZone.addEventListener('dragenter', handleDragEnter);
			dropZone.addEventListener('dragleave', handleDragLeave);
			dropZone.addEventListener('dragover', handleDragOver);
			dropZone.addEventListener('drop', handleDrop);
		}

		return () => {
			if (dropZone) {
				dropZone.removeEventListener('dragenter', handleDragEnter);
				dropZone.removeEventListener('dragleave', handleDragLeave);
				dropZone.removeEventListener('dragover', handleDragOver);
				dropZone.removeEventListener('drop', handleDrop);
			}
		};
	});
</script>

<div class="add-container max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
	<h1 class="text-2xl font-bold mb-4">포스트 추가</h1>
	<form on:submit|preventDefault={handleAddPost} class="space-y-6">
		<div>
			<label for="title" class="block text-sm font-medium text-gray-700">제목</label>
			<input id="title" type="text" bind:value={title} required class="input input-bordered w-full mt-1" />
		</div>
		<div>
			<label for="description" class="block text-sm font-medium text-gray-700">설명</label>
			<textarea id="description" bind:value={description} class="textarea textarea-bordered w-full mt-1"></textarea>
		</div>
		<div>
			<label for="categories" class="block text-sm font-medium text-gray-700">카테고리</label>
			<CategoryFilter categories={categoryArr} selectedCategories={categories} onSelect={handleCategorySelect} />
		</div>
		<div class="space-y-2">
			<label for="images" class="block text-sm font-medium text-gray-700">이미지 추가</label>
			<div id="dropZone" class="flex items-center justify-center w-full">
				<label for="images" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300 ease-in-out"
					class:bg-blue-100={isDragging}>
					<div class="flex flex-col items-center justify-center pt-5 pb-6">
						<svg class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
						</svg>
						<p class="mb-2 text-sm text-gray-500"><span class="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭</p>
						<p class="text-xs text-gray-500">PNG, JPG, GIF (최대 10MB)</p>
					</div>
					<input id="images" type="file" multiple accept="image/*" bind:files on:change={handleImageUpload} class="hidden" />
				</label>
			</div>
		</div>
		{#if images.length > 0}
			<div class="mt-4">
				<h3 class="text-lg font-medium text-gray-900 mb-2">업로드된 이미지</h3>
				<div use:dndzone={{items: images, type: 'images', flipDurationMs: DND_FLIP_DURATION}} 
					on:consider={handleDndConsider} 
					on:finalize={handleDndFinalize} 
					class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{#each images as image (image.id)}
						<div class="relative group" animate:flip={{duration: DND_FLIP_DURATION}}>
							<img src={image.url} alt="업로드된 이미지" class="w-full h-40 object-cover rounded-lg shadow-md" />
							<div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
								<button type="button" on:click={() => handleImageDelete(image)} class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 11-2 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
								</button>
							</div>
							<span class="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
								{images.indexOf(image) === 0 ? '대표 이미지' : images.indexOf(image) + 1}
							</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
		<button type="submit" class="btn btn-primary w-full">추가</button>
		{#if errorMessage}
			<p class="text-red-500 mt-2">{errorMessage}</p>
		{:else if successMessage}
			<p class="text-green-500 mt-2">{successMessage}</p>
		{/if}
	</form>
</div>

<style lang="postcss">
	.add-container {
		@apply max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg;
	}
	:global(.thumbs-swiper .swiper-slide-thumb-active) {
		opacity: 1;
		border: 2px solid #3498db;
	}
	:global(.thumbs-swiper .swiper-slide) {
		opacity: 0.6;
		transition: opacity 0.3s ease;
	}
	#dropZone {
		transition: background-color 0.3s ease;
	}
</style>
