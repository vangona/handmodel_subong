<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { spring } from 'svelte/motion';
  
  export let categories: Array<string>;
  export let selectedCategories: Array<string> = [];
  export let onSelect: (category: string) => void;

  // 스프링 애니메이션을 위한 좌표
  let coords = spring({ x: 0, y: 0 }, {
    stiffness: 0.1,
    damping: 0.25
  });

  const toggleCategory = (category: string, event: Event) => {
    event.preventDefault();
    onSelect(category);
  };
  
  // 선택된 카테고리 개수 (all 제외)
  $: selectedCount = selectedCategories.filter(cat => cat !== 'all').length;
  
  // 마우스 호버 효과
  function handleMouseMove(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    coords.set({
      x: event.clientX - rect.left - rect.width / 2,
      y: event.clientY - rect.top - rect.height / 2
    });
  }
  
  function handleMouseLeave() {
    coords.set({ x: 0, y: 0 });
  }
</script>

<div class="category-filter__container">
  <!-- 선택된 개수 표시 -->
  {#if selectedCount > 0 && !selectedCategories.includes('all')}
    <div class="selected-count" in:fade={{ duration: 200 }}>
      <span class="count-badge">{selectedCount}개 선택됨</span>
    </div>
  {/if}
  
  <div class="category-filter__wrapper">
    {#each categories as category, i}
      <button
        type="button"
        class="category-filter__item {selectedCategories.includes(category) ? 'selected' : ''}"
        on:click={(event) => toggleCategory(category, event)}
        on:mousemove={handleMouseMove}
        on:mouseleave={handleMouseLeave}
        style="
          --delay: {i * 50}ms;
          --x: {$coords.x * 0.1}px;
          --y: {$coords.y * 0.1}px;
        "
        in:scale={{ duration: 300, delay: i * 50 }}
      >
        <span class="category-text">
          {category === 'all' ? '전체 보기' : category}
        </span>
        {#if selectedCategories.includes(category)}
          <svg class="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        {/if}
        <div class="category-filter__item-bg"></div>
      </button>
    {/each}
  </div>
  
  <!-- 필터 초기화 버튼 -->
  {#if selectedCategories.length > 0 && !selectedCategories.includes('all')}
    <button 
      class="reset-button"
      on:click={(e) => toggleCategory('all', e)}
      in:fade={{ duration: 200 }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M14 2L2 14M2 2L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      초기화
    </button>
  {/if}
</div>

<style lang="postcss">
  .category-filter__container {
    @apply relative flex flex-col items-center gap-4;
  }
  
  .selected-count {
    @apply absolute -top-8 left-1/2 transform -translate-x-1/2;
  }
  
  .count-badge {
    @apply text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full;
  }

  .category-filter__wrapper {
    @apply flex flex-wrap gap-3 justify-center items-center;
    @apply max-w-4xl mx-auto;
  }

  .category-filter__item {
    @apply relative px-5 py-2.5 rounded-full text-sm font-medium;
    @apply transition-all duration-300 ease-out;
    @apply bg-white border border-gray-200 text-gray-700;
    @apply hover:border-gray-400 hover:shadow-md;
    @apply focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2;
    @apply transform hover:-translate-y-0.5;
    @apply flex items-center gap-2;
    
    animation: slideIn var(--delay) ease-out;
    transform: translate(var(--x), var(--y));
    overflow: hidden;
  }
  
  .category-filter__item-bg {
    @apply absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100;
    @apply opacity-0 transition-opacity duration-300;
    @apply rounded-full;
    z-index: -1;
  }
  
  .category-filter__item:hover .category-filter__item-bg {
    @apply opacity-100;
  }

  .category-filter__item.selected {
    @apply bg-gray-800 text-white border-gray-800;
    @apply shadow-lg hover:shadow-xl;
    @apply hover:bg-gray-900 hover:border-gray-900;
    
    animation: selectPulse 0.3s ease-out;
  }
  
  .category-filter__item.selected .category-filter__item-bg {
    @apply bg-gradient-to-r from-gray-700 to-gray-800;
    @apply opacity-100;
  }
  
  .check-icon {
    @apply w-4 h-4;
    animation: checkIn 0.3s ease-out;
  }
  
  .category-text {
    @apply relative z-10;
  }
  
  .reset-button {
    @apply mt-2 px-4 py-2 rounded-full text-xs font-medium;
    @apply bg-gray-100 text-gray-600 hover:bg-gray-200;
    @apply transition-all duration-200 ease-out;
    @apply flex items-center gap-1.5;
    @apply hover:shadow-sm;
  }
  
  /* 애니메이션 */
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes selectPulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  
  @keyframes checkIn {
    from {
      transform: scale(0) rotate(-180deg);
      opacity: 0;
    }
    to {
      transform: scale(1) rotate(0);
      opacity: 1;
    }
  }
  
  /* 반응형 */
  @media (max-width: 640px) {
    .category-filter__wrapper {
      @apply gap-2;
    }
    
    .category-filter__item {
      @apply px-4 py-2 text-xs;
    }
  }
</style>