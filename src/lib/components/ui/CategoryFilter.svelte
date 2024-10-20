<script lang="ts">
  export let categories: Array<string>;
  export let selectedCategories: Array<string> = [];
  export let onSelect: (category: string) => void;

  const toggleCategory = (category: string, event: Event) => {
    event.preventDefault();
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

<style lang="postcss">
  .category-filter__wrapper {
    @apply flex flex-wrap gap-2 justify-center;
  }

  .category-filter__item {
    @apply px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out;
    @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
    @apply focus:outline-none focus:ring-2 focus:ring-gray-300;
  }

  .category-filter__item.selected {
    @apply bg-gray-700 text-white hover:bg-gray-800;
  }
</style>
