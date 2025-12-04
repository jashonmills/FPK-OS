$reportPath = Join-Path -Path $PSScriptRoot -ChildPath "..\reports\eslint-after-batch1-utf8.json"
$outJson = Join-Path -Path $PSScriptRoot -ChildPath "..\reports\eslint-deltas.json"
$outTxt = Join-Path -Path $PSScriptRoot -ChildPath "..\reports\eslint-deltas.txt"

Write-Output "Reading report: $reportPath"
$raw = Get-Content -Path $reportPath -Raw -ErrorAction Stop

try {
    $obj = ConvertFrom-Json $raw
} catch {
    Write-Error "Failed to parse JSON: $_"
    exit 1
}

$rule = '@typescript-eslint/no-explicit-any'
$targets = @(
    'src/scorm/ingest/manifest-parser.ts',
    'src/utils/logger.ts',
    'src/hooks/useLearningAnalytics.ts'
)

$total = 0
$perFile = @{}
foreach ($t in $targets) { $perFile[$t] = 0 }

if ($obj -is [System.Array]) {
    $entries = $obj
} elseif ($obj.value) {
    $entries = $obj.value
} else {
    $entries = @($obj)
}

foreach ($file in $entries) {
    if (-not $file.messages) { continue }
    foreach ($m in $file.messages) {
        if ($m.ruleId -eq $rule) {
            $total++
            foreach ($t in $targets) {
                if ($file.filePath -like "*${t}") { $perFile[$t]++ }
            }
        }
    }
}

$out = @{ rule = $rule; total = $total; perFile = $perFile }
$out | ConvertTo-Json -Depth 4 | Out-File -FilePath $outJson -Encoding utf8 -Force
"Rule: $rule`nTotal: $total`n`nPer-file:`n$($perFile.GetEnumerator() | ForEach-Object { "$( $_.Name ): $( $_.Value )" } -join "`n")" | Out-File -FilePath $outTxt -Encoding utf8 -Force

Write-Output "Wrote $outJson and $outTxt"
