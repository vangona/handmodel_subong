<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { apiPostLogin, apiGetUser } from '$lib/api/auth';

	let email = '';
	let password = '';
	let errorMessage = '';

	const handleLogin = async () => {
		try {
			await apiPostLogin(email, password);
			goto('/admin');
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = '알 수 없는 오류가 발생했습니다.';
			}
		}
	};

	onMount(async () => {
		try {
			const user = await apiGetUser();
			if (user) {
				goto('/admin');
			} else {
				throw new Error('로그인 필요');
			}
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = '알 수 없는 오류가 발생했습니다.';
			}
		}
	});
</script>

<div class="login-container max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
	<h1 class="text-2xl font-bold mb-4">관리자 로그인</h1>
	<form on:submit|preventDefault={handleLogin} class="space-y-4">
		<div>
			<label for="email" class="block text-sm font-medium text-gray-700">이메일</label>
			<input id="email" type="email" bind:value={email} required class="input input-bordered w-full mt-1" />
		</div>
		<div>
			<label for="password" class="block text-sm font-medium text-gray-700">비밀번호</label>
			<input id="password" type="password" bind:value={password} required class="input input-bordered w-full mt-1" />
		</div>
		<button type="submit" class="btn btn-primary w-full">로그인</button>
		{#if errorMessage}
			<p class="text-red-500 mt-2">{errorMessage}</p>
		{/if}
	</form>
</div>

<style lang="postcss">
	.login-container {
		@apply max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg w-screen m-16;
	}
</style>
