<svelte:head>
	<title>소개 페이지 - 손모델 포트폴리오</title>
	<meta name="description" content="손모델 심수연의 소개 페이지입니다. 다양한 광고와 촬영에서 활동한 이력을 확인하세요." />
	<meta name="keywords" content="손모델, 포트폴리오, 소개, 이력" />
</svelte:head>

<div class="about-container max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
	<h1 class="text-3xl font-bold mb-4 text-gray-800">About</h1>
	<p class="text-gray-600">손모델의 포트폴리오 사이트에 오신 것을 환영합니다. 이 페이지에서는 저의 이력과 자기 소개를 확인하실 수 있습니다.</p>
	<div class="about-section mt-4">
		<h2 class="text-2xl font-semibold text-gray-800">자기 소개</h2>
		<p class="text-gray-600">안녕하세요, 저는 손모델 심수연입니다. 다양한 광고와 촬영에서 손모델로 활동하고 있습니다.</p>
		<h2 class="text-2xl font-semibold mt-4 text-gray-800">이력</h2>
		<ul class="list-disc pl-5 text-gray-600">
			<li>2023년 - 유명 브랜드 광고 촬영</li>
			<li>2022년 - 패션 잡지 화보 촬영</li>
			<li>2021년 - 뷰티 제품 광고 모델</li>
		</ul>
	</div>
	<div class="contact-buttons mt-4 flex flex-col md:flex-row gap-4">
		<a href="https://www.instagram.com/yourprofile" target="_blank" class="btn btn-secondary">인스타그램</a>
		<a href="https://open.kakao.com/o/yourchat" target="_blank" class="btn btn-warning">카카오톡 오픈 채팅</a>
	</div>
</div>

<style>
	.about-section {
		@apply mt-4;
	}

	.contact-buttons {
		@apply mt-4 flex flex-col md:flex-row gap-4;
	}
</style>
