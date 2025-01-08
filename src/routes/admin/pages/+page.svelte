<script lang="ts">
  import { onMount } from 'svelte'
  import { getPageContent, updatePageContent, type PageContent } from '$lib/api/pages'
  import { goto } from '$app/navigation'

  let selectedPage: 'intro' | 'collaboration' = 'intro'
  let pageContent: PageContent | null = null
  let isLoading = false
  let isSaving = false
  let errorMessage = ''

  async function loadPageContent() {
    isLoading = true
    pageContent = await getPageContent(selectedPage)
    isLoading = false
  }

  onMount(loadPageContent)

  async function handleSubmit() {
    if (!pageContent) return

    isSaving = true
    errorMessage = ''

    const success = await updatePageContent(selectedPage, pageContent.content)
    
    if (success) {
      goto('/admin')
    } else {
      errorMessage = '컨텐츠 저장 중 오류가 발생했습니다.'
    }
    
    isSaving = false
  }

  function handlePageChange() {
    loadPageContent()
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">페이지 컨텐츠 수정</h1>

  <div class="mb-6">
    <label class="block text-sm font-medium mb-2">페이지 선택</label>
    <select
      bind:value={selectedPage}
      on:change={handlePageChange}
      class="w-full p-2 border rounded"
    >
      <option value="intro">소개 페이지</option>
      <option value="collaboration">협업 페이지</option>
    </select>
  </div>

  {#if isLoading}
    <p>로딩 중...</p>
  {:else if pageContent}
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label for="content" class="block text-sm font-medium mb-2">페이지 내용</label>
        <textarea
          id="content"
          bind:value={pageContent.content.content}
          class="w-full h-64 p-2 border rounded"
        />
      </div>

      {#if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
      {/if}

      <div class="flex gap-4">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isSaving}
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          class="px-4 py-2 border rounded hover:bg-gray-100"
          on:click={() => goto('/admin')}
        >
          취소
        </button>
      </div>
    </form>
  {:else}
    <p>컨텐츠를 불러올 수 없습니다.</p>
  {/if}
</div> 