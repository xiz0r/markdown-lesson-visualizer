# Repository Guidelines

## Project Structure & Module Organization
- Next.js App Router layout lives in `app/` (`layout.tsx`, `globals.css`, landing `page.tsx`, and the markdown loader `app/[...slug]/page.tsx`).
- API routes in `app/api/asset/route.ts` and `app/api/video/route.ts` stream files from the content root with path-safety checks.
- Shared UI sits in `components/` (Sidebar, FeatureCard, ContentWrapper), and content tree logic is in `lib/content.ts`, which reads from `CONTENT_ROOT` (defaults to `../content`). Static assets belong in `public/`.

## Build, Test, and Development Commands
- `npm run dev` — start the dev server; set `CONTENT_ROOT=/abs/path npm run dev` to point at custom lesson content.
- `npm run build` — create the production build; catches type and route errors.
- `npm start` — serve the built app locally.
- `npm run lint` — run ESLint (Next core web vitals + TypeScript); resolve warnings before commits.

## Coding Style & Naming Conventions
- TypeScript with strict settings; default to server components, adding `'use client'` only when hooks or browser APIs are required.
- Indent with 2 spaces; use PascalCase filenames for components (`ContentWrapper.tsx`) and camelCase for helpers (`getDirectoryTree`).
- Prefer the `@/...` path alias defined in `tsconfig.json`; order imports as React/Next, third-party, then internal.
- Styling mixes Tailwind utility classes with CSS variables in `app/globals.css`; keep the cyber theme tokens consistent.

## Testing Guidelines
- No automated tests yet; at minimum run `npm run lint` and smoke-test via `npm run dev` with sample content to confirm navigation, asset loads, and video playback.
- When adding tests, colocate them under `__tests__/` or `tests/` and add an npm script to execute them.
- Favor integration checks around `app/[...slug]/page.tsx` and API routes to ensure content-path guards and rendering stay intact.

## Commit & Pull Request Guidelines
- Follow the Conventional Commit style used in history (`feat:`, `refactor:`, `chore:`); write short, present-tense summaries.
- PRs should explain the change, mention any config/env updates (e.g., `CONTENT_ROOT` expectations), and include before/after UI screenshots when UI shifts.
- Ensure `npm run lint` (and `npm run build` for larger changes) passes before requesting review; link related issues or content samples used for validation.

## Security & Configuration Tips
- Keep `CONTENT_ROOT` pointed at trusted paths; the asset/video routes rely on path checks to block traversal—do not remove those guards.
- Avoid committing real lesson content; treat `content/` as user-supplied data outside the repository.
