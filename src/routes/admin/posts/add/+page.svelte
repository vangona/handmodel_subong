<script lang="ts">
	import { goto } from '$app/navigation';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';
	import { onMount } from 'svelte';
	import { apiPostAddPost } from '$lib/api/posts';
	import { apiGetCategories } from '$lib/api/categories';

	let title = '';
	let description = '';
	let categories: Array<string> = [];
	let errorMessage = '';
	let categoryArr: Array<string> = [];
	let successMessage = '';

	const handleAddPost = async () => {
		try {
			await apiPostAddPost({ title, description, category: categories });
			successMessage = '포스트가 성공적으로 추가되었습니다.';
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

	onMount(async () => {
		try {
			const categoryData = await apiGetCategories();
			categoryArr = categoryData.map(cat => cat.name);
		} catch (error) {
			errorMessage = error.message;
		}
	});
</script>

<div class="add-container">
	<h1>포스트 추가</h1>
	<form on:submit|preventDefault={handleAddPost}>
		<div>
			<label for="title">제목</label>
			<input id="title" type="text" bind:value={title} required />
		</div>
		<div>
			<label for="description">설명</label>
			<textarea id="description" bind:value={description} required></textarea>
		</div>
		<div>
			<label for="categories">카테고리</label>
			<CategoryFilter categories={categoryArr} selectedCategories={categories} onSelect={handleCategorySelect} />
		</div>
		<button type="submit">추가</button>
		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{:else if successMessage}
			<p class="success">{successMessage}</p>
		{/if}
	</form>
</div>

<style>
	.add-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	form div {
		margin-bottom: 1rem;
	}
	label {
		display: block;
		margin-bottom: 0.5rem;
	}
	input, textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	button {
		width: 100%;
		padding: 0.75rem;
		background-color: #007bff;
		color: #fff;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	.error {
		color: red;
		margin-top: 1rem;
	}
	.success {
		color: green;
		margin-top: 1rem;
	}
</style>
