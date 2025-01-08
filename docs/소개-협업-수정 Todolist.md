# 소개/협업 페이지 수정 기능 구현 Todo 리스트

## 1. 데이터베이스 설계
- [x] 페이지 컨텐츠 및 사이트 설정을 저장할 테이블 생성
  - 테이블명: page_contents
  - 필드:
    - id (Primary Key)
    - page_type (소개/협업/settings 구분)
    - content (JSON 형태로 저장)
      - 소개(about): {
        sections: {
          brief: string,  // 한 줄 소개
          introduction: string,  // 소개
          activities: string[]  // 주요 활동
        }
      }
      - 협업(contact): {
        sections: {
          brief: string,  // 한 줄 소개
          sns: string  // SNS 설명
        }
      }
      - settings: {site_title, menu_items}
    - updated_at
    - created_at

## 2. API 구현
- [x] Supabase API 클라이언트에 페이지 컨텐츠 관련 함수 추가
  - getPageContent(pageType: string)
  - updatePageContent(pageType: string, content: object)
  - getSiteSettings() // pageType: 'settings'인 데이터 조회
  - updateSiteSettings(content: object) // pageType: 'settings'인 데이터 수정

## 3. 관리자 페이지 UI 구현
- [x] 관리자 페이지에 소개/협업 페이지 수정 메뉴 추가
- [x] 관리자 페이지에 사이트 설정 메뉴 추가
  - 사이트 타이틀 수정 폼
  - 메뉴 이름 수정 폼
  - 변경사항 미리보기
- [ ] 페이지 컨텐츠 수정 폼 컴포넌트 개발 (수정 필요)
  - 소개 페이지 폼
    - 한 줄 소개 입력 필드
    - 소개 내용 에디터
    - 주요 활동 목록 (추가/삭제/순서변경)
  - 협업 페이지 폼
    - 한 줄 소개 입력 필드
    - SNS 설명 에디터
  - 미리보기 기능
- [x] 변경사항 저장 및 취소 기능 구현

## 4. 프론트엔드 로직 구현
- [x] 페이지 컨텐츠 및 사이트 설정 상태 관리 스토어 구현
- [x] 레이아웃에서 사이트 설정 데이터 연동
- [ ] 소개/협업 페이지에서 각각의 컨텐츠 데이터 연동
  - 소개 페이지
    - 한 줄 소개 섹션
    - 소개 내용 섹션
    - 주요 활동 목록 섹션
  - 협업 페이지
    - 한 줄 소개 섹션
    - SNS 설명 섹션
  - 반응형 레이아웃 적용

## 5. 보안 및 권한 관리
- [x] 관리자 권한 체크 로직 구현
- [x] API 엔드포인트 보안 설정

## 6. 테스트 및 검증
- [x] API 엔드포인트 테스트
- [ ] 컨텐츠 및 사이트 설정 수정 기능 테스트 (재검증 필요)
  - 소개 페이지 각 섹션 수정 테스트
  - 협업 페이지 각 섹션 수정 테스트
  - 주요 활동 목록 관리 테스트
- [x] 권한 관리 테스트
- [ ] 브라우저 호환성 테스트

## 7. 배포 및 모니터링
- [ ] 데이터베이스 마이그레이션 스크립트 작성
- [ ] 배포 전 최종 테스트
- [ ] 모니터링 설정
