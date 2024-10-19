<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { apiPostLogout, apiGetUser } from '$lib/api/auth';
	import { onMount, onDestroy } from 'svelte';
	import type { User } from '@supabase/supabase-js';
	import { writable } from 'svelte/store';
	import { supabase } from '$lib/api/supabaseClient';
	import { browser } from '$app/environment';

	const user = writable<User | null>(null);
	let loading = true;
	let authListener: any;

	const logout = async () => {
		try {
			await apiPostLogout();
			user.set(null);
			goto('/admin/login');
		} catch (error) {
			console.error(error);
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

		// Supabase 실시간 구독 설정
		authListener = supabase.auth.onAuthStateChange((event, session) => {
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

	onDestroy(() => {
		// 컴포넌트가 파괴될 때 리스너 제거
		if (authListener) {
			authListener.unsubscribe();
		}
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

{#if loading}
	<div class="flex justify-center items-center h-screen w-screen">
		<div class="loader"></div>
	</div>
{:else if $user}
	<div class="flex h-screen bg-gray-100 overflow-hidden w-screen">
		<!-- 사이드바 -->
		<aside class="w-64 bg-white shadow-md overflow-y-auto">
			<nav class="mt-5 px-2">
				<a href="/admin/dashboard" class="group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition ease-in-out duration-150" class:active={$page.url.pathname === '/admin/dashboard'}>
					대시보드
				</a>
				<a href="/admin/posts" class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition ease-in-out duration-150" class:active={$page.url.pathname === '/admin/posts'}>
					포스트 관리
				</a>
				<a href="/admin/categories" class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition ease-in-out duration-150" class:active={$page.url.pathname === '/admin/categories'}>
					카테고리 관리
				</a>
				<button on:click={logout} class="mt-1 w-full text-left group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition ease-in-out duration-150">
					로그아웃
				</button>
			</nav>
		</aside>

		<!-- 메인 콘텐츠 -->
		<main class="flex-1 overflow-y-auto p-5">
			<div class="max-w-7xl mx-auto">
				<slot />
			</div>
		</main>
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
