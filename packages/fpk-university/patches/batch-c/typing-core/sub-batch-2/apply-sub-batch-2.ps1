# PowerShell apply script for Sub-batch 2
$REPO_ROOT = Resolve-Path "$PSScriptRoot\..\..\..\.." | Select-Object -ExpandProperty Path
$PATCH_DIR = Join-Path $REPO_ROOT 'patches\batch-c\typing-core\sub-batch-2'
$BACKUP_DIR = Join-Path $PATCH_DIR ('backups\' + (Get-Date).ToString('yyyyMMdd_HHmmss'))
New-Item -ItemType Directory -Force -Path $BACKUP_DIR | Out-Null

$filesToCopy = @(
  'files\src\services\DocumentIngestionService.ts',
  'files\src\services\performance\PrefetchManager.ts',
  'files\src\hooks\useOrganizationActions.ts'
)

Write-Host "Backing up originals to: $BACKUP_DIR"
foreach ($rel in $filesToCopy) {
  $src = Join-Path $PATCH_DIR $rel
  $dst = Join-Path $REPO_ROOT ($rel -replace '^files\\','')

  $dstDir = Split-Path $dst -Parent
  if (-not (Test-Path $dstDir)) { New-Item -ItemType Directory -Force -Path $dstDir | Out-Null }

  if (Test-Path $dst) {
    $backupDst = Join-Path $BACKUP_DIR ($rel -replace '^files\\','')
    $backupDstDir = Split-Path $backupDst -Parent
    if (-not (Test-Path $backupDstDir)) { New-Item -ItemType Directory -Force -Path $backupDstDir | Out-Null }
    Copy-Item -Path $dst -Destination $backupDst -Force
    Write-Host "Backed up: $rel"
  } else {
    Write-Host "Original missing (will create): $rel"
  }

  if (Test-Path $src) {
    Copy-Item -Path $src -Destination $dst -Force
    Write-Host "Patched: $rel"
  } else {
    Write-Host "Package file not found: $src"
  }
}

Write-Host "Patch application complete. Backups stored in: $BACKUP_DIR"
Write-Host "Run: pnpm -w -r run -s typecheck ; pnpm run lint -- --format json -o reports/eslint-after-batch2.json ; pnpm run lint:ci || true ; pnpm run build"
