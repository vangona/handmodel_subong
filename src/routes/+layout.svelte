<script>
	import Analytics from '$lib/components/common/Analytics.svelte';
	import TagManager from '$lib/components/common/TagManager.svelte';
	import '../app.css';
	// 필요한 경우 추가적인 스크립트를 여기에 작성하세요.
</script>

<Analytics />
<TagManager />

<nav class="bg-primary text-white shadow-md p-4">
	<div class="container mx-auto flex justify-between items-center">
		<a href="/" class="text-lg font-bold">My Portfolio</a>
		<ul class="flex space-x-4">
			<li><a href="/" class="hover:underline">홈</a></li>
			<li><a href="/about" class="hover:underline">소개</a></li>
			<li><a href="/contact" class="hover:underline">연락처</a></li>
			<li><a href="/admin" class="hover:underline">관리자</a></li>
		</ul>
	</div>
</nav>

<div class="app-container flex">
	<slot></slot>
</div>

<style>
	nav {
		background-color: var(--primary);
		padding: 1rem;
		z-index: 10;
		position: relative;
	}
	nav ul {
		list-style: none;
		display: flex;
		gap: 1rem;
		justify-content: center;
	}
	nav a {
		color: #333;
		text-decoration: none;
	}
	nav a:hover {
		text-decoration: underline;
	}
</style>
