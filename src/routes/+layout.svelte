<script>
	import Analytics from '$lib/components/common/Analytics.svelte';
	import TagManager from '$lib/components/common/TagManager.svelte';
	import '../app.css';
	// 필요한 경우 추가적인 스크립트를 여기에 작성하세요.
</script>

<Analytics />
<TagManager />
<nav class="main-nav">
	<ul>
		<li><a href="/">홈</a></li>
		<li><a href="/about">소개</a></li>
		<li><a href="/contact">연락처</a></li>
		<li><a href="/admin">관리자</a></li>
	</ul>
</nav>

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

<style>
	.main-nav {
		background-color: #333;
		padding: 1rem;
		z-index: 10; /* 네비게이션 바가 다른 요소들 위에 위치하도록 설정 */
		position: relative; /* z-index가 적용되려면 position 속성이 필요합니다 */
	}
	.main-nav ul {
		list-style: none;
		display: flex;
		gap: 1rem;
		justify-content: center;
	}
	.main-nav a {
		color: white;
		text-decoration: none;
	}
	.main-nav a:hover {
		text-decoration: underline;
	}
</style>
