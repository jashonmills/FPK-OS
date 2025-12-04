#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/../../../../.." && pwd)"
PATCH_DIR="$REPO_ROOT/patches/batch-c/typing-core/sub-batch-2"
BACKUP_DIR="$PATCH_DIR/backups/$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"

FILES=(
  "files/src/services/DocumentIngestionService.ts"
  "files/src/services/performance/PrefetchManager.ts"
  "files/src/hooks/useOrganizationActions.ts"
)

for f in "${FILES[@]}"; do
  SRC="$PATCH_DIR/$f"
  DST="$REPO_ROOT/${f#files/}"
  DST_DIR=$(dirname "$DST")
  mkdir -p "$DST_DIR"

  if [ -f "$DST" ]; then
    mkdir -p "$BACKUP_DIR/$(dirname "$f")"
    cp -p "$DST" "$BACKUP_DIR/$(dirname "$f")/"
    echo "Backed up: $DST"
  else
    echo "Original missing (will create): $DST"
  fi

  if [ -f "$SRC" ]; then
    cp "$SRC" "$DST"
    echo "Patched: $DST"
  else
    echo "Package file not found: $SRC"
  fi

done

cat <<EOF
Patches applied. Backups are in:
  $BACKUP_DIR

Next steps (recommended):
  1) pnpm -w -r run -s typecheck
  2) pnpm run lint -- --format json -o reports/eslint-after-batch2.json
  3) pnpm run lint:ci || true
  4) pnpm run build
EOF
