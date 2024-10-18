<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { apiPostLogout, apiGetUser } from '$lib/api/auth';

	let user = null;

	const logout = async () => {
		try {
			await apiPostLogout();
			goto('/admin/login');
		} catch (error) {
			console.error(error);
		}
	};

	onMount(async () => {
		try {
			const data = await apiGetUser();
			user = data;
		} catch {
			goto('/admin/login');
		}
	});
</script>

<nav class="admin-nav">
	<ul>
		<li><a href="/admin">대시보드</a></li>
		<li><a href="/admin/posts">포스트 관리</a></li>
		<li><a href="/admin/categories">카테고리 관리</a></li>
		<li><a href="/admin/users">사용자 관리</a></li>
		<li><a href="/" on:click={logout}>로그아웃</a></li>
	</ul>
</nav>

<slot />

<style lang="postcss">
	.admin-nav {
		@apply bg-gray-800 p-4; /* daisyui의 색상 및 패딩 스타일 적용 */
	}
	.admin-nav ul {
		@apply list-none flex gap-4;
	}
	.admin-nav a {
		@apply text-white no-underline; /* daisyui의 텍스트 및 링크 스타일 적용 */
	}
	.admin-nav a:hover {
		@apply underline;
	}
</style>
