<script lang="ts">
	import { supabase } from '$lib/api/supabaseClient';
	import { onMount } from 'svelte';
	import type { TestTable } from '$lib/api/supabaseClient';
	import { goto } from '$app/navigation';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';

	let posts: Array<TestTable> = [];
	let filteredPosts: Array<TestTable> = [];
	let errorMessage = '';
	let categorySet: Set<string> = new Set();
	let categoryArr: Array<string> = [];
	let selectedCategory: string = 'all';
	let currentPage = 1;
	let postsPerPage = 10;
	let searchQuery = '';

	const fetchPosts = async () => {
		const { data, error } = await supabase.from('test').select('*');
		if (error) {
			errorMessage = error.message;
		} else {
			console.log('Fetched data:', data); // 데이터 확인을 위한 콘솔 로그
			posts = data;
			filteredPosts = posts;
			data.forEach((post) => {
				post.category.forEach((cat: string) => categorySet.add(cat));
			});
			categoryArr = Array.from(categorySet);
		}
	};

	const deletePost = async (id: number) => {
		if (confirm('정말로 이 포스트를 삭제하시겠습니까?')) {
			const { error } = await supabase.from('test').delete().eq('id', id);
			if (error) {
				errorMessage = error.message;
			} else {
				posts = posts.filter(post => post.id !== id);
				filterPosts(selectedCategory);
			}
		}
	};

	const editPost = (id: number) => {
		// 수정 페이지로 이동
		goto(`/admin/edit/${id}`);
	};

	const filterPosts = (category: string) => {
		selectedCategory = category;
		filteredPosts = category === 'all' ? posts : posts.filter(post => post.category.includes(category));
		currentPage = 1; // 필터링 시 첫 페이지로 이동
	};

	const paginate = (pageNumber: number) => {
		currentPage = pageNumber;
	};

	const getCurrentPosts = () => {
		const indexOfLastPost = currentPage * postsPerPage;
		const indexOfFirstPost = indexOfLastPost - postsPerPage;
		return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
	};

	const searchPosts = () => {
		filteredPosts = posts.filter(post => post.test.includes(searchQuery) || post.description.includes(searchQuery));
		currentPage = 1; // 검색 시 첫 페이지로 이동
	};

	onMount(() => {
		fetchPosts();
	});
</script>

<div class="admin-container">
	<h1>포스트 관리</h1>
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}
	<div class="search-bar">
		<input type="text" placeholder="검색..." bind:value={searchQuery} />
		<button on:click={searchPosts}>검색</button>
	</div>
	<CategoryFilter categories={categoryArr} selectedCategory={selectedCategory} onSelect={filterPosts} />
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
			{#each filteredPosts as post}
				<tr>
					<td>{post.id}</td>
					<td>{post.test}</td>
					<td>{post.category.join(', ')}</td>
					<td>{post.description}</td>
					<td>
						<button class="btn btn-edit" on:click={() => editPost(post.id)}>수정</button>
						<button class="btn btn-delete" on:click={() => deletePost(post.id)}>삭제</button>
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
	.category-filter__wrapper {
		display: flex;
		gap: 8px;
		margin-bottom: 16px;
		justify-content: center;
	}
	.category-filter__item {
		@apply relative transition-transform duration-200 ease-in-out bg-blue-500 text-white border border-gray-300 font-medium;
		&:hover {
			@apply cursor-pointer bg-blue-600 text-white;
		}
		&:active {
			@apply transform scale-95;
		}
		&.selected {
			@apply bg-green-500 text-white border-green-500;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
		}
		&::after {
			content: '';
			@apply absolute left-1/2 bottom-[-4px] w-0 h-0.5 bg-green-500 transition-all duration-300 ease;
		}
		&.selected::after {
			@apply w-full left-0;
		}
	}
	.post-table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 1rem;
	}
	.post-table th, .post-table td {
		border: 1px solid #ccc;
		padding: 0.5rem;
		text-align: left;
	}
	.post-table th {
		background-color: #f4f4f4;
	}
	.btn {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.3s ease, color 0.3s ease;
	}
	.btn-edit {
		background-color: #4caf50;
		color: white;
		border: none;
		margin-right: 0.5rem;
	}
	.btn-edit:hover {
		background-color: #45a049;
	}
	.btn-delete {
		background-color: #f44336;
		color: white;
		border: none;
	}
	.btn-delete:hover {
		background-color: #e53935;
	}
	.pagination {
		display: flex;
		justify-content: center;
		margin-top: 1rem;
	}
	.pagination button {
		margin: 0 0.25rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid #ccc;
		background-color: #fff;
		cursor: pointer;
	}
	.pagination button.active {
		background-color: #007bff;
		color: #fff;
	}
	.error {
		color: red;
		margin-top: 1rem;
	}
</style>

