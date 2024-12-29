# 이미지 위치 및 크기 조정 기능 구현

## 1. ImagePositioner 컴포넌트 개선
- [x] scale 조정 기능 추가
  - [x] 슬라이더 또는 +/- 버튼으로 scale 조정 UI 구현
  - [x] scale 값 범위 설정 (예: 0.5 ~ 2.0)
  - [x] scale 조정 시 실시간 미리보기
- [x] position 조정 UX 개선
  - [x] 드래그 포인터 스타일 개선
  - [x] 키보드 방향키로도 미세 조정 가능하도록 구현
- [x] 초기값 리셋 버튼 추가

## 2. 데이터베이스 스키마 수정
- [x] main_images 테이블에 scale 컬럼 추가
- [x] posts 테이블에 thumbnail_position_x, thumbnail_position_y, thumbnail_scale 컬럼 추가
- [x] 기존 데이터 마이그레이션

## 3. API 엔드포인트 구현
- [x] apiUpdateMainImage 함수 수정
  - [x] scale 파라미터 추가
  - [x] 응답 타입 업데이트
- [x] apiUpdatePostThumbnail 함수 구현
  - [x] position_x, position_y, scale 파라미터 포함
  - [x] 적절한 에러 핸들링

## 4. 관리자 페이지 UI 구현
- [x] 메인 이미지 관리 페이지
  - [x] 현재 scale 값 표시
  - [x] scale 조정 UI 통합
- [x] 게시글 ���리 페이지
  - [x] 섬네일 이미지 위치/크기 조정 버튼 추가
  - [x] ImagePositioner 컴포넌트 통합
  - [x] 섬네일 미리보기 개선

## 5. 테스트 및 검증
- [x] 브라우저 호환성 테스트
- [x] 모바일 터치 이벤트 지원
- [x] 성능 최적화 (불필요한 리렌더링 방지)
- [x] 접근성 검증 및 개선

## 6. 문서화
- [ ] ImagePositioner 컴포넌트 사용법 문서화
- [ ] 데이터베이스 스키마 변경사항 문서화
- [ ] API 엔드포인트 명세 업데이트
