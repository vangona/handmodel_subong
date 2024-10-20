<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { apiGetPostById, apiPutUpdatePost, apiUploadImage, apiDeleteImage } from '$lib/api/posts';
	import { apiGetCategories } from '$lib/api/categories';
	import { dndzone } from 'svelte-dnd-action';
	import type { DndEvent } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	interface DndImageItem {
		id: string;
		url: string;
	}
	let postId: number;
	let title = '';
	let description = '';
	let categories: Array<string> = [];
	let errorMessage = '';
	let categoryArr: Array<string> = [];
	let successMessage = '';
	let images: DndImageItem[] = [];
	let files: FileList;

	// URL에서 postId를 가져옵니다.s
	postId = Number(get(page).params.id);

	const fetchPost = async () => {
		if (!postId) {
			errorMessage = '유효하지 않은 포스트 ID입니다.';
			return;
		}

		try {
			const data = await apiGetPostById(postId);
			title = data.title;
			description = data.description;
			categories = data.category;
			images = (data.images || []).map(url => ({ id: url, url }));

			const categoryData = await apiGetCategories();
			categoryArr = categoryData.map(cat => cat.name);
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = 'Fetch Post Error: 알 수 없는 오류가 발생했습니다.';
			}
		}
	};

	const handleEditPost = async () => {
		try {
			await apiPutUpdatePost(postId, { 
				title, 
				description, 
				category: categories, 
				images: images.map(item => item.url) 
			});
			successMessage = '포스트 수정 완료!';
			goto('/admin/posts');
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = 'Edit Post Error: ' + error.message;
			} else {
				errorMessage = 'Edit Post Error: 알 수 없는 오류가 발생했습니다.';
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

	const handleImageUpload = async () => {
		for (let file of files) {
			try {
				const imageUrl = await apiUploadImage(file);
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

	onMount(() => {
		fetchPost();
	});
</script>

<div class="edit-container max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
	<h1 class="text-2xl font-bold mb-4">포스트 수정</h1>
	<form on:submit|preventDefault={handleEditPost} class="space-y-4">
		<div>
			<label for="title" class="block text-sm font-medium text-gray-700">제목</label>
			<input id="title" type="text" bind:value={title} required class="input input-bordered w-full mt-1" />
		</div>
		<div>
			<label for="description" class="block text-sm font-medium text-gray-700">설명</label>
			<textarea id="description" bind:value={description} required class="textarea textarea-bordered w-full mt-1"></textarea>
		</div>
		<div>
			<label for="categories" class="block text-sm font-medium text-gray-700">카테고리</label>
			<CategoryFilter categories={categoryArr} selectedCategories={categories} onSelect={handleCategorySelect} />
		</div>
		<div>
			<label for="images" class="block text-sm font-medium text-gray-700">이미지 추가</label>
			<input type="file" id="images" multiple accept="image/*" bind:files on:change={handleImageUpload} class="mt-1" />
		</div>
		{#if images.length > 0}
			<div use:dndzone={{items: images, type: 'images'}} on:consider={handleDndConsider} on:finalize={handleDndFinalize} class="dndlist">
				{#each images as image (image.id)}
					<div class="relative dndimage" animate:flip={{duration: 300}}>
						<img src={image.url} alt="업로드된 이미지" class="w-full h-auto" />
						<button type="button" on:click={() => handleImageDelete(image)} class="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">X</button>
						<span class="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-1">{images.indexOf(image) === 0 ? '대표 이미지' : images.indexOf(image) + 1}</span>
					</div>
				{/each}
			</div>
		{/if}
		<button type="submit" class="btn btn-primary w-full">수정</button>
		{#if errorMessage}
			<p class="text-red-500 mt-2">{errorMessage}</p>
			{:else if successMessage}
			<p class="text-green-500 mt-2">{successMessage}</p>
		{/if}
	</form>
</div>

<style lang="postcss">
	.edit-container {
		@apply max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg;
	}
	.dndlist {
		@apply grid grid-cols-2 gap-4 mt-4;
	}
	.dndimage {
		@apply cursor-move;
	}
</style>
