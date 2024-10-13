<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { PostTable } from '$lib/api/supabaseClient';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';
	import { apiGetPosts, apiDeletePost } from '$lib/api/posts';

	let posts: Array<PostTable> = [];
	let filteredPosts: Array<PostTable> = [];
	let errorMessage = '';
	let categorySet: Set<string> = new Set();
	let categoryArr: Array<string> = [];
	let selectedCategories: Array<string> = []; // 여러 카테고리 선택을 위한 배열
	let currentPage = 1;
	let postsPerPage = 10;
	let searchQuery = '';
	let loading = true;

	$: currentPosts = getCurrentPosts(filteredPosts, currentPage, postsPerPage);

	const loadPosts = async () => {
		try {
			loading = true;
			posts = await apiGetPosts();
			filteredPosts = posts;
			posts.forEach((post) => {
				post.category.forEach((cat: string) => categorySet.add(cat));
			});
			categoryArr = Array.from(categorySet);
		} catch (error) {
			errorMessage = error.message;
		} finally {
			loading = false;
		}
	};

	const handleDeletePost = async (id: number) => {
		if (confirm('정말로 이 포스트를 삭제하시겠습니까?')) {
			try {
				await apiDeletePost(id);
				posts = posts.filter(post => post.id !== id);
				filterPosts();
			} catch (error) {
				errorMessage = error.message;
			}
		}
	};

	const filterPosts = () => {
		if (selectedCategories.length === 0 || selectedCategories.includes('all')) {
			filteredPosts = posts;
		} else {
			filteredPosts = posts.filter(post => selectedCategories.some(cat => post.category.includes(cat)));
		}
		currentPage = 1;
	};

	const searchPosts = () => {
		filteredPosts = posts.filter(post =>
			post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.description.toLowerCase().includes(searchQuery.toLowerCase())
		);
		currentPage = 1;
	};

	const getCurrentPosts = (posts: Array<PostTable>, page: number, perPage: number) => {
		const startIndex = (page - 1) * perPage;
		const endIndex = startIndex + perPage;
		return posts.slice(startIndex, endIndex);
	};

	const paginate = (pageNumber: number) => {
		currentPage = pageNumber;
	};

	const addPost = () => {
		goto('/admin/posts/add');
	};

	const editPost = (id: number) => {
		goto(`/admin/posts/edit/${id}`);
	};

	const handleCategorySelect = (category: string) => {
		if (!selectedCategories.includes(category)) {
			selectedCategories = [...selectedCategories, category];
		} else {
			selectedCategories = selectedCategories.filter(cat => cat !== category);
		}
		filterPosts();
	};

	onMount(() => {
		loadPosts();
	});
</script>

<div class="admin-container">
	<h1>포스트 관리</h1>
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}
	<div class="search-bar">
		<input type="text" placeholder="검색..." bind:value={searchQuery} />
		<button on:click={searchPosts} class="btn btn-primary">검색</button>
	</div>
	<CategoryFilter categories={categoryArr} selectedCategories={selectedCategories} onSelect={handleCategorySelect} />
	<button on:click={addPost} class="btn btn-success">포스트 추가</button>
	{#if loading}
		<p>로딩 중...</p>
	{:else}
		<table class="post-table">
			<thead>
				<tr>
					<th>ID</th>
					<th>제목</th>
					<th>카테고리</th>
					<th>설명</th>
					<th>액션</th>
				</tr>
			</thead>
			<tbody>
				{#each currentPosts as post}
					<tr>
						<td>{post.id}</td>
						<td>{post.title}</td>
						<td>{post.category.join(', ')}</td>
						<td>{post.description}</td>
						<td>
							<button class="btn btn-info" on:click={() => editPost(post.id)}>수정</button>
							<button class="btn btn-error" on:click={() => handleDeletePost(post.id)}>삭제</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="pagination">
			{#each Array(Math.ceil(filteredPosts.length / postsPerPage)).fill(0) as _, index}
				<button class:active={currentPage === index + 1} on:click={() => paginate(index + 1)}>
					{index + 1}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.admin-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	.search-bar {
		display: flex;
		gap: 8px;
		margin-bottom: 16px;
	}
	.search-bar input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	.search-bar button {
		padding: 0.5rem 1rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	.search-bar button:hover {
		background-color: #0056b3;
	}
	.btn-add {
		margin-bottom: 1rem;
		background-color: #28a745;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}
	.btn-add:hover {
		background-color: #218838;
	}
	.post-table {
		width: 100%;
		margin-top: 1rem;
		border-collapse: collapse;
	}
	.post-table th, .post-table td {
		border: 1px solid #ccc;
		padding: 0.5rem;
	}
	.post-table th {
		background-color: #f9f9f9;
	}
	.btn {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}
	.btn-edit {
		background-color: #17a2b8;
		color: white;
	}
	.btn-delete {
		background-color: #dc3545;
		color: white;
	}
	.pagination {
		display: flex;
		justify-content: center;
		margin-top: 1rem;
	}
	.pagination button {
		padding: 0.5rem 1rem;
		margin: 0 0.25rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: white;
		cursor: pointer;
	}
	.pagination button.active {
		background-color: #007bff;
		color: white;
	}
	.error {
		color: #e3342f;
		margin-top: 1rem;
	}
</style>
