<script lang="ts">
	import { onMount } from 'svelte';
	import { apiGetUsers, apiPostAddUser, apiDeleteUser } from '$lib/api/users';

	let users: Array<{ id: string, email: string }> = [];
	let newUserEmail = '';
	let errorMessage = '';
	let successMessage = '';

	const fetchUsers = async () => {
		try {
			users = await apiGetUsers();
		} catch (error) {
			errorMessage = error.message;
		}
	};

	const addUser = async () => {
		if (!newUserEmail.trim()) {
			errorMessage = '사용자 이메일을 입력하세요.';
			return;
		}

		try {
			await apiPostAddUser(newUserEmail);
			successMessage = '사용자가 추가되었습니다.';
			newUserEmail = '';
			fetchUsers();
		} catch (error) {
			errorMessage = error.message;
		}
	};

	const deleteUser = async (id: string) => {
		if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
			try {
				await apiDeleteUser(id);
				successMessage = '사용자가 삭제되었습니다.';
				fetchUsers();
			} catch (error) {
				errorMessage = error.message;
			}
		}
	};

	onMount(() => {
		fetchUsers();
	});
</script>

<div class="user-container max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
	<h1 class="text-2xl font-bold mb-4">사용자 관리</h1>
	{#if errorMessage}
		<p class="text-red-500">{errorMessage}</p>
	{:else if successMessage}
		<p class="text-green-500">{successMessage}</p>
	{/if}
	<div class="add-user flex gap-2 mb-4">
		<input type="email" placeholder="새 사용자 이메일" bind:value={newUserEmail} class="input input-bordered w-full" />
		<button on:click={addUser} class="btn btn-primary">추가</button>
	</div>
	<table class="user-table table-auto w-full mt-4">
		<thead>
			<tr>
				<th>ID</th>
				<th>이메일</th>
				<th>액션</th>
			</tr>
		</thead>
		<tbody>
			{#each users as user}
				<tr>
					<td>{user.id}</td>
					<td>{user.email}</td>
					<td>
						<button class="btn btn-error" on:click={() => deleteUser(user.id)}>삭제</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.user-container {
		@apply max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg;
	}
	.user-table th, .user-table td {
		@apply border border-gray-300 p-2;
	}
	.user-table th {
		@apply bg-gray-100;
	}
</style>
