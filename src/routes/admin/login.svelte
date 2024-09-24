<script lang="ts">
	import { supabase } from '$lib/api/supabaseClient';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let errorMessage = '';

	const handleLogin = async () => {
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			errorMessage = error.message;
		} else {
			goto('/admin');
		}
	};

	onMount(async () => {
		const user = await supabase.auth.getUser();
		if (user) {
			goto('/admin');
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
	form div {
		margin-bottom: 1rem;
	}
	label {
		display: block;
		margin-bottom: 0.5rem;
	}
	input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	button {
		width: 100%;
		padding: 0.75rem;
		background-color: #007bff;
		color: #fff;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	.error {
		color: red;
		margin-top: 1rem;
	}
</style>