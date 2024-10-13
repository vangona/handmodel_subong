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

<div class="category-container">
	<h1>카테고리 관리</h1>
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{:else if successMessage}
		<p class="success">{successMessage}</p>
	{/if}
	<div class="add-category">
		<input type="text" placeholder="새 카테고리 이름" bind:value={newCategoryName} />
		<button on:click={addCategory}>추가</button>
	</div>
	<table class="category-table">
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
						<button class="btn btn-delete" on:click={() => deleteCategory(category.id)}>삭제</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.category-container {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	.add-category {
		display: flex;
		gap: 8px;
		margin-bottom: 16px;
	}
	.add-category input {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	.add-category button {
		padding: 0.5rem 1rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	.add-category button:hover {
		background-color: #0056b3;
	}
	.category-table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 1rem;
	}
	.category-table th, .category-table td {
		border: 1px solid #ccc;
		padding: 0.5rem;
		text-align: left;
	}
	.category-table th {
		background-color: #f4f4f4;
	}
	.btn-delete {
		background-color: #f44336;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}
	.btn-delete:hover {
		background-color: #e53935;
	}
	.error {
		color: red;
		margin-top: 1rem;
	}
	.success {
		color: green;
		margin-top: 1rem;
	}
	.add-category button {
		@apply btn btn-primary; /* daisyui의 기본 버튼 스타일 적용 */
	}
	.btn-delete {
		@apply btn btn-error; /* daisyui의 에러 버튼 스타일 적용 */
	}
</style>
