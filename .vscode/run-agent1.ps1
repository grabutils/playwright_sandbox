$ErrorActionPreference = "Continue"

$workspace = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $workspace

$logFile = Join-Path $workspace "claude-run.log"

Write-Host ""
Write-Host "======================================="
Write-Host "      Claude Workflow Runner"
Write-Host "======================================="
Write-Host ""

Start-Transcript -Path $logFile -Force

try {

    if (!(Test-Path "prompt.md")) {
        throw "prompt.md not found."
    }

    if (!(Test-Path "workflow.md")) {
        throw "workflow.md not found."
    }

    Write-Host "Loading prompt.md..."
    $prompt = Get-Content "prompt.md" -Raw

    Write-Host "Loading workflow.md..."
    $workflow = Get-Content "workflow.md" -Raw

    $combinedPrompt = @"
$workflow

======================================================
PROMPT
======================================================

$prompt
"@

    $tempPromptFile = Join-Path $env:TEMP "claude-input.txt"

    Set-Content `
        -Path $tempPromptFile `
        -Value $combinedPrompt `
        -Encoding UTF8

    Write-Host ""
    Write-Host "Starting Claude..."
    Write-Host ""

    Get-Content $tempPromptFile -Raw | claude 2>&1

    Write-Host ""
    Write-Host "Workflow completed."
}
catch {
    Write-Error $_
}
finally {
    Stop-Transcript
    Write-Host ""
    Write-Host "Log file:"
    Write-Host $logFile
}