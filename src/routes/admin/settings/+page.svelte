<script lang="ts">
  import { onMount } from 'svelte'
  import { getPageContent, updatePageContent, type PageContent } from '$lib/api/pages'
  import { goto } from '$app/navigation'

  interface SettingsContent {
    site_title?: string
    menu_items?: Record<string, string>
  }

  function isSettingsContent(content: any): content is SettingsContent {
    return typeof content?.site_title === 'string' ||
           (typeof content?.menu_items === 'object' && content?.menu_items !== null)
  }

  let pageContent: PageContent | null = null
  let isLoading = true
  let isSaving = false
  let errorMessage = ''
  let newMenuItem = { key: '', value: '' }

  $: content = pageContent?.content || null
  $: menuItems = isSettingsContent(content) && content.menu_items ? 
    Object.entries(content.menu_items) : []
  $: siteTitle = isSettingsContent(content) ? content.site_title || '' : ''

  async function loadPageContent() {
    isLoading = true
    pageContent = await getPageContent('settings')
    
    if (pageContent) {
      if (!isSettingsContent(pageContent.content)) {
        pageContent.content = {
          site_title: '',
          menu_items: {}
        }
      }
    }
    
    isLoading = false
  }

  onMount(loadPageContent)

  async function handleSubmit() {
    if (!pageContent || !isSettingsContent(pageContent.content)) return

    isSaving = true
    errorMessage = ''

    const success = await updatePageContent('settings', pageContent.content)
    
    if (success) {
      goto('/admin')
    } else {
      errorMessage = '설정 저장 중 오류가 발생했습니다.'
    }
    
    isSaving = false
  }

  function addMenuItem() {
    if (!pageContent || !isSettingsContent(pageContent.content) || !newMenuItem.key || !newMenuItem.value) return
    
    pageContent.content.menu_items = {
      ...pageContent.content.menu_items,
      [newMenuItem.key]: newMenuItem.value
    }
    
    newMenuItem = { key: '', value: '' }
  }

  function removeMenuItem(key: string) {
    if (!pageContent || !isSettingsContent(pageContent.content)) return
    
    const { [key]: _, ...rest } = pageContent.content.menu_items || {}
    pageContent.content.menu_items = rest
  }

  function updateSiteTitle(value: string) {
    if (!pageContent || !isSettingsContent(pageContent.content)) return
    pageContent.content.site_title = value
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">사이트 설정</h1>

  {#if isLoading}
    <p>로딩 중...</p>
  {:else if pageContent && isSettingsContent(content)}
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label for="site-title" class="block text-sm font-medium mb-2">사이트 제목</label>
        <input
          id="site-title"
          type="text"
          value={siteTitle}
          on:input={(e) => updateSiteTitle(e.currentTarget.value)}
          class="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label for="menu-key" class="block text-sm font-medium mb-4">메뉴 항목</label>
        <div class="flex gap-2 mb-4">
          <input
            id="menu-key"
            type="text"
            bind:value={newMenuItem.key}
            placeholder="메뉴 경로 (예: about)"
            class="flex-1 p-2 border rounded"
          />
          <input
            id="menu-value"
            type="text"
            bind:value={newMenuItem.value}
            placeholder="메뉴 이름 (예: 소개)"
            class="flex-1 p-2 border rounded"
            aria-label="메뉴 이름"
          />
          <button
            type="button"
            on:click={addMenuItem}
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            추가
          </button>
        </div>
        <ul class="space-y-2">
          {#each menuItems as [key, value]}
            <li class="flex items-center gap-2">
              <span class="flex-1 p-2 bg-gray-50 rounded">{key} → {value}</span>
              <button
                type="button"
                on:click={() => removeMenuItem(key)}
                class="p-1 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </li>
          {/each}
        </ul>
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