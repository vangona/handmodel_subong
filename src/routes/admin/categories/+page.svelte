<script lang="ts">
	import { onMount } from 'svelte';
	import { apiGetCategories, apiPostAddCategory, apiDeleteCategory, apiUpdateCategory } from '$lib/api/categories';
	import { fade } from 'svelte/transition';

	let categories: Array<{ id: number; name: string }> = [];
	let newCategoryName = '';
	let errorMessage = '';
	let successMessage = '';
	let editingCategory: { id: number; name: string } | null = null;

	onMount(async () => {
		await loadCategories();
	});

	async function loadCategories() {
		try {
			categories = await apiGetCategories();
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			}
		}
	}

	async function handleAddCategory() {
		if (!newCategoryName.trim()) return;

		try {
			await apiPostAddCategory(newCategoryName);
			await loadCategories();
			newCategoryName = '';
			successMessage = '카테고리가 추가되었습니다.';
			setTimeout(() => {
				successMessage = '';
			}, 3000);
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			}
		}
	}

	async function handleDeleteCategory(id: number) {
		if (!confirm('이 카테고리를 삭제하시겠습니까?')) return;

		try {
			await apiDeleteCategory(id);
			await loadCategories();
			successMessage = '카테고리가 삭제되었습니다.';
			setTimeout(() => {
				successMessage = '';
			}, 3000);
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			}
		}
	}

	function startEditing(category: { id: number; name: string }) {
		editingCategory = { ...category };
	}

	function cancelEditing() {
		editingCategory = null;
	}

	async function handleUpdateCategory() {
		if (!editingCategory || !editingCategory.name.trim()) return;

		try {
			await apiUpdateCategory(editingCategory.id, editingCategory.name);
			await loadCategories();
			editingCategory = null;
			successMessage = '카테고리가 수정되었습니다.';
			setTimeout(() => {
				successMessage = '';
			}, 3000);
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			}
		}
	}
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold mb-6">카테고리 관리</h1>

	<div class="mb-8">
		<form on:submit|preventDefault={handleAddCategory} class="flex gap-2">
			<input
				type="text"
				bind:value={newCategoryName}
				placeholder="새 카테고리 이름"
				class="input input-bordered flex-1"
			/>
			<button type="submit" class="btn btn-primary">추가</button>
		</form>
	</div>

	{#if errorMessage}
		<p class="text-red-500 mb-4" in:fade>{errorMessage}</p>
	{/if}
	{#if successMessage}
		<p class="text-green-500 mb-4" in:fade>{successMessage}</p>
	{/if}

	<div class="space-y-2">
		{#each categories as category (category.id)}
			<div class="flex items-center justify-between p-3 bg-white rounded-lg shadow" in:fade>
				{#if editingCategory?.id === category.id}
					<div class="flex gap-2 flex-1 justify-center items-center">
						<input
							type="text"
							bind:value={editingCategory.name}
							class="input input-bordered flex-1"
							placeholder="카테고리 이름"
						/>
						<button
							type="button"
							class="btn btn-primary btn-sm"
							on:click={handleUpdateCategory}
						>
							저장
						</button>
						<button
							type="button"
							class="btn btn-ghost btn-sm"
							on:click={cancelEditing}
						>
							취소
						</button>
					</div>
				{:else}
					<span class="text-lg">{category.name}</span>
					<div class="flex gap-2">
						<button
							type="button"
							class="btn btn-ghost btn-sm"
							on:click={() => startEditing(category)}
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
							</svg>
						</button>
						<button
							type="button"
							class="btn btn-ghost btn-sm text-red-500"
							on:click={() => handleDeleteCategory(category.id)}
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
						</button>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	button svg {
		@apply w-5 h-5;
	}
</style>
