# SmartLibrary Frontend

SmartLibrary의 프론트엔드 애플리케이션입니다. Next.js 14와 TypeScript를 기반으로 구축된 현대적인 도서관 관리 시스템의 웹 인터페이스입니다.

## 🚀 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes (다크/라이트 모드)

## 📋 주요 기능

### 📚 도서 관리
- 도서 목록 조회 및 검색
- 도서 상세 정보 보기
- 도서 추가/수정/삭제
- 도서 카테고리별 분류

### 👥 사용자 관리
- 사용자 목록 조회
- 사용자 추가/수정
- 사용자 활성화/비활성화
- 사용자 역할 관리 (관리자, 사서, 일반 사용자)

### 📖 대출 관리
- 도서 대출 신청
- 대출 반납 처리
- 대출 기간 연장
- 대출 상태 추적

### 📊 통계 및 분석
- 전체 대출 통계
- 월별 대출 현황
- 인기 도서 분석
- 카테고리별 통계
- 부서별 대출 현황

## 🛠️ 설치 및 실행

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 pnpm

### 설치 방법

1. **저장소 클론**
git clone https://github.com/haesikryu/smartlibrary-frontend.git
cd smartlibrary-frontend

2. **의존성 설치**
npm install
# 또는
pnpm install

3. **환경 변수 설정**
# .env.local 파일 생성
NEXT_PUBLIC_API_URL=http://localhost:8080/api

4. **개발 서버 실행**
npm run dev
# 또는
pnpm dev

5. **브라우저에서 확인**
http://localhost:3000

## 📁 프로젝트 구조

smartlibrary-frontend/
├── app/                    # Next.js App Router
│   ├── books/             # 도서 관련 페이지
│   ├── users/             # 사용자 관련 페이지
│   ├── lending/           # 대출 관련 페이지
│   ├── statistics/        # 통계 페이지
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 홈페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── navigation.tsx    # 네비게이션
│   └── theme-provider.tsx # 테마 제공자
├── hooks/                # 커스텀 훅
├── lib/                  # 유틸리티 및 API
│   ├── api.ts           # API 클라이언트
│   └── utils.ts         # 유틸리티 함수
├── public/              # 정적 파일
└── styles/              # 스타일 파일

## 🔧 API 연동

프론트엔드는 Spring Boot 백엔드 API와 연동됩니다:

- **Base URL**: http://localhost:8080/api
- **Endpoints**:
  - /books - 도서 관리
  - /users - 사용자 관리
  - /lending - 대출 관리
  - /statistics - 통계 데이터

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **다크/라이트 모드**: 사용자 선호도에 따른 테마 전환
- **접근성**: WCAG 가이드라인 준수
- **로딩 상태**: 사용자 경험을 위한 로딩 인디케이터
- **에러 처리**: 친화적인 에러 메시지

## 📱 페이지 구성

### 메인 페이지
- 대시보드 및 주요 통계 요약
- 빠른 액세스 메뉴

### 도서 관리
- /books - 도서 목록
- /books/add - 도서 추가
- /books/[id] - 도서 상세
- /books/[id]/edit - 도서 수정

### 사용자 관리
- /users - 사용자 목록
- /users/add - 사용자 추가
- /users/[id]/edit - 사용자 수정

### 대출 관리
- /lending - 대출 목록
- /lending/new - 새 대출

### 통계
- /statistics - 상세 통계 및 차트

## 🚀 배포

### Vercel 배포 (권장)
npm install -g vercel
vercel

### Docker 배포
# Dockerfile 생성 후
docker build -t smartlibrary-frontend .
docker run -p 3000:3000 smartlibrary-frontend

## 🔗 관련 프로젝트

- **Backend**: https://github.com/haesikryu/smartlibrary-backend
- **API Documentation**: Spring Boot REST API

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👨‍💻 개발자

- **Haesik Ryu** - https://github.com/haesikryu

## 📞 지원

프로젝트에 대한 질문이나 이슈가 있으시면 GitHub Issues를 통해 문의해주세요.

---

**SmartLibrary Frontend** - 현대적인 도서관 관리 시스템의 웹 인터페이스
