# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with `--host` (accessible on LAN). Vite proxies `/api` requests to `https://api.startstudy.store` (see `vite.config.ts`), but runtime API calls actually go through `axios` using `VITE_BASE_URL` as `baseURL` (see Architecture below), so the proxy is mostly relevant for requests made with relative `/api` paths outside the axios client.
- `npm run build` — type-checks via `tsc -b` (project references: `tsconfig.app.json` for `src`, `tsconfig.node.json` for Vite config) then runs `vite build`.
- `npm run lint` — runs `eslint .` (flat config in `eslint.config.js`, TypeScript + `react-hooks` + `react-refresh` rules, Prettier conflicts disabled via `eslint-config-prettier`). To lint a single file, run `npx eslint <path>` directly.
- `npm run preview` — serves the production build locally.
- No test runner is configured in this repo (no test script, no Jest/Vitest dependency).

Path alias `@/*` maps to `./src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).

## Architecture

### Routing (`react-router-dom`)
All routes are defined in one place: `src/App.tsx`, using `createBrowserRouter`. A `RootLayout` (Header + `Toaster` + `ScrollRestoration`) wraps everything, with `CustomError` as the router `errorElement`. Auth-gated routes (`/write`, `/board/:boardId/edit`, everything under `/mypage`, everything under `/admin`) are nested under a shared `<ProtectedRouter />` layout route (`src/lib/react-router/ProtectedRouter.tsx`), which reads `isAuthenticated` from the Zustand auth store and either renders `<Outlet />` or redirects to `/` (also fires a toast). Note: `ProtectedRouter` only checks client-side `isAuthenticated` state — it does not itself enforce role-based access for `/admin` (any authenticated user can navigate there; admin-only enforcement, if any, happens server-side or in page components).

`/mypage` and `/admin` are each their own layout route (`DashboardLayout`, `AdminDashboardLayout`) with nested child routes (profile/posts/likes/blacklist, dashboard/manage/blacklist respectively).

### Data fetching (`axios` + `@tanstack/react-query`)
All backend calls live in `src/lib/axios/api.ts` as plain async functions (not a class/instance) organized by domain with Korean-comment section dividers (인증/게시글/마이페이지/댓글/관심글/관리자/블랙리스트). Two config builders wrap requests instead of a shared axios instance:
- `publicConfig(config)` — sets `baseURL` (`VITE_BASE_URL`) and JSON content-type only, no auth headers. Used for sign-up/sign-in and the public post list.
- `userConfig(config)` — same, plus `Access_Token`/`Refresh_Token` headers read from localStorage (via `getAccessToken`/`getRefreshToken` in `src/lib/utils.ts`) and `withCredentials: true`. Used for everything requiring auth.

Every call does `axios(config)` using the global `axios` default instance (not `axios.create()`), so a single response interceptor registered at module load in `api.ts` applies globally: on a `401`, it calls `renewToken()` (`POST /api/renew-token`), stores the new access token, and retries the original request; if renewal fails it clears both token cookies, clears the Zustand auth store, and hard-redirects to `/`.

React Query hooks live in `src/lib/react-query/queries.ts`, one `useX` wrapper per API function, using string enum query keys from `src/lib/react-query/queryKeys.ts` (`QUERY_KEYS`). Notable convention: essentially all `useQuery` hooks are declared with `enabled: false` and are meant to be triggered manually via `refetch()` in an effect or handler (see `Home.tsx`'s `useEffect(() => { refetch() }, [refetch, searchParams])` and `Header.tsx`/`SigninForm.tsx` calling `fetchUserInfo()` on demand) — this is the standard data-fetching pattern here, not the default "fetch on mount" React Query behavior.

`QueryProvider` (`src/lib/react-query/QueryProvider.tsx`) sets `retry: false` and a global `throwOnError` for both queries and mutations that surfaces `error.response.data.message` from Axios errors via the shadcn `toast()` hook (`src/hooks/use-toast.ts`) instead of letting errors propagate to a boundary.

### Auth token handling (notable/non-standard)
Tokens are stored in `localStorage` (`accessToken`/`refreshToken`, prefixed with `"Bearer "`), set/read/cleared via helpers in `src/lib/utils.ts`. Separately, OAuth logins (Kakao/Naver — see the `<a href={\`${BASE_URL}/oauth2/authorization/kakao\`}>` links in `SigninForm.tsx`) redirect back with tokens placed in `Access_Token`/`Refresh_Token` **cookies** (via `js-cookie`); `Header.tsx`'s `handleLoginCheck()` (run on mount) reads those cookies, copies them into localStorage with a `"Bearer "` prefix, fetches user info, and updates the auth store. So there are two token-persistence mechanisms in play (cookies for OAuth handoff, localStorage for actual API auth) — expect to touch both if changing auth behavior.

### State management (`zustand`)
`src/lib/zustand/store.ts` exports two stores:
- `useAuthStore` — persisted (`zustand/middleware persist`, key `user-storage`) store holding `isAuthenticated` and `userinfo` (`UserInfoDto`), with `setIsAuthenticated`, `setUserInfo`, and `clearAuthStore` (which also clears the localStorage tokens). This is the source of truth consulted by `ProtectedRouter` and most auth-aware components.
- `useTriggerStore` — a bare boolean `trigger` flip via `setTrigger()`, used as a manual re-render/refetch signal where needed (not persisted).

### Forms (`react-hook-form` + `zod`)
Validation schemas live in `src/lib/validation.ts` (`SignupValidation`, `SigninValidation`, `ProfileValidation`, all Korean-language error messages). Form components (e.g. `src/components/form/SigninForm.tsx`, `SignupForm.tsx`) use `useForm` with `zodResolver(...)` and the shadcn `Form`/`FormField`/`FormItem`/`FormControl`/`FormLabel`/`FormMessage` primitives from `src/components/ui/form.tsx`. Request DTOs in `src/types/Dto.ts` generally mirror the corresponding zod schema shape.

### Pages / features
Routed pages live in `src/pages`, grouped by feature area:
- `Home.tsx` — main board list (search, category/order/connection-type filters via URL search params, pagination).
- `Write.tsx`, `pages/board/BoardDetail.tsx`, `pages/board/edit/BoardEdit.tsx` — post creation, viewing, and editing (rich text via `react-quill`, wrapped in `components/HtmlEditor.tsx`).
- `pages/mypage/*` (`DashboardLayout`, `Profile`, `profile/ProfileEdit`, `Posts`, `Likes`, `Blacklist`) — authenticated user's own dashboard, tab list driven by `MyPageList` in `src/constants/index.ts`.
- `pages/admin/*` (`AdminDashboardLayout`, `AdminDashboard`, `AdminManage`, `AdminBlacklist`) — admin dashboard for user management and blacklist moderation, tabs driven by `AdminPageList`.
- `CustomError.tsx` — router `errorElement`.

`src/constants/index.ts` centralizes the option lists used across these pages (categories, sort order, connection type, blacklist status/action/duration, recruit status) as `{id, title, value}` arrays — UI selects map over these rather than hardcoding options inline.

`src/components/ui/*` are shadcn/ui primitives (added per `components.json`: style `default`, base color `neutral`, CSS variables in `src/index.css`, no `rsc`) — treat these as generated/library code and extend via composition rather than heavy editing. `src/components/*` (non-`ui`) are app-specific shared components (`Header`, `Modal`, `Pagination`, `BoardListItem`, `Comment`/`CommentForm`, `KakaoMap` (uses `VITE_KAKAO_KEY`), etc.), re-exported through `src/components/index.ts` and `src/components/form/index.ts` barrel files.

### Deployment
`.github/workflows/depoly.yml` builds on push to `main` and syncs `dist/` to an S3 bucket + invalidates a CloudFront distribution; the `.env` file is reconstituted at build time from a base64-encoded `ENV` secret. `Dockerfile`/`docker-compose.yaml` run the app via `npm run dev` inside a `node:20-bookworm-slim` container on port 5173 (dev-mode container, not a production build).
