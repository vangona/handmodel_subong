<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { apiGetPostById, apiPutUpdatePost } from '$lib/api/posts';
	import { apiGetCategories } from '$lib/api/categories';

	let postId: number;
	let title = '';
	let description = '';
	let categories: Array<string> = [];
	let errorMessage = '';
	let categoryArr: Array<string> = [];
	let successMessage = '';

	// URL에서 postId를 가져옵니다.
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

			const categoryData = await apiGetCategories();
			categoryArr = categoryData.map(cat => cat.name);
		} catch (error) {
			errorMessage = error.message;
		}
	};

	const handleEditPost = async () => {
		try {
			await apiPutUpdatePost(postId, { title, description, category: categories });
			successMessage = '포스트 수정 완료!';
			goto('/admin/posts');
		} catch (error) {
			errorMessage = error.message;
		}
	};

	const handleCategorySelect = (category: string) => {
		if (!categories.includes(category)) {
			categories = [...categories, category];
		} else {
			categories = categories.filter(cat => cat !== category);
		}
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
		<button type="submit" class="btn btn-primary w-full">수정</button>
		{#if errorMessage}
			<p class="text-red-500 mt-2">{errorMessage}</p>
		{:else if successMessage}
			<p class="text-green-500 mt-2">{successMessage}</p>
		{/if}
	</form>
</div>

<style>
	.edit-container {
		@apply max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg;
	}
</style>
