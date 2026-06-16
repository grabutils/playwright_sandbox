$ErrorActionPreference = "Stop"

# UTF-8 support
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# ──────────────────────────────────────────────
#  Configuration  (env vars override defaults)
# ──────────────────────────────────────────────
$STORY_ID          = if ($env:STORY_ID)          { $env:STORY_ID }          else { "US001" }
$STORY_PATH        = if ($env:STORY_PATH)        { $env:STORY_PATH }        else { "user-stories/SCRUM-101-ecommerce-checkout.md" }
$APP_URL           = if ($env:APP_URL)           { $env:APP_URL }           else { "<from story>" }
$PLAN_PATH         = if ($env:PLAN_PATH)         { $env:PLAN_PATH }         else { "specs/checkout-plan.md" }
$TEST_DIR          = if ($env:TEST_DIR)          { $env:TEST_DIR }          else { "tests/" }
$REPORT_PATH       = if ($env:REPORT_PATH)       { $env:REPORT_PATH }       else { "test-results/SCRUM-101-report.md" }
$FEEDBACK_PATH     = if ($env:FEEDBACK_PATH)     { $env:FEEDBACK_PATH }     else { "feedback/SCRUM-101-verified-result.md" }
$EXTENT_REPORT_DIR = if ($env:EXTENT_REPORT_DIR) { $env:EXTENT_REPORT_DIR } else { "extent-report/" }
$EXEC_MODE         = if ($env:EXEC_MODE)         { $env:EXEC_MODE }         else { "local" }
$BROWSER           = if ($env:BROWSER)           { $env:BROWSER }           else { "chromium" }
$MAX_HEAL_ATTEMPTS = if ($env:MAX_HEAL_ATTEMPTS) { $env:MAX_HEAL_ATTEMPTS } else { "2" }

# ──────────────────────────────────────────────
#  Paths
# ──────────────────────────────────────────────
$WORKSPACE     = Resolve-Path "$PSScriptRoot\.."
$PROMPT_FILE   = Join-Path $WORKSPACE "prompt.md"
$WORKFLOW_FILE = Join-Path $WORKSPACE "workflow.md"
$INPUT_FILE    = Join-Path $WORKSPACE "claude-input.md"

Write-Host ""
Write-Host "Workspace      : $WORKSPACE"
Write-Host "Prompt File    : $PROMPT_FILE"
Write-Host "Workflow File  : $WORKFLOW_FILE"
Write-Host ""

# ──────────────────────────────────────────────
#  Validate required files
# ──────────────────────────────────────────────
if (-not (Test-Path $PROMPT_FILE)) {
    Write-Error "ERROR: prompt.md not found at $PROMPT_FILE"
    exit 1
}

if (-not (Test-Path $WORKFLOW_FILE)) {
    Write-Error "ERROR: workflow.md not found at $WORKFLOW_FILE"
    exit 1
}

# ──────────────────────────────────────────────
#  Validate API key
# ──────────────────────────────────────────────
if (-not $env:ANTHROPIC_API_KEY) {
    Write-Error @"
ERROR: ANTHROPIC_API_KEY environment variable is not set.

Set it for this session:
    `$env:ANTHROPIC_API_KEY = "sk-ant-api03-..."

Or permanently (restart terminal after):
    [System.Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-api03-...", "User")

Get your key at: https://console.anthropic.com/settings/keys
"@
    exit 1
}

# ──────────────────────────────────────────────
#  Validate Claude CLI
# ──────────────────────────────────────────────
$claudeCmd = Get-Command claude -ErrorAction SilentlyContinue

if (-not $claudeCmd) {
    Write-Error @"
ERROR: Claude CLI not found in PATH.

Install it with:
    npm install -g @anthropic-ai/claude-code
"@
    exit 1
}

# ──────────────────────────────────────────────
#  Build prompt
# ──────────────────────────────────────────────
$workflow = Get-Content $WORKFLOW_FILE -Raw -Encoding UTF8
$prompt   = Get-Content $PROMPT_FILE   -Raw -Encoding UTF8

$prompt = $prompt `
    -replace '\{STORY_ID\}',          $STORY_ID `
    -replace '\{STORY_PATH\}',        $STORY_PATH `
    -replace '\{APP_URL\}',           $APP_URL `
    -replace '\{PLAN_PATH\}',         $PLAN_PATH `
    -replace '\{TEST_DIR\}',          $TEST_DIR `
    -replace '\{REPORT_PATH\}',       $REPORT_PATH `
    -replace '\{FEEDBACK_PATH\}',     $FEEDBACK_PATH `
    -replace '\{EXTENT_REPORT_DIR\}', $EXTENT_REPORT_DIR `
    -replace '\{EXEC_MODE\}',         $EXEC_MODE `
    -replace '\{BROWSER\}',           $BROWSER `
    -replace '\{MAX_HEAL_ATTEMPTS\}', $MAX_HEAL_ATTEMPTS

$combined = $workflow + "`r`n`r`n---`r`n`r`n" + $prompt

Set-Content -Path $INPUT_FILE -Value $combined -Encoding UTF8

# ──────────────────────────────────────────────
#  Banner
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "======================================================"
Write-Host "      4-Agent QA Mesh -- Starting Run"
Write-Host "======================================================"
Write-Host "  Story ID   : $STORY_ID"
Write-Host "  Story Path : $STORY_PATH"
Write-Host "  Browser    : $BROWSER"
Write-Host "  Exec Mode  : $EXEC_MODE"
Write-Host "  Max Heals  : $MAX_HEAL_ATTEMPTS"
Write-Host "======================================================"
Write-Host ""
Write-Host "Input file        : $INPUT_FILE"
Write-Host "File size         : $((Get-Item $INPUT_FILE).Length) bytes"
Write-Host "Claude executable : $($claudeCmd.Source)"
Write-Host ""

# ──────────────────────────────────────────────
#  Run Claude via System.Diagnostics.Process
#
#  Why not pipeline (|) or redirection (<):
#    - PowerShell pipelines are unreliable for Claude Code stdin
#    - PowerShell does NOT support < stdin redirection at all
#    - System.Diagnostics.Process gives full control over
#      stdin/stdout/stderr and a reliable exit code
# ──────────────────────────────────────────────
$tempInput = Join-Path $env:TEMP "claude-input-$PID.txt"
$exitCode  = 1

try {
    Set-Content -Path $tempInput -Value $combined -Encoding UTF8

    Write-Host "Running Claude..."
    Write-Host ""

    # Resolve the actual claude.exe path (handles shims/wrappers)
    $claudeExe = (Get-Command claude).Source

    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName               = $claudeExe
    $psi.Arguments              = "--print --dangerously-skip-permissions"
    $psi.RedirectStandardInput  = $true
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError  = $true
    $psi.UseShellExecute        = $false
    $psi.StandardInputEncoding  = [System.Text.Encoding]::UTF8
    $psi.StandardOutputEncoding = [System.Text.Encoding]::UTF8
    $psi.StandardErrorEncoding  = [System.Text.Encoding]::UTF8

    # Pass ANTHROPIC_API_KEY explicitly into the child process environment
    $psi.EnvironmentVariables["ANTHROPIC_API_KEY"] = $env:ANTHROPIC_API_KEY

    $process = [System.Diagnostics.Process]::Start($psi)

    # Write prompt to stdin then close so Claude knows input is done
    $inputContent = Get-Content $tempInput -Raw -Encoding UTF8
    $process.StandardInput.Write($inputContent)
    $process.StandardInput.Close()

    # Read stdout and stderr fully
    $stdout = $process.StandardOutput.ReadToEnd()
    $stderr = $process.StandardError.ReadToEnd()

    $process.WaitForExit()
    $exitCode = $process.ExitCode

    Write-Host "================ Claude Output ================"
    if ($stdout) { Write-Host $stdout }
    if ($stderr) {
        Write-Host "--- stderr ---"
        Write-Host $stderr
    }
    Write-Host "==============================================="
    Write-Host ""
}
catch {
    Write-Host "================ Claude Error ================="
    Write-Host $_.Exception.Message
    Write-Host "==============================================="
    Write-Host ""
    $exitCode = 1
}
finally {
    if (Test-Path $tempInput) {
        Remove-Item $tempInput -ErrorAction SilentlyContinue
    }
}

# ──────────────────────────────────────────────
#  Result
# ──────────────────────────────────────────────
Write-Host "Claude exit code: $exitCode"

if ($exitCode -ne 0) {
    Write-Error "Claude execution failed (exit code $exitCode)."
    exit $exitCode
}

Write-Host ""
Write-Host "Run completed successfully."
Write-Host ""