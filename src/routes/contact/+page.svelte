<svelte:head>
	<title>연락처 페이지 - 손모델 포트폴리오</title>
	<meta name="description" content="손모델 심수연과 연락할 수 있는 페이지입니다. 인스타그램과 카카오톡 오픈 채팅을 통해 문의하세요." />
	<meta name="keywords" content="손모델, 포트폴리오, 연락처, 인스타그램, 카카오톡" />
</svelte:head>

<div class="contact-container max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
	<h1 class="text-3xl font-bold mb-4 text-gray-800">Contact</h1>
	<p class="text-gray-600">손모델 심수연과 연락할 수 있는 페이지입니다. 인스타그램과 카카오톡 오픈 채팅을 통해 문의하세요.</p>
	<div class="contact-buttons mt-4 flex flex-col md:flex-row gap-4">
		<a href="https://www.instagram.com/yourprofile" target="_blank" class="btn btn-secondary">인스타그램</a>
		<a href="https://open.kakao.com/o/yourchat" target="_blank" class="btn btn-warning">카카오톡 오픈 채팅</a>
	</div>
</div>

<style>
	.contact-buttons {
		@apply mt-4 flex flex-col md:flex-row gap-4;
	}
</style>
