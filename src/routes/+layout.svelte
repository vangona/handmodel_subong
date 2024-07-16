<script>
	import '../app.css';
	import Analytics from '$lib/analytics.svelte';
	import TagManager from '$lib/tag-manager.svelte';
</script>

<Analytics />
<TagManager />
<div class="app-container flex">
	<div class="hidden md:block">test</div>
	<div class="mobile-main max-w-[480px] flex-grow bg-warmgray-light">
		<slot></slot>
	</div>
	<div class="hidden sm:block">test</div>
</div>

<style></style>
