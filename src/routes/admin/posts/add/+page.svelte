<script lang="ts">
	import { goto } from '$app/navigation';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';
	import { onMount } from 'svelte';
	import { apiPostAddPost, apiUploadImage } from '$lib/api/posts';
	import { apiGetCategories } from '$lib/api/categories';

	let title = '';
	let description = '';
	let categories: Array<string> = [];
	let errorMessage = '';
	let categoryArr: Array<string> = [];
	let successMessage = '';
	let images: string[] = [];
	let files: FileList;

	const handleAddPost = async () => {
		try {
			await apiPostAddPost({ title, description, category: categories, images });
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

	const handleImageUpload = async () => {
		for (let file of files) {
			try {
				const imageUrl = await apiUploadImage(file);
				images = [...images, imageUrl];
			} catch (error) {
				if (error instanceof Error) {
					errorMessage = error.message;
				} else {
					errorMessage = '이미지 업로드 중 오류가 발생했습니다.';
				}
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

	onMount(async () => {
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
	});
</script>

<div class="add-container max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
	<h1 class="text-2xl font-bold mb-4">포스트 추가</h1>
	<form on:submit|preventDefault={handleAddPost} class="space-y-4">
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
			<label for="images" class="block text-sm font-medium text-gray-700">이미지</label>
			<input type="file" id="images" multiple accept="image/*" bind:files on:change={handleImageUpload} class="mt-1" />
		</div>
		{#if images.length > 0}
			<div class="grid grid-cols-2 gap-4 mt-4">
				{#each images as image}
					<img src={image} alt="업로드된 이미지" class="w-full h-auto" />
				{/each}
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
</style>
