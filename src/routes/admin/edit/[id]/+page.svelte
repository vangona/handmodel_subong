<script lang="ts">
	import { supabase } from '$lib/api/supabaseClient';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	let postId: number;
	let title = '';
	let description = '';
	let categories: Array<string> = [];
	let errorMessage = '';
	let categoryArr: Array<string> = [];
	let selectedCategory: string = 'all';
	let successMessage = '';

	// URL에서 postId를 가져옵니다.
	postId = Number(get(page).params.id);

	const fetchPost = async () => {
		if (!postId) {
			errorMessage = '유효하지 않은 포스트 ID입니다.';
			return;
		}

		const { data, error } = await supabase.from('test').select('*').eq('id', postId).single();
		if (error) {
			errorMessage = error.message;
		} else {
			title = data.test;
			description = data.description;
			categories = data.category;
			selectedCategory = categories[0] || 'all';

			// 카테고리 목록 가져오기
			const { data: categoryData, error: categoryError } = await supabase.from('categories').select('*');
			if (categoryError) {
				errorMessage = categoryError.message;
			} else {
				categoryArr = categoryData.map(cat => cat.name);
			}
		}
	};

	const handleEditPost = async () => {
		const { error } = await supabase.from('test').update({
			test: title,
			description: description,
			category: categories
		}).eq('id', postId);
		if (error) {
			errorMessage = error.message;
		} else {
			successMessage = '포스트 수정 완료!';
			goto('/admin');
		}
	};

	const handleCategorySelect = (category: string) => {
		selectedCategory = category;
		if (!categories.includes(category)) {
			categories.push(category);
		}
	};

	onMount(() => {
		fetchPost();
	});
</script>

<div class="edit-container">
	<h1>포스트 수정</h1>
	<form on:submit|preventDefault={handleEditPost}>
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
			<CategoryFilter categories={categoryArr} selectedCategory={selectedCategory} onSelect={handleCategorySelect} />
		</div>
		<button type="submit">수정</button>
		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{:else if successMessage}
			<p class="success">{successMessage}</p>
		{/if}
	</form>
</div>

<style>
	.edit-container {
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
