<script lang="ts">
  export let categories: Array<string>;
  export let selectedCategories: Array<string> = [];
  export let onSelect: (category: string) => void;

  const toggleCategory = (category: string, event: Event) => {
    event.preventDefault(); // 기본 동작 방지
    onSelect(category);
  };
</script>

<div class="category-filter__wrapper">
  {#each categories as category}
    <button
      type="button"
      class="category-filter__item {selectedCategories.includes(category) ? 'selected' : ''}"
      on:click={(event) => toggleCategory(category, event)}
    >
      {category}
    </button>
  {/each}
</div>

<style>
  .category-filter__item {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }
  .category-filter__item.selected {
    background-color: #007bff;
    color: white;
  }
  .category-filter__item:not(.selected):hover {
    background-color: #e0e0e0;
  }
</style>
