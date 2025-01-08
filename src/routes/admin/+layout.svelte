<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { apiPostLogout, apiGetUser } from '$lib/api/auth';
	import { onMount } from 'svelte';
	import type { User } from '@supabase/supabase-js';
	import { writable } from 'svelte/store';
	import { supabase } from '$lib/api/supabaseClient';
	import { browser } from '$app/environment';

	const user = writable<User | null>(null);
	let loading = true;
	let isMobile = false;

	const logout = async () => {
		if (confirm('정말 로그아웃 하시겠습니까?')) {
			try {
				await apiPostLogout();
				user.set(null);
				goto('/admin/login');
			} catch (error) {
				console.error(error);
			}
		}
	};

	const checkUser = async () => {
		try {
			const data = await apiGetUser();
			user.set(data);
		} catch (error) {
			user.set(null);
			if ($page.url.pathname !== '/admin/login') {
				goto('/admin/login');
			}
		} finally {
			loading = false;
		}
	};

	onMount(async () => {
		await checkUser();
		isMobile = window.innerWidth < 768;
		// Supabase 실시간 구독 설정
		supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_IN') {
				user.set(session?.user ?? null);
				if ($page.url.pathname === '/admin/login') {
					goto('/admin/dashboard');
				}
			} else if (event === 'SIGNED_OUT') {
				user.set(null);
				if ($page.url.pathname !== '/admin/login') {
					goto('/admin/login');
				}
			}
		});
	});

	// 사용자 상태가 변경될 때마다 실행
	$: if (browser) {
		if ($user) {
			if ($page.url.pathname === '/admin/login') {
				goto('/admin/dashboard');
			}
		} else {
			if ($page.url.pathname !== '/admin/login') {
				goto('/admin/login');
			}
		}
	}
</script>

<svelte:head>
	<title>관리자 페이지 | 손모델 심수연</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if loading}
	<div class="flex justify-center items-center h-screen w-screen">
		<div class="loader"></div>
	</div>
{:else if $user && !isMobile}
	<div class="flex h-screen bg-gray-100 overflow-hidden w-screen">
		<!-- 사이드바 -->
		<aside class="w-64 bg-white shadow-md overflow-y-auto">
			<nav class="mt-5 px-2">
				<a href="/admin/dashboard" class="group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition ease-in-out duration-150" class:active={$page.url.pathname === '/admin/dashboard'}>
					대시보드
				</a>
				<a href="/admin/pages" class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition ease-in-out duration-150" class:active={$page.url.pathname === '/admin/pages'}>
					페이지 컨텐츠 관리
				</a>
				<a href="/admin/settings" class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition ease-in-out duration-150" class:active={$page.url.pathname === '/admin/settings'}>
					사이트 설정
				</a>
				<a href="/admin/posts" class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition ease-in-out duration-150" class:active={$page.url.pathname === '/admin/posts'}>
					포스트 관리
				</a>
				<a href="/admin/images" class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition ease-in-out duration-150" class:active={$page.url.pathname === '/admin/images'}>
					메인 이미지 관리
				</a>
				<a href="/admin/categories" class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition ease-in-out duration-150" class:active={$page.url.pathname === '/admin/categories'}>
					카테고리 관리
				</a>
				<div class="mt-8 border-t pt-4">
					<button on:click={logout} class="w-full text-left group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition ease-in-out duration-150">
						로그아웃
					</button>
				</div>
			</nav>
		</aside>

		<!-- 메인 콘텐츠 -->
		<main class="flex-1 overflow-y-auto p-5">
			<div class="max-w-7xl mx-auto">
				<slot />
			</div>
		</main>
	</div>
{:else if $user && isMobile}
	<div class="flex flex-col h-screen bg-gray-100 overflow-hidden w-screen">
		<!-- 메인 콘텐츠 -->
		<main class="flex-1 overflow-y-auto p-4 mt-12">
			<slot />
		</main>

		<!-- 하단 탭 바 -->
		<nav class="bg-white shadow-md p-2 flex justify-around items-center font-serif">
			<a href="/admin/dashboard" class="text-center p-2 {$page.url.pathname === '/admin/dashboard' ? 'text-blue-600' : 'text-gray-600'}">
				대시보드
			</a>
			<a href="/admin/pages" class="text-center p-2 {$page.url.pathname === '/admin/pages' ? 'text-blue-600' : 'text-gray-600'}">
				페이지
			</a>
			<a href="/admin/settings" class="text-center p-2 {$page.url.pathname === '/admin/settings' ? 'text-blue-600' : 'text-gray-600'}">
				설정
			</a>
			<a href="/admin/posts" class="text-center p-2 {$page.url.pathname === '/admin/posts' ? 'text-blue-600' : 'text-gray-600'}">
				포스트
			</a>
			<a href="/admin/images" class="text-center p-2 {$page.url.pathname === '/admin/images' ? 'text-blue-600' : 'text-gray-600'}">
				이미지
			</a>
			<a href="/admin/categories" class="text-center p-2 {$page.url.pathname === '/admin/categories' ? 'text-blue-600' : 'text-gray-600'}">
				카테고리
			</a>
			<button on:click={logout} class="text-center p-2 text-gray-600 hover:text-red-600">
				로그아웃
			</button>
		</nav>
	</div>
{:else}
	<slot />
{/if}

<style lang="postcss">
	.active {
		@apply text-gray-900 bg-gray-100;
	}
	.loader {
		@apply border-4 border-gray-200 rounded-full w-12 h-12 animate-spin;
		border-top-color: #3498db;
	}
</style>
