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
	let selectedCategories: Array<string> = [];
	let currentPage = 1;
	let postsPerPage = 10;
	let searchQuery = '';
	let loading = true;

	$: currentPosts = getCurrentPosts(filteredPosts, currentPage, postsPerPage);

	const loadPosts = async () => {
		try {
			loading = true;
			posts = await apiGetPosts() ?? [];
			filteredPosts = posts;
			posts.forEach((post) => {
				post.category.forEach((cat: string) => categorySet.add(cat));
			});
			categoryArr = Array.from(categorySet);
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = '알 수 없는 오류가 발생했습니다.';
			}
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
				if (error instanceof Error) {
					errorMessage = error.message;
				} else {
					errorMessage = '알 수 없는 오류가 발생했습니다.';
				}
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
	<h1 class="text-2xl font-bold mb-4">포스트 관리</h1>
	{#if errorMessage}
		<p class="text-red-500">{errorMessage}</p>
	{/if}
	<div class="search-bar flex gap-2 mb-4">
		<input type="text" placeholder="검색..." bind:value={searchQuery} class="input input-bordered w-full" />
		<button on:click={searchPosts} class="btn btn-primary">검색</button>
	</div>
	<CategoryFilter categories={categoryArr} selectedCategories={selectedCategories} onSelect={handleCategorySelect} />
	<button on:click={addPost} class="btn btn-success mt-4">포스트 추가</button>
	{#if loading}
		<p>로딩 중...</p>
	{:else}
		<table class="post-table table-auto w-full mt-4">
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
		<div class="pagination flex justify-center mt-4">
			{#each Array(Math.ceil(filteredPosts.length / postsPerPage)).fill(0) as _, index}
				<button class:active={currentPage === index + 1} on:click={() => paginate(index + 1)}>
					{index + 1}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	.admin-container {
		@apply max-w-4xl mx-auto p-8 bg-primary rounded-lg shadow-lg;
	}
	.post-table th, .post-table td {
		@apply border border-gray-300 p-2;
	}
	.post-table th {
		@apply bg-gray-100;
	}
	.pagination button {
		@apply px-4 py-2 mx-1 border border-gray-300 rounded;
	}
	.pagination button.active {
		@apply bg-blue-500 text-white;
	}
</style>
