# PowerShell apply script for patches/batch-c/typing-core/sub-batch-1
# Usage: run from repository root in PowerShell (Windows PowerShell v5.1)

$packageRoot = Join-Path $PSScriptRoot 'files'
$backupRootParent = Join-Path $PSScriptRoot 'backups'

# Create timestamped backup folder
$ts = (Get-Date).ToString('yyyyMMdd_HHmmss')
$backupRoot = Join-Path $backupRootParent $ts
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

$filesToCopy = @(
    'src/scorm/ingest/manifest-parser.ts',
    'src/utils/logger.ts',
    'src/hooks/useLearningAnalytics.ts'
)

Write-Host "Backing up originals to: $backupRoot"

foreach ($rel in $filesToCopy) {
    $src = Join-Path $packageRoot $rel
    $dst = Join-Path $PSScriptRoot "..\$rel"
    $dstFull = (Resolve-Path -Path $dst -ErrorAction SilentlyContinue)

    # Ensure destination directory exists
    $dstDir = Split-Path $dst -Parent
    if (-not (Test-Path $dstDir)) { New-Item -ItemType Directory -Force -Path $dstDir | Out-Null }

    if (Test-Path $dst) {
        # Backup existing file
        $backupDst = Join-Path $backupRoot $rel
        $backupDstDir = Split-Path $backupDst -Parent
        if (-not (Test-Path $backupDstDir)) { New-Item -ItemType Directory -Force -Path $backupDstDir | Out-Null }
        Copy-Item -Path $dst -Destination $backupDst -Force
        Write-Host "Backed up: $rel"
    } else {
        Write-Host "Original missing (will create): $rel"
    }

    # Copy new file into repo
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst -Force
        Write-Host "Patched: $rel"
    } else {
        Write-Host "Package file not found: $src"
    }
}

Write-Host "Patch application complete. Backups stored in: $backupRoot"
Write-Host "Run 'npx tsc --noEmit' and 'npx eslint . --max-warnings=0' locally to validate."
