<script lang="ts">
  export let categories: Array<string>;
  export let selectedCategory: string;
  export let onSelect: (category: string) => void;
</script>

<div class="category-filter__wrapper">
  <button class="category-filter__item {selectedCategory === 'all' ? 'selected' : ''}" on:click={() => onSelect('all')}>
    all
  </button>
  {#each categories as category}
    <button class="category-filter__item {selectedCategory === category ? 'selected' : ''}" on:click={() => onSelect(category)}>
      {category}
    </button>
  {/each}
</div>

<style>
  /* 스타일 정의 */
</style>
