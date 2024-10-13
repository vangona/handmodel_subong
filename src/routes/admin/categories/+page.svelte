<script lang="ts">
	import { onMount } from 'svelte';
	import { apiGetCategories, apiPostAddCategory, apiDeleteCategory } from '$lib/api/categories';

	let categories: Array<{ id: number, name: string }> = [];
	let newCategoryName = '';
	let errorMessage = '';
	let successMessage = '';

	const fetchCategories = async () => {
		try {
			categories = await apiGetCategories();
		} catch (error) {
			errorMessage = error.message;
		}
	};

	const addCategory = async () => {
		if (!newCategoryName.trim()) {
			errorMessage = '카테고리 이름을 입력하세요.';
			return;
		}

		try {
			await apiPostAddCategory(newCategoryName);
			successMessage = '카테고리가 추가되었습니다.';
			newCategoryName = '';
			fetchCategories();
		} catch (error) {
			errorMessage = error.message;
		}
	};

	const deleteCategory = async (id: number) => {
		if (confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
			try {
				await apiDeleteCategory(id);
				successMessage = '카테고리가 삭제되었습니다.';
				fetchCategories();
			} catch (error) {
				errorMessage = error.message;
			}
		}
	};

	onMount(() => {
		fetchCategories();
	});
</script>

<div class="category-container max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
	<h1 class="text-2xl font-bold mb-4">카테고리 관리</h1>
	{#if errorMessage}
		<p class="text-red-500">{errorMessage}</p>
	{:else if successMessage}
		<p class="text-green-500">{successMessage}</p>
	{/if}
	<div class="add-category flex gap-2 mb-4">
		<input type="text" placeholder="새 카테고리 이름" bind:value={newCategoryName} class="input input-bordered w-full" />
		<button on:click={addCategory} class="btn btn-primary">추가</button>
	</div>
	<table class="category-table table-auto w-full mt-4">
		<thead>
			<tr>
				<th>ID</th>
				<th>이름</th>
				<th>액션</th>
			</tr>
		</thead>
		<tbody>
			{#each categories as category}
				<tr>
					<td>{category.id}</td>
					<td>{category.name}</td>
					<td>
						<button class="btn btn-error" on:click={() => deleteCategory(category.id)}>삭제</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.category-table th, .category-table td {
		@apply border border-gray-300 p-2;
	}
	.category-table th {
		@apply bg-gray-100;
	}
</style>
