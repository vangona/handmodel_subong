<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { apiGetPostById } from '$lib/api/posts';
	import type { PostTable } from '$lib/api/supabaseClient';

	let post: PostTable | null = null;
	let errorMessage = '';

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
		}
	});
</script>

<div class="container mx-auto px-4 py-8">
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{:else if post}
		<h1 class="text-3xl font-bold mb-4">{post.title}</h1>
		<div class="mb-4">
			{#each post.category as category}
				<span class="badge mr-2">{category}</span>
			{/each}
		</div>
		<p class="mb-4">{post.description}</p>
		<!-- 여기에 추가적인 게시글 내용을 표시할 수 있습니다 -->
	{:else}
		<p>Loading...</p>
	{/if}
</div>

<style>
	.error {
		color: red;
	}
	.badge {
		background-color: #eee;
		padding: 0.5rem;
		border-radius: 4px;
	}
</style>
