<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  
  export let categories: Array<string>;
  export let selectedCategories: Array<string> = [];
  export let onSelect: (category: string) => void;

  const toggleCategory = (category: string, event: Event) => {
    event.preventDefault();
    onSelect(category);
  };
  
  // 선택된 카테고리 개수 (all 제외)
  $: selectedCount = selectedCategories.filter(cat => cat !== 'all').length;
  $: hasMultipleSelections = selectedCount > 0 && !selectedCategories.includes('all');
</script>

<div class="category-filter__container">
  <!-- 상태 표시줄 -->
  <div class="status-bar">
    <div class="status-content">
      {#if hasMultipleSelections}
        <span class="status-text" in:fade={{ duration: 200 }}>
          {selectedCount}개 카테고리 선택
        </span>
        <button 
          class="clear-button"
          on:click={(e) => toggleCategory('all', e)}
          in:fade={{ duration: 200, delay: 100 }}
        >
          모두 해제
        </button>
      {:else}
        <span class="status-text-placeholder">카테고리를 선택하세요</span>
      {/if}
    </div>
  </div>
  
  <!-- 카테고리 버튼들 -->
  <div class="category-filter__wrapper">
    {#each categories as category, i}
      <button
        type="button"
        class="category-filter__item"
        class:selected={selectedCategories.includes(category)}
        on:click={(event) => toggleCategory(category, event)}
        in:scale={{ duration: 300, delay: i * 30 }}
      >
        <!-- 선택 상태 인디케이터 (항상 존재하여 레이아웃 시프팅 방지) -->
        <div class="selection-indicator" class:active={selectedCategories.includes(category)}>
          <div class="indicator-dot"></div>
        </div>
        
        <span class="category-text">
          {category === 'all' ? '전체' : category}
        </span>
        
        <!-- 배경 효과 -->
        <div class="category-filter__item-bg"></div>
      </button>
    {/each}
  </div>
</div>

<style lang="postcss">
  .category-filter__container {
    @apply w-full max-w-6xl mx-auto;
  }
  
  /* 상태 표시줄 */
  .status-bar {
    @apply mb-6 h-8 flex items-center justify-center;
  }
  
  .status-content {
    @apply flex items-center gap-3;
  }
  
  .status-text, .status-text-placeholder {
    @apply text-sm font-medium text-gray-600;
  }
  
  .status-text-placeholder {
    @apply opacity-50;
  }
  
  .clear-button {
    @apply text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600;
    @apply hover:bg-gray-200 transition-colors duration-200;
    @apply border border-gray-200 hover:border-gray-300;
  }

  /* 카테고리 래퍼 */
  .category-filter__wrapper {
    @apply flex flex-wrap gap-3 justify-center items-center;
  }

  /* 카테고리 아이템 */
  .category-filter__item {
    @apply relative px-4 py-2.5 rounded-full text-sm font-medium;
    @apply transition-all duration-300 ease-out;
    @apply bg-white border border-gray-200 text-gray-700;
    @apply hover:border-gray-400 hover:shadow-md;
    @apply focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2;
    @apply transform hover:-translate-y-0.5;
    @apply flex items-center gap-2.5;
    @apply min-w-fit;
    overflow: hidden;
  }
  
  /* 선택 상태 인디케이터 */
  .selection-indicator {
    @apply w-2 h-2 rounded-full border border-gray-300;
    @apply transition-all duration-300 ease-out;
    @apply flex items-center justify-center;
    flex-shrink: 0;
  }
  
  .selection-indicator.active {
    @apply border-white bg-white;
  }
  
  .indicator-dot {
    @apply w-1 h-1 rounded-full bg-transparent;
    @apply transition-all duration-300 ease-out;
  }
  
  .selection-indicator.active .indicator-dot {
    @apply bg-gray-800;
  }
  
  /* 카테고리 텍스트 */
  .category-text {
    @apply relative z-10 whitespace-nowrap;
  }
  
  /* 배경 효과 */
  .category-filter__item-bg {
    @apply absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100;
    @apply opacity-0 transition-opacity duration-300;
    @apply rounded-full;
    z-index: -1;
  }
  
  .category-filter__item:hover .category-filter__item-bg {
    @apply opacity-100;
  }

  /* 선택된 상태 */
  .category-filter__item.selected {
    @apply bg-gray-800 text-white border-gray-800;
    @apply shadow-lg hover:shadow-xl;
    @apply hover:bg-gray-900 hover:border-gray-900;
  }
  
  .category-filter__item.selected .category-filter__item-bg {
    @apply bg-gradient-to-r from-gray-700 to-gray-800;
    @apply opacity-100;
  }
  
  .category-filter__item.selected .selection-indicator {
    @apply border-gray-300 bg-gray-300;
  }
  
  .category-filter__item.selected .selection-indicator .indicator-dot {
    @apply bg-gray-800;
  }
  
  /* 반응형 디자인 */
  @media (max-width: 768px) {
    .status-bar {
      @apply mb-4 h-6;
    }
    
    .status-text, .status-text-placeholder {
      @apply text-xs;
    }
    
    .clear-button {
      @apply text-xs px-2 py-0.5;
    }
    
    .category-filter__wrapper {
      @apply gap-2;
    }
    
    .category-filter__item {
      @apply px-3 py-2 text-xs gap-2;
    }
    
    .selection-indicator {
      @apply w-1.5 h-1.5;
    }
    
    .indicator-dot {
      @apply w-0.5 h-0.5;
    }
  }
  
  @media (max-width: 640px) {
    .category-filter__container {
      @apply px-4;
    }
    
    .category-filter__wrapper {
      @apply gap-1.5;
    }
    
    .category-filter__item {
      @apply px-2.5 py-1.5 text-xs;
    }
  }
</style>