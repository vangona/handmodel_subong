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
			errorMessage = error.message;
		}
	};

	onMount(async () => {
		try {
			await apiGetUser();
			goto('/admin');
		} catch {
			// 로그인 필요
		}
	});
</script>

<div class="login-container">
	<h1>관리자 로그인</h1>
	<form on:submit|preventDefault={handleLogin}>
		<div>
			<label for="email">이메일</label>
			<input id="email" type="email" bind:value={email} required />
		</div>
		<div>
			<label for="password">비밀번호</label>
			<input id="password" type="password" bind:value={password} required />
		</div>
		<button type="submit">로그인</button>
		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}
	</form>
</div>

<style>
	.login-container {
		max-width: 400px;
		margin: 0 auto;
		padding: 2rem;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	.error {
		color: red;
		margin-top: 1rem;
	}
</style>
