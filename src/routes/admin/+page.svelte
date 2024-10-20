<script lang="ts">
	import { onMount } from 'svelte';
	import { apiGetDashboardData } from '$lib/api/dashboard';

	let totalPosts = 0;
	let totalCategories = 0;
	let totalUsers = 0;
	let errorMessage = '';

	const loadDashboardData = async () => {
		try {
			const data = await apiGetDashboardData();
			totalPosts = data.totalPosts;
			totalCategories = data.totalCategories;
			totalUsers = data.totalUsers;
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

<div class="dashboard-container">
	<h1>관리자 대시보드</h1>
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{:else}
		<div class="stats">
			<div class="stat">
				<h2>총 포스트</h2>
				<p>{totalPosts}</p>
			</div>
			<div class="stat">
				<h2>총 카테고리</h2>
				<p>{totalCategories}</p>
			</div>
			<div class="stat">
				<h2>총 사용자</h2>
				<p>{totalUsers}</p>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.dashboard-container {
		@apply max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg;
	}
	.stats {
		@apply flex justify-around mt-8;
	}
	.stat {
		@apply bg-gray-100 p-4 rounded-lg text-center w-1/3;
	}
	.stat h2 {
		@apply mb-2 text-lg font-semibold;
	}
	.error {
		@apply text-red-500 mt-4;
	}
</style>
