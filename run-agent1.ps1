$ErrorActionPreference = "Stop"

# ---------------------------------------------------------
# Claude Workflow Runner
# ---------------------------------------------------------

$workspace = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $workspace

$logFile = Join-Path $workspace "claude-run.log"
$responseFile = Join-Path $workspace "claude-response.txt"
$errorFile = Join-Path $workspace "claude-error.log"

Write-Host ""
Write-Host "======================================="
Write-Host "      Claude Workflow Runner"
Write-Host "======================================="
Write-Host ""

Start-Transcript -Path $logFile -Force

try {

    # ---------------------------------------------------------
    # Validate files
    # ---------------------------------------------------------

    if (!(Test-Path "workflow.md")) {
        throw "workflow.md not found"
    }

    if (!(Test-Path "prompt.md")) {
        throw "prompt.md not found"
    }

    # ---------------------------------------------------------
    # Validate Claude
    # ---------------------------------------------------------

    $claude = Get-Command claude -ErrorAction SilentlyContinue

    if (-not $claude) {
        throw "Claude CLI not found in PATH"
    }

    Write-Host "Claude Path:"
    Write-Host $claude.Source
    Write-Host ""

    Write-Host "Claude Version:"
    claude --version
    Write-Host ""

    # ---------------------------------------------------------
    # Smoke Test
    # ---------------------------------------------------------

    Write-Host "Running Claude smoke test..."

    $testOutput = & claude -p "What is 2+2?"

    Write-Host "Smoke Test Result:"
    Write-Host $testOutput
    Write-Host ""

    # ---------------------------------------------------------
    # Execute Workflow
    # ---------------------------------------------------------

    $executionPrompt = @"
Read workflow.md and prompt.md from the current workspace.

STRICT RULES:
1. workflow.md is the single source of truth.
2. Follow workflow.md exactly.
3. Use prompt.md as input.
4. Generate Playwright automation test cases.
5. Generate all required supporting artifacts defined in workflow.md.
6. Return the final result.

Important:
- Do not ask questions.
- Execute immediately.
- Strictly follow workflow.md.
"@

    Write-Host "Executing workflow..."
    Write-Host ""

    if (Test-Path $errorFile) {
        Remove-Item $errorFile -Force
    }

    $output = & claude `
        --print `
        --add-dir $workspace `
        $executionPrompt `
        2> $errorFile

    $exitCode = $LASTEXITCODE

    Write-Host "Exit Code: $exitCode"
    Write-Host ""

    if (Test-Path $errorFile) {

        $errorContent = Get-Content $errorFile -Raw

        if ($errorContent.Trim().Length -gt 0) {

            Write-Host "======================================="
            Write-Host "            CLAUDE ERRORS"
            Write-Host "======================================="
            Write-Host ""

            Write-Host $errorContent
            Write-Host ""
        }
    }

    if ($output) {

        $output | Out-File `
            -FilePath $responseFile `
            -Encoding UTF8

        Write-Host "======================================="
        Write-Host "           CLAUDE OUTPUT"
        Write-Host "======================================="
        Write-Host ""

        $output

        Write-Host ""
        Write-Host "Response saved:"
        Write-Host $responseFile
    }
    else {

        Write-Host ""
        Write-Host "No output returned from Claude."
        Write-Host ""
        Write-Host "Manual test:"
        Write-Host ""
        Write-Host "claude --print --add-dir . `"Read workflow.md and prompt.md and execute the workflow.`""
    }

    Write-Host ""
    Write-Host "======================================="
    Write-Host "        WORKFLOW COMPLETED"
    Write-Host "======================================="
}
catch {

    Write-Host ""
    Write-Host "======================================="
    Write-Host "               ERROR"
    Write-Host "======================================="
    Write-Host ""

    Write-Host $_.Exception.Message
}
finally {

    Stop-Transcript

    Write-Host ""
    Write-Host "Log File:"
    Write-Host $logFile

    Write-Host ""
    Write-Host "Response File:"
    Write-Host $responseFile

    Write-Host ""
    Write-Host "Error File:"
    Write-Host $errorFile
}