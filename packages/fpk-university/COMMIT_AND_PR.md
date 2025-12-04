COMMIT AND PR INSTRUCTIONS

This file contains exact commands and a ready-to-paste PR title/body for applying the prepared typing patches and creating a commit/PR on a machine that has Git.

1) After running `apply-patches-manual.ps1` (or manually copying the files), run these commands from the repo root on a machine with Git:

```bash
# ensure you're on main and up-to-date
git checkout main
git pull origin main

# create feature branch
git checkout -b typing-fixes/batch-c-sub-batch-1

# stage only src changes (skip patches and reports folders)
git add src

# optional: confirm staged files
git status --porcelain

# commit with suggested message
git commit -m "chore(typing): conservative typing for manifest-parser, logger, useLearningAnalytics (batch-c/sub-batch-1)"

# push and create upstream branch
git push -u origin HEAD
```

2) PR title (paste into your PR):

Typing: conservative typing for manifest-parser, logger, useLearningAnalytics (batch-c/sub-batch-1)

3) PR body (copy/paste):

This PR applies conservative, non-behavioral TypeScript typings to three files as part of the typing cleanup pipeline.

Files changed (in patch bundle):
- src/scorm/ingest/manifest-parser.ts
- src/utils/logger.ts
- src/hooks/useLearningAnalytics.ts

What I changed
- Replaced top-level `any` with `unknown` or small domain types where safe.
- Added narrow, local casts only at external boundary points to preserve runtime behavior.
- No runtime logic changes.

Sanity checks to run locally after applying the patch:
- npx tsc --noEmit
- npx eslint --format json -o reports/eslint-after-batch1.json || true
- npx eslint --max-warnings=0 || true
- npm run build (or pnpm run build)

If you want me to prepare additional sub-batch artifacts or open a PR body with reviewers/labels, tell me and I'll add them.
