<script lang="ts">
  import { onMount } from 'svelte'
  import { getPageContent, updatePageContent, type PageContent } from '$lib/api/pages'
  import { goto } from '$app/navigation'

  interface AboutSections {
    brief: string
    introduction: string
    activities: string[]
  }

  interface ContactSections {
    brief: string
    sns: string
  }

  interface AboutContent {
    sections: AboutSections
  }

  interface ContactContent {
    sections: ContactSections
  }

  function isAboutContent(content: any): content is AboutContent {
    return content?.sections?.brief !== undefined &&
           content?.sections?.introduction !== undefined &&
           Array.isArray(content?.sections?.activities)
  }

  function isContactContent(content: any): content is ContactContent {
    return content?.sections?.brief !== undefined &&
           content?.sections?.sns !== undefined
  }

  function hasPageSections(content: any): content is AboutContent | ContactContent {
    return content?.sections?.brief !== undefined
  }

  let selectedPage: 'intro' | 'collaboration' = 'intro'
  let pageContent: PageContent | null = null
  let isLoading = false
  let isSaving = false
  let errorMessage = ''
  let newActivity = ''

  $: content = pageContent?.content || null
  $: activities = selectedPage === 'intro' && isAboutContent(content) ? content.sections.activities : []
  $: brief = hasPageSections(content) ? content.sections.brief : ''

  async function loadPageContent() {
    isLoading = true
    pageContent = await getPageContent(selectedPage)
    
    if (pageContent) {
      if (selectedPage === 'intro' && !isAboutContent(pageContent.content)) {
        pageContent.content = {
          sections: {
            brief: '',
            introduction: '',
            activities: []
          }
        }
      } else if (selectedPage === 'collaboration' && !isContactContent(pageContent.content)) {
        pageContent.content = {
          sections: {
            brief: '',
            sns: ''
          }
        }
      }
    }
    
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

  function addActivity() {
    if (!pageContent || !newActivity || !isAboutContent(pageContent.content)) return
    pageContent.content.sections.activities = [...activities, newActivity]
    newActivity = ''
  }

  function removeActivity(index: number) {
    if (!pageContent || !isAboutContent(pageContent.content)) return
    pageContent.content.sections.activities = activities.filter((_, i) => i !== index)
  }

  function moveActivity(index: number, direction: 'up' | 'down') {
    if (!pageContent || !isAboutContent(pageContent.content)) return
    const newActivities = [...activities]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newActivities.length) {
      [newActivities[index], newActivities[newIndex]] = [newActivities[newIndex], newActivities[index]]
      pageContent.content.sections.activities = newActivities
    }
  }

  function updateBrief(value: string) {
    if (!pageContent || !hasPageSections(pageContent.content)) return
    pageContent.content.sections.brief = value
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">페이지 컨텐츠 수정</h1>

  <div class="mb-6">
    <label for="page-select" class="block text-sm font-medium mb-2">페이지 선택</label>
    <select
      id="page-select"
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
  {:else if pageContent && content && hasPageSections(content)}
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label for="brief-input" class="block text-sm font-medium mb-2">한 줄 소개</label>
        <input
          id="brief-input"
          type="text"
          value={brief}
          on:input={(e) => updateBrief(e.currentTarget.value)}
          class="w-full p-2 border rounded"
        />
      </div>

      {#if selectedPage === 'intro' && isAboutContent(content)}
        <div>
          <label for="intro-textarea" class="block text-sm font-medium mb-2">소개 내용</label>
          <textarea
            id="intro-textarea"
            bind:value={content.sections.introduction}
            class="w-full h-64 p-2 border rounded"
          />
        </div>

        <div>
          <label for="activity-input" class="block text-sm font-medium mb-4">주요 활동</label>
          <div class="flex gap-2 mb-4">
            <input
              id="activity-input"
              type="text"
              bind:value={newActivity}
              placeholder="새로운 활동 추가"
              class="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              on:click={addActivity}
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              추가
            </button>
          </div>
          <ul class="space-y-2">
            {#each activities as activity, i}
              <li class="flex items-center gap-2">
                <span class="flex-1 p-2 bg-gray-50 rounded">{activity}</span>
                <button
                  type="button"
                  on:click={() => moveActivity(i, 'up')}
                  disabled={i === 0}
                  class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  on:click={() => moveActivity(i, 'down')}
                  disabled={i === activities.length - 1}
                  class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  on:click={() => removeActivity(i)}
                  class="p-1 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </li>
            {/each}
          </ul>
        </div>
      {:else if selectedPage === 'collaboration' && isContactContent(content)}
        <div>
          <label for="sns-textarea" class="block text-sm font-medium mb-2">SNS 설명</label>
          <textarea
            id="sns-textarea"
            bind:value={content.sections.sns}
            class="w-full h-64 p-2 border rounded"
          />
        </div>
      {/if}

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