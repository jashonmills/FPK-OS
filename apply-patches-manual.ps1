<#
Safe apply script: copies files from any patches/*/files/** into the repository root preserving the relative path after the "files" folder.
It creates timestamped backups for any file it will overwrite. Review the script before running.
Usage (run from repo root in PowerShell):
  .\apply-patches-manual.ps1
#>

param(
    [string]$PatchesRoot = ".\patches",
    [switch]$WhatIf
)

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
Write-Host "Patches root: $PatchesRoot"

$files = Get-ChildItem -Path $PatchesRoot -Recurse -File | Where-Object { $_.FullName -match "\\files\\" }
if (-not $files) {
    Write-Host "No files found under $PatchesRoot/*/files/"
    return
}

foreach ($f in $files) {
    # Compute the relative path after the first occurrence of \files\
    $parts = $f.FullName -split "\\files\\"
    if ($parts.Count -lt 2) { continue }
    $rel = $parts[1].TrimStart('\')
    $target = Join-Path -Path (Get-Location) -ChildPath $rel

    Write-Host "\nApplying: $rel"
    Write-Host "  source: $($f.FullName)"
    Write-Host "  target: $target"

    if ($WhatIf) { continue }

    # Ensure target folder exists
    $targetDir = Split-Path $target -Parent
    if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }

    # Backup existing file if present
    if (Test-Path $target) {
        $backup = "$target.bak.$timestamp"
        Write-Host "  backing up existing file to: $backup"
        Copy-Item -Path $target -Destination $backup -Force
    }

    # Copy the patched file into place
    Copy-Item -Path $f.FullName -Destination $target -Force
    Write-Host "  copied"
}

Write-Host "\nDone. Review changes (git status) on a machine with Git, then stage/commit as desired."
Write-Host "If you need the exact git commands to run on another machine, open COMMIT_AND_PR.md in the repo root."
