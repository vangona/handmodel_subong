<script lang="ts">
	import { onMount } from 'svelte';
	import { apiGetDashboardData } from '$lib/api/dashboard';

	let totalPosts = 0;
	let totalCategories = 0;
	let errorMessage = '';

	const loadDashboardData = async () => {
		try {
			const data = await apiGetDashboardData();
			totalPosts = data.totalPosts;
			totalCategories = data.totalCategories;
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = 'Dashboard Error: ' + error.message;
			} else {
				errorMessage = 'Dashboard Error: 알 수 없는 오류가 발생했습니다.';
			}
		}
	};

	onMount(() => {
		loadDashboardData();
	});
</script>

<div class="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
	<h1 class="text-2xl font-bold mb-4">관리자 대시보드</h1>
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{:else}
		<div class="stats flex justify-around mt-8">
			<div class="stat bg-gray-100 p-4 rounded-lg text-center w-1/2">
				<h2 class="mb-2 text-lg font-semibold">총 포스트</h2>
				<p>{totalPosts}</p>
			</div>
			<div class="stat bg-gray-100 p-4 rounded-lg text-center w-1/2">
				<h2 class="mb-2 text-lg font-semibold">총 카테고리</h2>
				<p>{totalCategories}</p>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.error {
		@apply text-red-500 mt-4;
	}
</style>
