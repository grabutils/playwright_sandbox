# Generate Playwright Scripts from Manual Test Cases

You are a QA Automation Engineer.

Read all manual test cases from `testcases.md`.

## Objective

Convert the manual test cases into Playwright TypeScript test scripts.

## Instructions

1. Read all test cases from `testcases.md`.
2. Use Playwright MCP to inspect the application.
3. Understand the workflow and identify the required UI elements.
4. Generate Playwright tests that automate each manual test case.
5. Use Playwright's recommended locators:
   - getByRole()
   - getByLabel()
   - getByText()
   - data-testid selectors if available

6. Avoid hardcoded waits.
7. Use assertions for every expected result mentioned in the test case.
8. Keep the implementation simple and suitable for a POC.

## Output Requirements

Generate:

### Test File

Create a single Playwright test file:

```text
tests/generated.spec.ts
```

### Test Naming

```typescript
test("TC-003 - Complete checkout with single item", async ({ page }) => {
  ...
});

test("TC-004 - Complete checkout with multiple items", async ({ page }) => {
  ...
});
```

### Assertions

Convert every expected result into a Playwright assertion.

Examples:

```typescript
await expect(page.getByText("Thank you for your order!")).toBeVisible();

await expect(page.locator(".shopping_cart_badge")).toHaveText("2");

await expect(subtotalLocator).toBeVisible();
```

## Login Handling

If login is required:

1. Identify the login page using Playwright MCP.
2. Generate the login steps directly inside the test.
3. Use placeholder credentials if values are not available.

Example:

```typescript
await page.fill('[data-test="username"]', "standard_user");
await page.fill('[data-test="password"]', "secret_sauce");
await page.click('[data-test="login-button"]');
```

## Expected Result

Return only:

1. Any assumptions made.
2. The complete Playwright test file.
3. Notes about selectors that may need adjustment.

Generate the Playwright code now.
