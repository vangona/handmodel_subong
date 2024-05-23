<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Drawer from '$lib/components/my-ui/drawer/drawer.svelte';

	const clickPortfolio = () => {
		alert('포트폴리오 클릭');
	};

	const clickContact = () => {
		alert('연락처 클릭');
	};

	let value = '';
</script>

<header class="p-4">
	<Button on:click={clickPortfolio}>포트폴리오</Button>
	<Button on:click={clickContact}>연락처</Button>
	<div class="flex flex-col">
		<label for="test">test</label>
		<input id="test" bind:value class="border" />
		<p>{value}</p>
	</div>
	<Drawer />
</header>

<style>
</style>
