# Playwright Test Generation Prompt

Read the manual test cases from `testcases.md`.

Your task is to generate Playwright TypeScript test scripts by using Playwright MCP to understand the application and identify reliable locators.

## Steps

1. Read and analyze all test cases in `testcases.md`.
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

## Output Format

Return:

1. Assumptions made during automation.
2. Any missing information or ambiguities found in the manual test cases.
3. Complete Playwright TypeScript test code.
4. Any locator recommendations for improving test stability.
5. Confirmation that the pull request was created via GitHub MCP, along with the PR URL.

After execution, test artifacts and results should be generated into folders such as `test-results/`, `playwright-report/`, and `extent-report/`.

Generate executable Playwright code only after inspecting the application with Playwright MCP. If a locator cannot be confidently identified, explain the assumption and provide the best available locator.
