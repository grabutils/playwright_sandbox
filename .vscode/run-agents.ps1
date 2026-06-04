$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

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

$WORKSPACE     = "C:\Users\hemaa\Documents\AgenticAI_QA_Workflow_Example"
$PROMPT_FILE   = Join-Path $WORKSPACE "prompt.md"
$WORKFLOW_FILE = Join-Path $WORKSPACE "workflow.md"
$INPUT_FILE    = Join-Path $WORKSPACE "claude-input.md"

if (-not (Test-Path $PROMPT_FILE)) {
    Write-Error "ERROR: prompt.md not found at $PROMPT_FILE"
    exit 1
}
if (-not (Test-Path $WORKFLOW_FILE)) {
    Write-Error "ERROR: workflow.md not found at $WORKFLOW_FILE"
    exit 1
}

$workflow = Get-Content $WORKFLOW_FILE -Raw -Encoding UTF8
$prompt   = Get-Content $PROMPT_FILE  -Raw -Encoding UTF8

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

$combined = $workflow + "`r`n`r`n---`r`n`r`n" + $prompt
Set-Content -Path $INPUT_FILE -Value $combined -Encoding UTF8

Write-Host "Input file : $INPUT_FILE"
Write-Host "File size  : $((Get-Item $INPUT_FILE).Length) bytes"
Write-Host ""
Write-Host "Running claude..."
Write-Host ""

$inputText = Get-Content $INPUT_FILE -Raw
claude --print --verbose $inputText

Write-Host ""
Write-Host "Claude exit code: $LASTEXITCODE"