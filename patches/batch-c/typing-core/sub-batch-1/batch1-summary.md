Sub-batch 1 — typing-core (Batch C)

Overview:
- Scope: conservative typing changes only (no runtime logic changes) applied to the following files:
  - src/scorm/ingest/manifest-parser.ts
  - src/utils/logger.ts
  - src/hooks/useLearningAnalytics.ts

Sanity checks performed (in this environment):
- Type-check: ran (no blocking type errors for edited files in session).
- Lint export: reports/eslint-after-batch1.json (UTF-16 original) and reports/eslint-after-batch1-utf8.json and pretty JSON available.
- ESLint delta (computed): reports/eslint-deltas.json (rule: @typescript-eslint/no-explicit-any)

ESLint delta summary (from reports/eslint-deltas.json):

- Rule: @typescript-eslint/no-explicit-any
- Total occurrences across repo after this sub-batch: 400
- Per-file counts for edited files:
  - src/scorm/ingest/manifest-parser.ts: 0
  - src/utils/logger.ts: 0
  - src/hooks/useLearningAnalytics.ts: 0

Notes:
- "0" per-file counts indicate this run did not detect any remaining explicit-any instances in the edited files (they were reduced during edits). The repo-wide total remains non-zero; further batches will tackle other files.
- All changes were typing-only and used conservative replacements (unknown/EventPayload/Json) and local casts where necessary to interact with Supabase/DB clients. No behavior-changing refactors were performed.

Included artifacts in this patch bundle:
- files/ (the three modified source files, ready to be copied into the repo)
- apply-sub-batch-1.ps1 (PowerShell, backup + copy)
- apply-sub-batch-1.sh (POSIX bash, backup + copy)
- reports/
  - eslint-after-batch1-utf8.json (UTF-8 converted ESLint JSON)
  - eslint-after-batch1-pretty.json (pretty-printed)
  - eslint-deltas.json (machine-readable delta for the targeted rule)
  - eslint-deltas.txt (human readable short summary)
  - manifest-eslint.json (per-file ESLint export for manifest-parser.ts)

How to apply locally:
- From repo root on Windows (PowerShell):
  .\patches\batch-c\typing-core\sub-batch-1\apply-sub-batch-1.ps1

- From POSIX shell (macOS/Linux):
  patches/batch-c/typing-core/sub-batch-1/apply-sub-batch-1.sh

Recommended post-apply checks:
1) pnpm install
2) pnpm -w -r run -s typecheck
3) pnpm run lint -- --format json -o reports/eslint-after-batch1.json
4) pnpm run build

Validation notes:
- Build succeeded in this environment after edits.
- Lint runs produce non-zero exit codes (repo contains many existing violations); the JSON exports were created to allow offline analysis and delta computation.

Change log (per-file):
- src/scorm/ingest/manifest-parser.ts: Introduced typed Manifest* interfaces and replaced top-level anys with unknown/typed aliases. Preserved parsing logic and behavior.
- src/utils/logger.ts: Introduced EventPayload and ILogger types; replaced many any usages with typed payloads.
- src/hooks/useLearningAnalytics.ts: Added AnalyticsEvent/Insight types, tightened generics, and used conservative casts only where necessary for DB inserts.

No behavior changes: All edits are restricted to type annotations, lightweight helper types, and non-invasive local casts. Runtime logic and API contracts remain the same.
