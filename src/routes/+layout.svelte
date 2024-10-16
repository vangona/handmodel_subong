<script lang="ts">
	import Analytics from '$lib/components/common/Analytics.svelte';
	import TagManager from '$lib/components/common/TagManager.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';

	const items = [
		{ href: '/', label: '홈' },
		{ href: '/about', label: '소개' },
		{ href: '/contact', label: '연락처' },
		{ href: '/admin', label: '관리자' }
	];
</script>

<Analytics />
<TagManager />

<nav class="bg-primary text-white shadow-md p-4">
	<div class="container mx-auto flex justify-between items-center">
		<a href="/" class="text-lg font-bold">My Portfolio</a>
		<ul class="flex space-x-4">
			{#each items as item}
				<li>
					<Button variant="ghost" asChild class="hover:bg-gray-500">
						<a href={item.href}>{item.label}</a>
					</Button>
				</li>
			{/each}
		</ul>
	</div>
</nav>

<div class="app-container flex">
	<slot />
</div>
