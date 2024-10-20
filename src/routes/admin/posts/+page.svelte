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

	$: sortedPosts = filteredPosts.sort((a, b) => a.id - b.id);
	$: currentPosts = sortedPosts.slice(
		(currentPage - 1) * postsPerPage,
		currentPage * postsPerPage
	);

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

	const paginate = (pageNumber: number) => {
		currentPage = pageNumber;
	};

	const addPost = () => {
		goto('/admin/posts/add');
	};

	const handleCategorySelect = (category: string) => {
		if (!selectedCategories.includes(category)) {
			selectedCategories = [...selectedCategories, category];
		} else {
			selectedCategories = selectedCategories.filter(cat => cat !== category);
		}
		filterPosts();
	};

	function handleRowClick(postId: number) {
		goto(`/admin/posts/edit/${postId}`);
	}

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
					<th class="w-24">액션</th>
				</tr>
			</thead>
			<tbody>
				{#each currentPosts as post}
					<tr class="cursor-pointer hover:bg-gray-100" on:click={() => handleRowClick(post.id)}>
						<td>{post.id}</td>
						<td>{post.title}</td>
						<td>
							<div class="flex flex-wrap gap-1">
								{#each post.category as cat}
									<span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">{cat}</span>
								{/each}
							</div>
						</td>
						<td class="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{post.description}</td>
						<td class="w-24">
							<button class="btn btn-error btn-sm w-full" on:click|stopPropagation={() => handleDeletePost(post.id)}>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
								삭제
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="pagination flex justify-center mt-4">
			{#each Array(Math.ceil(sortedPosts.length / postsPerPage)).fill(0) as _, index}
				<button class:active={currentPage === index + 1} on:click={() => paginate(index + 1)}>
					{index + 1}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	.admin-container {
		@apply max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg;
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
	.btn-error {
		@apply bg-red-500 hover:bg-red-600 text-white transition-colors duration-200;
	}
</style>
