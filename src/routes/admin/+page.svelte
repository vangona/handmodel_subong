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

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mt-8">
		<a
			href="/admin/pages"
			class="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
		>
			<h2 class="text-xl font-semibold mb-2">페이지 컨텐츠 관리</h2>
			<p class="text-gray-600">소개 페이지와 협업 페이지의 내용을 수정합니다.</p>
		</a>

		<a
			href="/admin/settings"
			class="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
		>
			<h2 class="text-xl font-semibold mb-2">사이트 설정</h2>
			<p class="text-gray-600">사이트 타이틀과 메뉴 이름을 수정합니다.</p>
		</a>
	</div>
</div>

<style lang="postcss">
	.error {
		@apply text-red-500 mt-4;
	}
</style>
