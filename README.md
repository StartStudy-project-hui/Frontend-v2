<div align="center">

# Start Study — Frontend

개발자를 위한 온라인 스터디 매칭 플랫폼 · React SPA

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

</div>

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [핵심 기능](#핵심-기능)
- [Tech Stack](#tech-stack)
- [프로젝트 구조](#프로젝트-구조)
- [Getting Started](#getting-started)
- [라우트 / 페이지](#라우트--페이지)
- [빌드 / 배포](#빌드--배포)

## 프로젝트 소개

**Start Study** 프론트엔드는 스터디 게시글을 카테고리(CS/코딩테스트/프로젝트/기타)·온라인·오프라인(카카오맵)으로 조회·작성하고, 댓글·관심글·마이페이지·관리자 대시보드를 제공하는 React 기반 SPA입니다. [`backend`](../backend) REST API를 axios로 호출하며, JWT 기반 인증과 카카오·네이버 소셜 로그인을 지원합니다.

## 핵심 기능

| 영역 | 기능 |
| --- | --- |
| **인증** | 회원가입/로그인 폼(react-hook-form + zod), 카카오·네이버 소셜 로그인, `localStorage` 기반 토큰 관리 및 401 발생 시 자동 토큰 재발급 |
| **메인/게시글** | 카테고리·정렬·온라인/오프라인 필터가 URL 검색 파라미터와 연동된 게시글 목록, 게시글 작성/수정(리치 텍스트 에디터), 상세 조회 |
| **댓글** | 게시글 상세 페이지 내 댓글/대댓글 작성·조회 |
| **관심글 / 마이페이지** | 관심 게시글 등록/조회, 내가 쓴 글 조회, 프로필 조회/수정 |
| **관리자** | 회원 관리, 게시글 관리, 블랙리스트(제재) 관리 대시보드 |
| **공통 UI** | shadcn/ui 기반 컴포넌트, 카카오맵(위치 선택), 토스트 알림 |

## Tech Stack

**Core**
- React 18, TypeScript 5.5, Vite 5

**라우팅 / 데이터**
- `react-router-dom` 6 (`createBrowserRouter`)
- `@tanstack/react-query` 5 — 서버 상태 관리 (수동 트리거 패턴, `enabled: false` + `refetch()`)
- `axios` — API 클라이언트, 전역 응답 인터셉터로 401 시 토큰 재발급/재시도

**상태 / 폼**
- `zustand` — 인증 상태(`persist` 미들웨어) 및 트리거 상태
- `react-hook-form` + `zod` — 폼 상태 및 유효성 검사

**UI**
- Tailwind CSS + shadcn/ui (Radix UI 프리미티브)
- `react-quill` — 게시글 작성용 리치 텍스트 에디터
- 카카오맵 API (오프라인 스터디 위치 선택)

**인프라 / DevOps**
- Docker (`node:20-bookworm-slim`, 개발 모드 컨테이너)
- GitHub Actions → Vercel 배포 (`.github/workflows/depoly.yml`)

## 프로젝트 구조

```
src/
├─ pages/            라우트 페이지 (Home, Write, board/, mypage/, admin/)
├─ components/        공용 컴포넌트 (Header, Modal, Pagination, KakaoMap 등) + ui/ (shadcn 프리미티브)
├─ lib/
│  ├─ axios/          api.ts — 도메인별 API 함수, publicConfig/userConfig
│  ├─ react-query/     queries.ts, queryKeys.ts, QueryProvider
│  ├─ react-router/    ProtectedRouter (인증 가드)
│  └─ zustand/         store.ts — useAuthStore, useTriggerStore
├─ constants/          카테고리/정렬/블랙리스트 옵션 등 공통 상수
├─ types/              Dto 타입 정의
└─ hooks/              커스텀 훅 (use-toast 등)
```

경로 별칭 `@/*` → `./src/*` (`vite.config.ts`, `tsconfig.app.json`에 설정).

> 아키텍처(라우팅/데이터 흐름/인증 토큰 처리/상태관리/폼)에 대한 더 자세한 설명은 [`CLAUDE.md`](./CLAUDE.md)를 참고하세요.

## Getting Started

### 1. 사전 준비

- Node.js 20

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example`을 참고하여 `.env` 파일을 생성합니다.

```bash
cp .env.example .env
```

```dotenv
VITE_BASE_URL=http://localhost:8000   # backend API 서버 주소
VITE_KAKAO_KEY=발급받은_카카오맵_JavaScript_키
```

> `VITE_BASE_URL`은 axios 요청의 `baseURL`로 사용됩니다(백엔드 로컬 실행 포트인 `8000` 등을 지정). `VITE_KAKAO_KEY`는 오프라인 스터디 위치 선택에 쓰이는 카카오맵 JavaScript 키로, [Kakao Developers](https://developers.kakao.com) 콘솔에서 발급받습니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

`--host` 옵션으로 실행되어 같은 네트워크의 다른 기기에서도 접속할 수 있습니다. 기본 주소는 `http://localhost:5173`.

Docker로 실행하려면:

```bash
docker-compose up
```

(`docker-compose.yaml`이 `npm run dev`를 포트 `5173`에서 실행하는 개발용 컨테이너를 띄웁니다.)

### 5. 린트

```bash
npm run lint
```

특정 파일만 검사: `npx eslint <path>`

> 이 저장소에는 별도의 테스트 러너(Jest/Vitest 등)가 설정되어 있지 않습니다. `npm run build` 시 `tsc -b`로 타입 체크가 수행되는 것이 현재의 정적 검증 수단입니다.

## 라우트 / 페이지

| 경로 | 페이지 | 접근 |
| --- | --- | --- |
| `/` | `Home` — 메인 게시글 목록 (검색/카테고리/정렬/온·오프라인 필터) | 공개 |
| `/board/:boardId` | `BoardDetail` — 게시글 상세, 댓글 | 공개 |
| `/board/:boardId/edit` | `BoardEdit` — 게시글 수정 | 인증 필요 |
| `/write` | `Write` — 게시글 작성 | 인증 필요 |
| `/mypage/profile` | `Profile` — 내 정보 조회 | 인증 필요 |
| `/mypage/profile/edit` | `ProfileEdit` — 내 정보 수정 | 인증 필요 |
| `/mypage/posts` | `Posts` — 내가 쓴 글 | 인증 필요 |
| `/mypage/likes` | `Likes` — 관심 게시글 | 인증 필요 |
| `/mypage/blacklist` | `Blacklist` — 내 제재 이력 | 인증 필요 |
| `/admin/dashboard` | `AdminDashboard` — 관리자 대시보드 | 인증 필요* |
| `/admin/manage` | `AdminManage` — 회원/게시글 관리 | 인증 필요* |
| `/admin/blacklist` | `AdminBlacklist` — 블랙리스트 관리 | 인증 필요* |

\* `/admin`은 `ProtectedRouter`가 클라이언트 측 `isAuthenticated` 여부만 확인하며, 실제 관리자 권한(ROLE_ADMIN) 검증은 백엔드 API 호출 시점에 이루어집니다.

## 빌드 / 배포

```bash
npm run build    # tsc -b 타입체크 + vite build
npm run preview  # 빌드 결과 로컬 미리보기
```

- 배포는 GitHub Actions(`.github/workflows/depoly.yml`)를 통해 **Vercel**로 이루어집니다.
  - `main` 브랜치로의 PR → `vercel build`/`vercel deploy`로 프리뷰 배포
  - `main` 브랜치로의 push → `vercel build --prod`/`vercel deploy --prod`로 프로덕션 배포
  - 환경 변수는 저장소 시크릿(`VERCEL_TOKEN`/`VERCEL_ORG_ID`/`VERCEL_PROJECT_ID`)으로 `vercel pull`을 통해 Vercel 프로젝트 설정에서 가져옵니다.
