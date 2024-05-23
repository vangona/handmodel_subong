<script lang="ts">
	import Button from '../button/button.svelte';

	const clickPortfolio = () => {
		alert('포트폴리오 클릭');
	};

	const clickContact = () => {
		alert('연락처 클릭');
	};

	let value = '';
</script>

<header>
	<Button on:click={clickPortfolio}>포트폴리오</Button>
	<Button on:click={clickContact}>연락처</Button>
	<input bind:value />
	<p>{value}</p>
</header>
