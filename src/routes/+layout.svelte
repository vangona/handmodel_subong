<script>
	import '../app.css';
</script>

<div class="app-container flex">
	<div class="hidden xl:block">test</div>
	<div class="bg-warmgray-light mobile-main max-w-[768px] flex-grow">
		<slot></slot>
	</div>
	<div class="hidden md:block">test</div>
</div>

<style></style>
