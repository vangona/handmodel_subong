<script lang="ts">
	import { onMount } from 'svelte';
	import Analytics from '$lib/components/common/Analytics.svelte';
	import TagManager from '$lib/components/common/TagManager.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';

	const items = [
		{ href: '/', label: '홈' },
		{ href: '/about', label: '소개' },
		{ href: '/contact', label: '연락처' },
		// { href: '/admin', label: '관리자' }
	];

	let isNavVisible = true;
	let lastScrollY = 0;

	onMount(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			isNavVisible = currentScrollY < lastScrollY || currentScrollY < 50;
			lastScrollY = currentScrollY;
		}

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<Analytics />
<TagManager />

<nav class="fixed top-0 left-0 right-0 bg-primary text-white shadow-md p-4 z-50 transition-all duration-300 ease-in-out"
     class:translate-y-0={isNavVisible}
     class:-translate-y-full={!isNavVisible}>
	<div class="container mx-auto flex justify-between items-center">
		<a href="/" class="text-xl font-bold font-serif">손모델 심수연</a>
		<ul class="flex space-x-4 font-serif">
			{#each items as item}
				<li>
					<Button variant="ghost" asChild class="hover:bg-gray-500 text-lg">
						<a href={item.href}>{item.label}</a>
					</Button>
				</li>
			{/each}
		</ul>
	</div>
</nav>

<div class="app-container flex pt-16">
	<slot />
</div>

<style>
	nav {
		transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
	}
	
	nav.translate-y-0 {
		transform: translateY(0);
		opacity: 1;
	}
	
	nav.-translate-y-full {
		transform: translateY(-100%);
		opacity: 0;
	}
</style>
