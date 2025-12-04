# Copilot / AI agent instructions — FPX CNS App

This file contains focused, actionable guidance for an AI coding agent working in this repository.
Keep entries short, cite concrete files, and prefer non-invasive changes when unsure.

1) Quick orientation
- Project: Vite + React + TypeScript single-page app.
- Dev server: Vite runs on port 8080 (see `vite.config.ts`). Entry point: `src/main.tsx` -> `src/App.tsx`.
- Route surface: `src/pages/*` map to routes wired in `src/App.tsx`.

2) Build / run / test commands
- Install dependencies: `npm install` (project uses npm). See `package.json`.
- Start dev server (hot reload): `npm run dev` (Vite). App served at http://localhost:8080.
- Build production bundle: `npm run build` (uses `vite build`).
- Preview production build: `npm run preview`.
- Lint: `npm run lint` (runs eslint).
- E2E tests: uses Cypress. Typical workflow:
  - Start dev server: `npm run dev` (app must be reachable at http://localhost:8080).
  - Run Cypress: `npx cypress open` or `npx cypress run`. Configuration: `cypress.config.ts` (baseUrl `http://localhost:8080`, mochawesome reporter configured). Environment overrides: `cypress.env.json`.

3) Architecture & important patterns
- Top-level alias: `@` → `src` (see `vite.config.ts`). Prefer absolute imports like `@/hooks/useAuth`.
- State & data: React Query (`@tanstack/react-query`) used app-wide; QueryClient is created in `src/App.tsx`.
- Auth & access control: `hooks/useAuth` and `contexts/FamilyContext.tsx` provide user and session context. Protected routes are implemented in `src/App.tsx` via `ProtectedRoute` and `FeatureFlaggedRoute` wrappers — replicate that pattern for new guarded pages.
- Feature flags: `hooks/useFeatureFlags.tsx`. Lazy-loading + flag gating used for large modules (see B2B routes and admin pages in `src/App.tsx`). Follow existing pattern: load feature flags before rendering protected content to avoid flicker.
- Integrations: Supabase client is used (`@supabase/supabase-js`) — check `integrations/supabase/` and `supabase/` for infra. Environment secrets are not in repo; tests load credentials from `cypress.env.json`.
- PWA: `vite-plugin-pwa` is configured in `vite.config.ts` (caching limits and manifest). Be careful when changing asset names or file sizes (>10MB will be excluded).
- Dev-time tagging: `lovable-tagger` is applied only in development mode — avoid removing it unless updating dev tooling.

4) Conventions & code organization to preserve
- Pages live in `src/pages` and are imported directly in `src/App.tsx` (do not rename without updating imports).
- UI components: `src/components/*` and `src/components/ui/*` provide shared primitives (Toaster, Tooltip, etc.). Reuse these instead of adding duplicates.
- Hooks and contexts: Use `hooks/` and `contexts/` for cross-cutting logic. Typical export style: default or named hooks (see `useAuth.ts`, `useFeatureFlags.tsx`).
- CSS: Tailwind is used; global styles in `src/index.css` and `src/App.css`.

5) Tests & CI notes
- E2E lives in `cypress/e2e/*`. Cypress config sets timeouts and reporter options. Performance metrics are logged by a custom `task` in `cypress.config.ts` (writes to `cypress/reports/performance/metrics.jsonl`).
- When adding tests, ensure the dev server runs on port 8080 or update `cypress.config.ts` accordingly.

6) Safety and non-invasive edits
- Prefer small, focused changes with unit/e2e checks. If a change touches routing, update `src/App.tsx` and search for direct imports of the affected module.
- When updating environment keys, document new keys in `cypress.env.json` and `supabase/config.toml` where applicable.

7) Quick examples (copyable patterns)
- Protected page route (use same wrappers as elsewhere):
  - See `src/App.tsx` — wrap with `<ProtectedRoute>` and optionally `<FeatureFlaggedRoute flag="your_flag">`.
- Start dev + run Cypress:
```
npm install
npm run dev
npx cypress open
```

8) Where to look for clarifications
- App wiring & routes: `src/App.tsx` (largest single-file control of routing & guards).
- Dev server & aliases: `vite.config.ts`.
- E2E config and custom tasks: `cypress.config.ts` and `cypress/support/e2e.ts`.
- Integrations and infra: `integrations/supabase/` and `supabase/`.

If any of the referenced files are out-of-date or you want more detail on a specific area (auth flow, supabase setup, or feature flagging), tell me which area to expand and I'll update this file.
