<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { apiGetPostById } from '$lib/api/posts';
	import type { PostTable } from '$lib/api/supabaseClient';

	let postId: number;
	let post: PostTable | null = null;
	let errorMessage = '';

	postId = Number(get(page).params.id);

	onMount(async () => {
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

<div>
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{:else if post}
		<h1>{post.title}</h1>
		<div>
			{#each post.category as category}
				<span class="badge">{category}</span>
			{/each}
		</div>
		<p>{post.description}</p>
		<!-- 여러 장의 사진을 표시할 수 있도록 추가 -->
		{#each post.images as image}
			<img src={image} alt="Post" />
		{/each}
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
		margin-right: 0.5rem;
	}
</style>
