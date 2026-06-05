# Playwright Test Generation Prompt

## Jira Configuration

**Jira Issue ID:** `KAN-4`

Read the manual test cases from the Jira issue above using the **Jira MCP** (`jira_get_issue` tool). Do **not** read from `testcases.md`. Extract all test case IDs, steps, and expected results from the issue description.

After reading, use the **Jira MCP** (`jira_add_comment` tool) to post a comment on the Jira issue confirming the test cases were read and listing each test case ID found.

Your task is to generate Playwright TypeScript test scripts by using Playwright MCP to understand the application and identify reliable locators.

## Steps

1. Fetch and analyze all test cases from the Jira issue specified above using the Jira MCP.
2. Launch the application using Playwright MCP.
3. Explore the application flow required for the test cases.
4. Identify stable locators using:
   - getByRole()
   - getByLabel()
   - getByText()
   - data-testid attributes

5. Generate Playwright tests for each test case.
6. Convert every expected result into a Playwright assertion.
7. Avoid hardcoded waits (`waitForTimeout`).
8. Use Playwright best practices and auto-waiting features.
9. Keep the implementation simple and suitable for a POC.
10. After coding is complete, use the **GitHub MCP** to commit and create a pull request.

## Test Generation Requirements

- Use TypeScript.
- Generate a single spec file.
- Create one Playwright test per test case.
- Include comments mapping automation steps to manual test steps.
- Reuse helper functions only when it reduces duplication.
- If login is required, automate the login flow within the test or create a simple helper function.

## Assertions

Every expected result from the manual test case must be validated using Playwright assertions.

Examples:

```typescript
await expect(cartBadge).toHaveText("2");
await expect(page.getByText("Thank you for your order!")).toBeVisible();
await expect(subtotal).toBeVisible();
```

## Commit & Pull Request

After the test file is generated, follow these steps in order:

### Step 1 — Local Commit (git)

1. **Stage and commit the generated spec file** to the current local branch using a conventional commit message, e.g.:
   `feat: add Playwright automation tests for <feature/module name>`
   - Use `hemaanth01@gmail.com` as the commit author email. Do **not** add a `Co-Authored-By` Anthropic trailer.
   - Set author explicitly: `git commit --author="Hemanth <hemaanth01@gmail.com>" -m "<message>"`
2. Verify the commit was created locally with `git log --oneline -3` before proceeding.

### Step 2 — Push (via GitHub MCP)

1. **Push the committed file** to the remote branch using the GitHub MCP `push_files` tool, using the same commit message as Step 1.

### Step 3 — Pull Request (via GitHub MCP)

1. **Create a pull request** using the GitHub MCP `create_pull_request` tool with:
   - **Title**: `feat: Playwright Test Automation – <feature/module name>`
   - **Base branch**: `main` (or the default branch of the repository)
   - **Head branch**: the current working branch
   - **Body** including:
     - Summary of test cases automated
     - Assumptions made during automation
     - Any ambiguities or missing information found
     - Locator recommendations for improving test stability
2. Assign reviewers if applicable using the GitHub MCP `request_reviewers` tool.

### Step 4 — Wait for CI and Post Results to Jira

> **Important:** The GitHub MCP `get_pull_request_status` tool only reads legacy commit statuses — it does **not** reflect GitHub Actions results. Do **not** rely on it to determine CI outcome. Use the check-runs API described below instead.

1. After the PR is created, extract the **head SHA** from the `create_pull_request` response (`head.sha`).

2. Query the check-runs API using `curl` (the `gh` CLI is not available in this environment):
   ```
   curl -s -H "Accept: application/vnd.github+json" \
     "https://api.github.com/repos/{owner}/{repo}/commits/{sha}/check-runs"
   ```
   Replace `{owner}`, `{repo}`, and `{sha}` with the actual values.

3. Inspect the JSON response:
   - If **any** check run has `"status": "in_progress"` or `"status": "queued"`, CI is still running — call the same `curl` command again (do **not** use `sleep` loops or chained shell commands; issue a new Bash tool call each time).
   - Repeat until **all** check runs show `"status": "completed"`.

4. Once all checks are completed, collect:
   - Overall conclusion: `success`, `failure`, or `cancelled` (from each run's `"conclusion"` field)
   - Individual check names and their conclusions
   - GitHub Actions run URL (from `"html_url"` on each check run)

5. Use the **Jira MCP** (`jira_add_comment`) to post a comment on the Jira issue identified by the **Jira Issue ID** at the top of this file (`KAN-4`) with the following content:
   - CI status: ✅ PASSED or ❌ FAILED
   - List of check names and their individual pass/fail outcome
   - GitHub Actions run URL
   - PR URL

Example Jira comment format:
```
🤖 GitHub Actions CI Results – <PR Title>

Status: ✅ PASSED / ❌ FAILED

Checks:
- Playwright Tests: ✅ success

PR: [<PR Title>](<PR URL>)
Run: [View CI Run](<GitHub Actions run URL>)
```

## Output Format

Return:

1. Assumptions made during automation.
2. Any missing information or ambiguities found in the manual test cases.
3. Complete Playwright TypeScript test code.
4. Any locator recommendations for improving test stability.
5. Confirmation that the pull request was created via GitHub MCP, along with the PR URL.
6. Confirmation that GitHub Actions CI completed, with a summary of pass/fail outcomes.
7. Confirmation that the CI results were posted as a Jira comment on the issue specified by **Jira Issue ID**.

After execution, test artifacts and results should be generated into folders such as `test-results/`, `playwright-report/`, and `extent-report/`.

Generate executable Playwright code only after inspecting the application with Playwright MCP. If a locator cannot be confidently identified, explain the assumption and provide the best available locator.
