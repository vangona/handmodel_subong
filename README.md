# 손모델 심수연 포트폴리오 웹사이트

이 프로젝트는 손모델 심수연의 포트폴리오를 위한 웹사이트입니다. SvelteKit을 사용하여 개발되었으며, Supabase를 백엔드로 활용합니다.

## 주요 기능

- 반응형 디자인으로 모바일과 데스크톱 환경 모두 지원
- 작품 갤러리와 카테고리 필터링
- 관리자 페이지를 통한 콘텐츠 관리
- SEO 최적화

## 기술 스택

- Frontend: SvelteKit, TailwindCSS
- Backend: Supabase
- Deployment: Vercel

## 프로젝트 구조

📦src
 ┣ 📂lib
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📜auth.ts
 ┃ ┃ ┣ 📜categories.ts
 ┃ ┃ ┣ 📜dashboard.ts
 ┃ ┃ ┣ 📜mainImages.ts
 ┃ ┃ ┣ 📜posts.ts
 ┃ ┃ ┣ 📜supabaseClient.ts
 ┃ ┃ ┗ 📜users.ts
 ┃ ┣ 📂assets
 ┃ ┃ ┣ 📂images
 ┃ ┃ ┃ ┣ 📜.DS_Store
 ┃ ┃ ┃ ┗ 📜hero-hand.png
 ┃ ┃ ┗ 📜.DS_Store
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂common
 ┃ ┃ ┃ ┣ 📜Analytics.svelte
 ┃ ┃ ┃ ┗ 📜TagManager.svelte
 ┃ ┃ ┣ 📂layout
 ┃ ┃ ┃ ┣ 📜Header.svelte
 ┃ ┃ ┃ ┗ 📜Sidebar.svelte
 ┃ ┃ ┣ 📂my-ui
 ┃ ┃ ┃ ┣ 📂drawer
 ┃ ┃ ┃ ┃ ┗ 📜drawer.svelte
 ┃ ┃ ┃ ┗ 📂hero
 ┃ ┃ ┃ ┃ ┣ 📜hero.svelte
 ┃ ┃ ┃ ┃ ┗ 📜moving-title.svelte
 ┃ ┃ ┗ 📂ui
 ┃ ┃ ┃ ┣ 📂button
 ┃ ┃ ┃ ┃ ┣ 📜button.svelte
 ┃ ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┃ ┣ 📂drawer
 ┃ ┃ ┃ ┃ ┣ 📜drawer-content.svelte
 ┃ ┃ ┃ ┃ ┣ 📜drawer-description.svelte
 ┃ ┃ ┃ ┃ ┣ 📜drawer-footer.svelte
 ┃ ┃ ┃ ┃ ┣ 📜drawer-header.svelte
 ┃ ┃ ┃ ┃ ┣ 📜drawer-nested.svelte
 ┃ ┃ ┃ ┃ ┣ 📜drawer-overlay.svelte
 ┃ ┃ ┃ ┃ ┣ 📜drawer-title.svelte
 ┃ ┃ ┃ ┃ ┣ 📜drawer.svelte
 ┃ ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┃ ┣ 📜CategoryFilter.svelte
 ┃ ┃ ┃ ┗ 📜ImagePositioner.svelte
 ┃ ┣ 📂constants
 ┃ ┃ ┣ 📜supabase.ts
 ┃ ┃ ┗ 📜ui.ts
 ┃ ┣ 📂styles
 ┃ ┃ ┗ 📜global.css
 ┃ ┣ 📜.DS_Store
 ┃ ┣ 📜index.ts
 ┃ ┗ 📜utils.ts
 ┣ 📂routes
 ┃ ┣ 📂about
 ┃ ┃ ┗ 📜+page.svelte
 ┃ ┣ 📂admin
 ┃ ┃ ┣ 📂categories
 ┃ ┃ ┃ ┗ 📜+page.svelte
 ┃ ┃ ┣ 📂dashboard
 ┃ ┃ ┃ ┗ 📜+page.svelte
 ┃ ┃ ┣ 📂images
 ┃ ┃ ┃ ┗ 📜+page.svelte
 ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┗ 📜+page.svelte
 ┃ ┃ ┣ 📂posts
 ┃ ┃ ┃ ┣ 📂add
 ┃ ┃ ┃ ┃ ┗ 📜+page.svelte
 ┃ ┃ ┃ ┣ 📂edit
 ┃ ┃ ┃ ┃ ┗ 📂[id]
 ┃ ┃ ┃ ┃ ┃ ┗ 📜+page.svelte
 ┃ ┃ ┃ ┗ 📜+page.svelte
 ┃ ┃ ┣ 📂users
 ┃ ┃ ┃ ┗ 📜+page.svelte
 ┃ ┃ ┣ 📜+layout.svelte
 ┃ ┃ ┗ 📜+page.svelte
 ┃ ┣ 📂contact
 ┃ ┃ ┗ 📜+page.svelte
 ┃ ┣ 📂post
 ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┗ 📜+page.svelte
 ┃ ┃ ┗ 📜+page.svelte
 ┃ ┣ 📜+layout.svelte
 ┃ ┗ 📜+page.svelte
 ┣ 📜.DS_Store
 ┣ 📜app.css
 ┣ 📜app.d.ts
 ┗ 📜app.html

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
