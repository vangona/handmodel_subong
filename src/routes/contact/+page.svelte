<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import handSrc from '$lib/assets/images/hero-hand.png';
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Button } from "$lib/components/ui/button";
	import { submitContactForm } from "$lib/api/contact";
	import type { ContactForm } from "$lib/api/contact";
	import { getPageContent, type PageContent } from '$lib/api/pages';

	interface ContactSections {
		brief: string
		sns: string
		notices: string[]
	}

	interface ContactContent {
		sections: ContactSections
	}

	function isContactContent(content: any): content is ContactContent {
		return content?.sections?.brief !== undefined &&
			   content?.sections?.sns !== undefined &&
			   Array.isArray(content?.sections?.notices)
	}

	let visible = false;
	let submitting = false;
	let error = '';
	let pageContent: PageContent | null = null;
	let isLoading = true;

	$: content = pageContent?.content || null;
	$: sections = isContactContent(content) ? content.sections : null;

	let form: ContactForm = {
		name: '',
		company: '',
		phone: '',
		project_type: '',
		message: ''
	};

	// 필드별 에러 메시지
	let fieldErrors = {
		name: '',
		phone: '',
		message: ''
	};

	// 필드 유효성 검사
	function validateField(field: string, value: string) {
		switch (field) {
			case 'name':
				fieldErrors.name = !value.trim() ? '성함을 입력해주세요.' : '';
				break;
			case 'phone':
				fieldErrors.phone = !value.trim() ? '연락처를 입력해주세요.' : '';
				break;
			case 'message':
				fieldErrors.message = !value.trim() ? '문의 내용을 입력해주세요.' : '';
				break;
		}
	}

	// 폼 전체 유효성 검사
	function validateForm() {
		validateField('name', form.name);
		validateField('phone', form.phone);
		validateField('message', form.message);

		return !fieldErrors.name && !fieldErrors.phone && !fieldErrors.message;
	}

	async function handleSubmit() {
		if (!validateForm()) {
			error = '필수 항목을 모두 입력해주세요.';
			return;
		}

		submitting = true;
		error = '';
		
		try {
			await submitContactForm(form);
			alert('문의가 성공적으로 접수되었습니다.\n삐른 시간 내에 연락드리겠습니다.\n평균 답장 시간: 2-3시간 이내');
			// 폼 초기화
			form = {
				name: '',
				company: '',
				phone: '',
				project_type: '',
				message: ''
			};
			// 에러 메시지 초기화
			fieldErrors = {
				name: '',
				phone: '',
				message: ''
			};
		} catch (e) {
			error = e instanceof Error ? e.message : '문의 접수 중 오류가 발생했습니다.';
		} finally {
			submitting = false;
		}
	}

	onMount(async () => {
		pageContent = await getPageContent('collaboration');
		isLoading = false;
		visible = true;
	});

	const contactSchema = {
		"@context": "https://schema.org",
		"@type": "ContactPage",
		"name": "손모델 심수연 연락처",
		"description": "손모델 심수연과 협업 문의를 위한 연락처 페이지입니다.",
		"mainEntity": {
			"@type": "ContactPoint",
			"contactType": "customer service",
			"url": "https://open.kakao.com/o/sBSr9QCc",
			"availableLanguage": ["Korean"]
		}
	};
</script>

<svelte:head>
	<title>협업 | 손모델 심수연</title>
	<meta name="description" content="손모델 심수연의 포트폴리오 사이트 | 손모델, 부분모델 협업 문의" />
	<meta name="keywords" content="손모델, 심수연, 연락처, 문의, 인스타그램, 카카오톡" />
	<meta property="og:title" content="손모델 심수연 | 협업" />
	<meta property="og:description" content="손모델 심수연의 포트폴리오 사이트 | 손모델, 부분모델 협업 문의" />
	<meta property="og:image" content="https://umpactdflfdhwbufbzzp.supabase.co/storage/v1/object/public/post-images/0.6739137500664765.jpg" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://subong.vercel.app/contact" />
	<script type="application/ld+json">
		{JSON.stringify(contactSchema)}
	</script>
</svelte:head>

<div class="flex justify-center items-start pt-8 md:pt-12 min-h-screen w-full bg-offwhite bg-opacity-90">
	<div class="container mx-auto px-4 py-8 max-w-5xl">
		{#if visible && !isLoading && sections}
			<div class="bg-white rounded-lg shadow-xl overflow-hidden" in:fade={{ duration: 500, delay: 200 }}>
				<div class="md:flex">
					<div class="p-2">
						<p class=" text-gray-600" in:fly={{ y: 20, duration: 500, delay: 400 }}>{sections.brief}</p>
					</div>
				</div>

				<div class="px-8 py-6">					
					<div class="grid md:grid-cols-2 gap-8">
						<div>
							<h2 class="text-2xl font-semibold text-gray-800 mb-6 font-serif" in:fly={{ y: 20, duration: 500, delay: 500 }}>문의하기</h2>
							<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4" in:fly={{ y: 20, duration: 500, delay: 600 }}>
								<div class="grid gap-2">
									<Label for="name">성함 <span class="text-red-500">*</span></Label>
									<Input 
										type="text" 
										id="name" 
										bind:value={form.name} 
										on:blur={() => validateField('name', form.name)}
										class={fieldErrors.name ? 'border-red-500' : ''}
										placeholder="담당자 성함을 입력해주세요" 
									/>
									{#if fieldErrors.name}
										<p class="text-red-500 text-sm">{fieldErrors.name}</p>
									{/if}
								</div>
								<div class="grid gap-2">
									<Label for="company">소속</Label>
									<Input type="text" id="company" bind:value={form.company} placeholder="회사명/브랜드명을 입력해주세요" />
								</div>
								<div class="grid gap-2">
									<Label for="phone">연락처 <span class="text-red-500">*</span></Label>
									<Input 
										type="tel" 
										id="phone" 
										bind:value={form.phone} 
										on:blur={() => validateField('phone', form.phone)}
										class={fieldErrors.phone ? 'border-red-500' : ''}
										placeholder="연락받으실 전화번호를 입력해주세요" 
									/>
									{#if fieldErrors.phone}
										<p class="text-red-500 text-sm">{fieldErrors.phone}</p>
									{/if}
								</div>
								<div class="grid gap-2">
									<Label for="project_type">촬영 종류</Label>
									<Input type="text" id="project_type" bind:value={form.project_type} placeholder="예) 광고 촬영, 화보 촬영, 제품 촬영 등" />
								</div>
								<div class="grid gap-2">
									<Label for="message">문의 내용 <span class="text-red-500">*</span></Label>
									<textarea
										id="message"
										bind:value={form.message} 
										on:blur={() => validateField('message', form.message)}
										class={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${fieldErrors.message ? 'border-red-500' : ''}`}
										placeholder="촬영 일정, 페이 문의, 컨셉 등 프로젝트에 대해 자유롭게 작성해주세요" 
										rows="4"
									></textarea>
									{#if fieldErrors.message}
										<p class="text-red-500 text-sm">{fieldErrors.message}</p>
									{/if}
								</div>

								{#if error}
									<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
										{error}
									</div>
								{/if}

								<div class="flex justify-end mt-4">
									<Button 
										type="submit" 
										class="w-full" 
										disabled={submitting}
									>
										{submitting ? '문의 접수 중...' : '문의하기'}
									</Button>
								</div>
							</form>
						</div>

						<div>
							<h2 class="text-2xl font-semibold text-gray-800 mb-6 font-serif" in:fly={{ y: 20, duration: 500, delay: 700 }}>SNS</h2>
							<div class="space-y-6" in:fly={{ y: 20, duration: 500, delay: 800 }}>
								<div class="space-y-4">
									<p class="text-gray-600 whitespace-pre-line">{sections.sns}</p>
									<ul class="list-disc pl-5 text-gray-600 space-y-2">
										{#each sections?.notices || [] as notice}
											<li>{notice}</li>
										{/each}
									</ul>
								</div>

								<div class="flex flex-col gap-4">
									<a
										href="https://www.instagram.com/handmodel_subong/"
										target="_blank"
										rel="noopener noreferrer"
										class="btn flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
									>
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
										</svg>
									</a>
									<a
										href="https://open.kakao.com/o/sBSr9QCc"
										target="_blank"
										rel="noopener noreferrer"
										class="btn flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
									>
										<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 6.053-.172.702-.673 2.604-.766 2.992-.116.483.259.463.429.331.276-.197 2.755-1.877 3.866-2.641.524.074 1.062.113 1.612.113 4.971 0 9-3.185 9-7.115S16.971 3 12 3z"/>
										</svg>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else if isLoading}
			<div class="flex justify-center items-center min-h-[50vh]">
				<p>로딩 중...</p>
			</div>
		{:else}
			<div class="flex justify-center items-center min-h-[50vh]">
				<p>컨텐츠를 불러올 수 없습니다.</p>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.btn {
		@apply py-1 px-6 rounded-lg text-lg font-semibold transition-colors duration-300;
	}
	.btn-primary {
		@apply bg-purple-600 text-white hover:bg-purple-700;
	}
	.btn-warning {
		@apply bg-yellow-500 text-white hover:bg-yellow-600;
	}
</style>

