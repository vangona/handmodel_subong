<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { apiGetPostById } from '$lib/api/posts';
	import type { PostTable } from '$lib/api/supabaseClient';

	let post: PostTable | null = null;
	let errorMessage = '';
	let loading = true;

	onMount(async () => {
		const postId = Number($page.params.id);
		try {
			post = await apiGetPostById(postId);
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = '알 수 없는 오류가 발생했습니다.';
			}
		} finally {
			loading = false;
		}
	});

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('ko-KR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-3xl">
	{#if loading}
		<div class="flex justify-center items-center h-64">
			<div class="loader"></div>
		</div>
	{:else if errorMessage}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
			<strong class="font-bold">오류:</strong>
			<span class="block sm:inline">{errorMessage}</span>
		</div>
	{:else if post}
		<article class="bg-white shadow-lg rounded-lg overflow-hidden">
			<div class="p-6">
				<h1 class="text-3xl font-bold mb-4 text-gray-800">{post.title}</h1>
				<div class="mb-4 flex flex-wrap">
					{#each post.category as category}
						<span class="badge mr-2 mb-2">{category}</span>
					{/each}
				</div>
				<p class="text-sm text-gray-600 mb-4">작성일: {formatDate(post.created_at)}</p>
				<p class="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">{post.description}</p>
				{#if post.images && post.images.length > 0}
					<div class="mt-6">
						<h2 class="text-xl font-semibold mb-4">이미지</h2>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							{#each post.images as image}
								<img src={image} alt="게시글 이미지" class="w-full h-auto rounded-lg shadow-md">
								{/each}
						</div>
					</div>
				{/if}
			</div>
		</article>
	{/if}
</div>

<style lang="postcss">
	.badge {
		@apply bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold;
	}
	.loader {
		@apply border-4 border-gray-200 rounded-full w-12 h-12 animate-spin;
		border-top-color: #3498db;
	}
</style>
