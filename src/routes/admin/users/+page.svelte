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

<div class="user-container">
	<h1>사용자 관리</h1>
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{:else if successMessage}
		<p class="success">{successMessage}</p>
	{/if}
	<div class="add-user">
		<input type="email" placeholder="새 사용자 이메일" bind:value={newUserEmail} />
		<button on:click={addUser}>추가</button>
	</div>
	<table class="user-table">
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
						<button class="btn btn-delete" on:click={() => deleteUser(user.id)}>삭제</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.user-container {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	.add-user {
		display: flex;
		gap: 8px;
		margin-bottom: 16px;
	}
	.add-user input {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	.add-user button {
		padding: 0.5rem 1rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	.add-user button:hover {
		background-color: #0056b3;
	}
	.user-table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 1rem;
	}
	.user-table th, .user-table td {
		border: 1px solid #ccc;
		padding: 0.5rem;
		text-align: left;
	}
	.user-table th {
		background-color: #f4f4f4;
	}
	.btn-delete {
		background-color: #f44336;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}
	.btn-delete:hover {
		background-color: #e53935;
	}
	.error {
		color: red;
		margin-top: 1rem;
	}
	.success {
		color: green;
		margin-top: 1rem;
	}
	.add-user button {
		@apply btn btn-primary; /* daisyui의 기본 버튼 스타일 적용 */
	}
	.btn-delete {
		@apply btn btn-error; /* daisyui의 에러 버튼 스타일 적용 */
	}
</style>
