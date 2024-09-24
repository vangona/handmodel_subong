<script>
	import Analytics from '$lib/components/common/Analytics.svelte';
	import TagManager from '$lib/components/common/TagManager.svelte';
	import '../app.css';
</script>

<Analytics />
<TagManager />
<div class="app-container flex">
	<div
		class="sticky top-0 hidden h-dvh min-w-32 max-w-80 flex-grow items-center justify-center bg-slate-300 md:flex"
	>
		test
	</div>
	<div class="mobile-main max-w-[640px] flex-grow-[2] bg-warmgray-light">
		<slot></slot>
	</div>
	<div class="sticky top-0 hidden h-dvh flex-grow items-center justify-center bg-slate-300 sm:flex">
		test
	</div>
</div>

<style></style>
