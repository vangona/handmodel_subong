<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { PostTable } from '$lib/api/supabaseClient';
	import CategoryFilter from '$lib/components/ui/CategoryFilter.svelte';
	import { apiGetPosts, apiDeletePost, apiUpdatePostThumbnail } from '$lib/api/posts';
	import ImagePositioner from '$lib/components/ui/ImagePositioner.svelte';
	import ImagePreview from '$lib/components/ui/ImagePreview.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { supabase } from '$lib/api/supabaseClient';
	import { toast } from 'svelte-sonner';

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
	let isMobile = false;
	let showPositioner = false;
	let currentPost: PostTable | null = null;
	let previewPositionX = 50;
	let previewPositionY = 50;
	let previewScale = 1;
	let successMessage = '';

	$: sortedPosts = filteredPosts.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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
				toast.success('포스트가 삭제되었습니다.');
			} catch (error) {
				if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error('알 수 없는 오류가 발생했습니다.');
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

	function openPositioner(post: PostTable) {
		currentPost = post;
		previewPositionX = post.thumbnail_position_x ?? 50;
		previewPositionY = post.thumbnail_position_y ?? 50;
		previewScale = post.thumbnail_scale ?? 1;
		showPositioner = true;
	}

	function handlePositionCancel() {
		showPositioner = false;
		currentPost = null;
		previewPositionX = 50;
		previewPositionY = 50;
		previewScale = 1;
	}

	function handlePositionPreview(event: CustomEvent<{ positionX: number; positionY: number; scale: number }>) {
		const { positionX, positionY, scale } = event.detail;
		previewPositionX = positionX;
		previewPositionY = positionY;
		previewScale = scale;
	}

	async function handlePositionSave(event: CustomEvent<{ positionX: number; positionY: number; scale: number }>) {
		const { positionX, positionY, scale } = event.detail;
		if (!currentPost) return;

		try {
			loading = true;
			errorMessage = '';
			await apiUpdatePostThumbnail(currentPost.id.toString(), positionX, positionY, scale);
			await loadPosts();
			showPositioner = false;
			currentPost = null;
			previewPositionX = 50;
			previewPositionY = 50;
			previewScale = 1;
			toast.success('섬네일 위치가 성공적으로 업데이트되었습니다.');
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		} finally {
			loading = false;
		}
	};

	const handleDndConsider = (e: CustomEvent<{items: Array<PostTable>}>) => {
		currentPosts = e.detail.items;
	};

	const handleDndFinalize = async (e: CustomEvent<{items: Array<PostTable>}>) => {
		currentPosts = e.detail.items;
		try {
			loading = true;
			errorMessage = '';
			// 현재 페이지의 포스트 순서 업데이트
			const updatedPosts = [...posts];
			currentPosts.forEach((post, index) => {
				const postIndex = updatedPosts.findIndex(p => p.id === post.id);
				if (postIndex !== -1) {
					updatedPosts[postIndex] = { ...post, order: index + ((currentPage - 1) * postsPerPage) };
				}
			});
			
			// Supabase에 순서 업데이트
			const { error } = await supabase.from('posts')
				.upsert(
					currentPosts.map((post, index) => ({
						id: post.id,
						order: index + ((currentPage - 1) * postsPerPage)
					}))
				);

			if (error) throw error;

			posts = updatedPosts;
			filteredPosts = updatedPosts;
			toast.success('포스트 순서가 업데이트되었습니다.');
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('순서 업데이트 중 오류가 발생했습니다.');
			}
		} finally {
			loading = false;
		}
	};

	onMount(() => {
		loadPosts();
		isMobile = window.innerWidth < 768;
	});
</script>

<div class="admin-container overflow-x-auto">
	<h1 class="text-2xl font-bold mb-4">포스트 관리</h1>
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
					<th class="w-8"></th>
					<th>ID</th>
					<th>섬네일</th>
					<th>제목</th>
					<th>카테고리</th>
					{#if !isMobile}
						<th>설명</th>
					{/if}
					<th class="w-24">액션</th>
				</tr>
			</thead>
			<tbody use:dndzone={{items: currentPosts, flipDurationMs: 300}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
				{#each currentPosts as post (post.id)}
					<tr class="hover:bg-gray-100 transition-colors duration-200">
						<td class="drag-handle cursor-move">
							<div class="flex items-center justify-center w-full h-full hover:bg-gray-200 rounded p-1">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
								</svg>
							</div>
						</td>
						<td>{post.id}</td>
						<td class="relative w-24">
							{#if post.images && post.images.length > 0}
								<div class="relative group aspect-square w-24">
									<ImagePreview
										imageUrl={post.images[0]}
										positionX={post.thumbnail_position_x ?? 50}
										positionY={post.thumbnail_position_y ?? 50}
										scale={post.thumbnail_scale ?? 1}
										aspectRatio="1:1"
										mode="preview"
										width={96}
									/>
									<div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
										<button 
											type="button" 
											class="btn btn-ghost btn-sm text-white"
											on:click|stopPropagation={() => openPositioner(post)}
										>
											<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
												<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
											</svg>
										</button>
									</div>
								</div>
							{:else}
								<div class="w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-lg">
									No Image
								</div>
							{/if}
						</td>
						<td on:click={() => handleRowClick(post.id)}>{post.title}</td>
						<td>
							<div class="flex flex-wrap gap-1">
								{#each post.category as cat}
									<span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">{cat}</span>
								{/each}
							</div>
						</td>
						{#if !isMobile}
							<td class="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{post.description}</td>
						{/if}
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
{#if showPositioner && currentPost}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
			<div class="p-4 border-b">
				<h2 class="text-lg font-semibold">썸네일 이미지 위치 및 크기 조정</h2>
			</div>
			
			<div class="flex-1 flex gap-8 p-4 min-h-0 overflow-y-auto">
				<div class="flex-1">
					<ImagePositioner
						imageUrl={currentPost.images[0]}
						positionX={currentPost.thumbnail_position_x ?? 50}
						positionY={currentPost.thumbnail_position_y ?? 50}
						scale={currentPost.thumbnail_scale ?? 1}
						aspectRatio="1:1"
						on:save={handlePositionSave}
						on:cancel={handlePositionCancel}
						on:preview={handlePositionPreview}
					/>
				</div>
				<div class="w-[360px] flex flex-col gap-4">
					<div>
						<h3 class="text-sm font-medium text-gray-500 mb-2">썸네일 프리뷰</h3>
						<div class="bg-gray-50 rounded-lg p-4">
							<ImagePreview
								imageUrl={currentPost.images[0]}
								positionX={previewPositionX}
								positionY={previewPositionY}
								scale={previewScale}
								aspectRatio="1:1"
								mode="preview"
								width={328}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.admin-container {
		@apply max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg;
	}
	.post-table {
		@apply w-full border-collapse;
	}
	.post-table th, .post-table td {
		@apply border border-gray-300 p-2;
		min-width: max-content;
	}
	.post-table th {
		@apply bg-gray-100 whitespace-nowrap;
	}
	.post-table td {
		@apply bg-white;
	}
	.pagination {
		button {
			@apply px-3 py-1 mx-1 rounded;
			&.active {
				@apply bg-primary text-white;
			}
			&:hover:not(.active) {
				@apply bg-gray-100;
			}
		}
	}
	.btn-error {
		@apply bg-red-500 hover:bg-red-600 text-white transition-colors duration-200;
	}
	:global(.dndzone-item) {
		@apply transition-transform duration-300;
	}
	:global(.dndzone-item.dragged) {
		@apply bg-white shadow-lg border-2 border-primary !important;
		td {
			@apply bg-white;
		}
	}
	.drag-handle {
		@apply w-8 p-0;
	}
	:global(.dndzone-item.dragged .drag-handle) {
		@apply bg-primary bg-opacity-10;
	}
</style>

