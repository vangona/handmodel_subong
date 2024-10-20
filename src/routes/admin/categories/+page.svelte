<script lang="ts">
	import { onMount } from 'svelte';
	import { apiGetCategories, apiPostAddCategory, apiDeleteCategory } from '$lib/api/categories';

	let categories: Array<{ id: number; name: string }> = [];
	let newCategoryName = '';
	let errorMessage = '';
	let successMessage = '';

	const loadCategories = async () => {
		try {
			categories = await apiGetCategories();
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = '알 수 없는 오류가 발생했습니다.';
			}
		}
	};

	const addCategory = async () => {
		if (!newCategoryName.trim()) {
			errorMessage = '카테고리 이름을 입력해주세요.';
			return;
		}
		try {
			await apiPostAddCategory(newCategoryName);
			await loadCategories();
			newCategoryName = '';
			successMessage = '카테고리가 성공적으로 추가되었습니다.';
			setTimeout(() => {
				successMessage = '';
			}, 3000);
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = '알 수 없는 오류가 발생했습니다.';
			}
		}
	};

	const deleteCategory = async (id: number) => {
		if (confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
			try {
				await apiDeleteCategory(id);
				await loadCategories();
				successMessage = '카테고리가 성공적으로 삭제되었습니다.';
				setTimeout(() => {
					successMessage = '';
				}, 3000);
			} catch (error) {
				if (error instanceof Error) {
					errorMessage = error.message;
				} else {
					errorMessage = '알 수 없는 오류가 발생했습니다.';
				}
			}
		}
	};

	onMount(loadCategories);
</script>

<div class="admin-container max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
	<h1 class="text-2xl font-bold mb-4">카테고리 관리</h1>
	{#if errorMessage}
		<p class="text-red-500 mb-4">{errorMessage}</p>
	{:else if successMessage}
		<p class="text-green-500 mb-4">{successMessage}</p>
	{/if}
	<div class="add-category flex gap-2 mb-4">
		<input type="text" placeholder="새 카테고리 이름" bind:value={newCategoryName} class="input input-bordered w-full" />
		<button on:click={addCategory} class="btn btn-primary">추가</button>
	</div>
	<div class="category-list grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
		{#each categories as category}
			<div class="category-item bg-blue-100 text-blue-800 rounded-lg p-4 flex justify-between items-center">
				<span class="text-sm font-medium">{category.name}</span>
				<button class="btn btn-error btn-sm" on:click={() => deleteCategory(category.id)}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
				</button>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.admin-container {
		@apply max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg;
	}
	.btn-error {
		@apply bg-red-500 hover:bg-red-600 text-white transition-colors duration-200;
	}
	.category-item {
		@apply transition-all duration-200 hover:shadow-md;
	}
</style>
