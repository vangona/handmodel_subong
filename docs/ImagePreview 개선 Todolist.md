# ImagePreview 컴포넌트 개선 Todolist

## 1. 프리뷰 모드 구분
- [x] 프리뷰 모드 타입 정의 추가 (`preview` | `edit` | `display`)
  - [x] `preview`: 관리자 페이지에서 이미지 위치/크기 조정 시 프리뷰
  - [x] `edit`: 실제 이미지 위치/크기 조정 시 사용
  - [x] `display`: 실제 사이트에서 표시될 때 사용

## 2. 컨테이너 크기 및 비율 개선
- [x] 실제 표시되는 영역과 동일한 크기로 프리뷰 제공
  - [x] Hero 섹션의 실제 크기 측정 및 반영 (360px 너비)
  - [x] 포스트 썸네일의 실제 크기 측정 및 반영 (96px 너비)
- [x] 컨테이너 크기를 props로 받을 수 있도록 수정
  - [x] `width`, `height` props 추가
  - [x] 반응형 크기 지원 (px, %, vw, vh 등)

## 3. 이미지 조정 UX 개선
- [ ] 프리뷰 모드별 다른 조작 방식 제공
  - [ ] `edit` 모드: 현재처럼 드래그로 위치 조정
  - [ ] `preview` 모드: 마우스 오버 시 실제 표시될 모습 미리보기
- [ ] 실시간 프리뷰 제공
  - [ ] Hero 섹션에서의 모습 미리보기
  - [ ] 포스트 목록에서의 모습 미리보기
- [x] 메인 이미지 PC/모바일 동시 프리뷰
  - [x] PC 버전 프리뷰 (360px 고정 너비, 화면 높이)
  - [x] 모바일 버전 프리뷰 (360px 너비, 9:16 비율)
  - [x] 이미지 위치/크기 조정 시 실시간으로 양쪽 모두 업데이트

## 4. 이미지 크기 최적화
- [ ] 각 모드별 적절한 이미지 크기 사용
  - [ ] Hero 섹션용 대형 이미지
  - [ ] 썸네일용 작은 이미지
- [ ] 이미지 로딩 최적화
  - [ ] lazy loading 구현
  - [ ] 프리뷰용 저해상도 이미지 사용

## 5. 접근성 개선
- [x] 각 모드별 적절한 aria 레이블 제공
- [x] 키보드 조작 지원 개선
  - [x] 방향키로 미세 조정
  - [x] 단축키 지원

## 6. 문서화
- [ ] 각 모드별 사용법 문서화
- [ ] Props 타입 정의 및 설명
- [ ] 예제 코드 작성
