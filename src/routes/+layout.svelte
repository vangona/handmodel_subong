<script>
	import '../app.css';
	import Analytics from '$lib/analytics.svelte';
</script>

<Analytics />
<div class="app-container flex">
	<div class="hidden xl:block">test</div>
	<div class="bg-warmgray-light mobile-main max-w-[768px] flex-grow">
		<slot></slot>
	</div>
	<div class="hidden md:block">test</div>
</div>

<style></style>
