<script lang="ts">
	import MovingTitle from './moving-title.svelte';
</script>

<div class="hero fixed top-0 left-0 w-full md:w-[360px] h-[200px] md:h-screen pointer-events-none z-10">
	<div class="hero-overlay bg-warmgray-dark opacity-50"></div>
	<div class="hero-content aspect-[16/9] md:aspect-[9/10] w-full p-0">
		<MovingTitle />
	</div>
</div>
