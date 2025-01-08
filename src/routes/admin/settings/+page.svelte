<script lang="ts">
  import { onMount } from 'svelte'
  import { getSiteSettings, updateSiteSettings, type PageContent } from '$lib/api/pages'
  import { goto } from '$app/navigation'

  let settings: PageContent | null = null
  let isLoading = false
  let isSaving = false
  let errorMessage = ''

  onMount(async () => {
    isLoading = true
    settings = await getSiteSettings()
    isLoading = false
  })

  async function handleSubmit() {
    if (!settings) return

    isSaving = true
    errorMessage = ''

    const success = await updateSiteSettings(settings.content)
    
    if (success) {
      goto('/admin')
    } else {
      errorMessage = '설정 저장 중 오류가 발생했습니다.'
    }
    
    isSaving = false
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">사이트 설정</h1>

  {#if isLoading}
    <p>로딩 중...</p>
  {:else if settings}
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label for="site_title" class="block text-sm font-medium mb-2">사이트 타이틀</label>
        <input
          type="text"
          id="site_title"
          bind:value={settings.content.site_title}
          class="w-full p-2 border rounded"
        />
      </div>

      <div>
        <h2 class="text-lg font-medium mb-4">메뉴 이름 설정</h2>
        {#each Object.entries(settings.content.menu_items || {}) as [key, value]}
          <div class="mb-4">
            <label for={key} class="block text-sm font-medium mb-2">{key}</label>
            <input
              type="text"
              id={key}
              bind:value={settings.content.menu_items[key]}
              class="w-full p-2 border rounded"
            />
          </div>
        {/each}
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
    <p>설정을 불러올 수 없습니다.</p>
  {/if}
</div> 