#!/usr/bin/env bash
set -euo pipefail

# POSIX apply script for Sub-batch 1 (Batch C — typing-core)
# Creates backups, then copies patched files into the repository.

REPO_ROOT="$(cd "$(dirname "$0")/../../../../.." && pwd)"
PATCH_DIR="$REPO_ROOT/patches/batch-c/typing-core/sub-batch-1"
BACKUP_DIR="$REPO_ROOT/patches/batch-c/typing-core/sub-batch-1/backups/$(date +%Y%m%d%H%M%S)"

echo "Repository root: $REPO_ROOT"
mkdir -p "$BACKUP_DIR"

# Files to apply (relative to patch files/)
FILES=(
  "files/src/scorm/ingest/manifest-parser.ts"
  "files/src/utils/logger.ts"
  "files/src/hooks/useLearningAnalytics.ts"
)

for f in "${FILES[@]}"; do
  TARGET="$REPO_ROOT/${f#files/}"
  SOURCE="$PATCH_DIR/$f"

  if [ ! -f "$SOURCE" ]; then
    echo "Source patch missing: $SOURCE"
    exit 1
  fi

  if [ -f "$TARGET" ]; then
    TARGET_DIR=$(dirname "$TARGET")
    mkdir -p "$BACKUP_DIR/$TARGET_DIR"
    echo "Backing up $TARGET -> $BACKUP_DIR/$TARGET_DIR/"
    cp -p "$TARGET" "$BACKUP_DIR/$TARGET_DIR/"
  else
    echo "Target does not exist (will create): $TARGET"
    mkdir -p "$(dirname "$TARGET")"
  fi

  echo "Applying patch: $SOURCE -> $TARGET"
  cp "$SOURCE" "$TARGET"
done

cat <<EOF
Patches applied. Backups are in:
  $BACKUP_DIR

Next steps (recommended):
  1) From repo root, run: pnpm install (if needed) ; pnpm -w -r run -s typecheck
  2) Run lint and export reports locally: pnpm run lint -- --format json -o reports/eslint-after-batch1.json
  3) Run build: pnpm run build
EOF
