import { test, expect } from '@playwright/test';

// TC-009, TC-010, TC-011, TC-017 — checkout info form validation

async function loginAndStartCheckout(page: any) {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/inventory.html');
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');
  await page.getByTestId('checkout').click();
  await page.waitForURL('**/checkout-step-one.html');
}

test('TC-009 - P1 - Missing first name triggers validation error', async ({ page }) => {
  await loginAndStartCheckout(page);
  await page.getByTestId('lastName').fill('Doe');
  await page.getByTestId('postalCode').fill('12345');
  await page.getByTestId('continue').click();

  await expect(page.getByTestId('error')).toBeVisible();
  await expect(page.getByTestId('error')).toContainText('First Name is required');
  await expect(page).toHaveURL(/.*checkout-step-one\.html/);
});

test('TC-010 - P1 - Missing last name triggers validation error', async ({ page }) => {
  await loginAndStartCheckout(page);
  await page.getByTestId('firstName').fill('John');
  await page.getByTestId('postalCode').fill('12345');
  await page.getByTestId('continue').click();

  await expect(page.getByTestId('error')).toBeVisible();
  await expect(page.getByTestId('error')).toContainText('Last Name is required');
  await expect(page).toHaveURL(/.*checkout-step-one\.html/);
});

test('TC-011 - P1 - Missing postal code triggers validation error', async ({ page }) => {
  await loginAndStartCheckout(page);
  await page.getByTestId('firstName').fill('John');
  await page.getByTestId('lastName').fill('Doe');
  await page.getByTestId('continue').click();

  await expect(page.getByTestId('error')).toBeVisible();
  await expect(page.getByTestId('error')).toContainText('Postal Code is required');
  await expect(page).toHaveURL(/.*checkout-step-one\.html/);
});

test('TC-017 - P2 - Whitespace-only first name accepted without validation (defect FI-003)', async ({ page }) => {
  await loginAndStartCheckout(page);
  await page.getByTestId('firstName').fill('   ');
  await page.getByTestId('lastName').fill('Doe');
  await page.getByTestId('postalCode').fill('12345');
  await page.getByTestId('continue').click();

  // FI-003: Whitespace-only first name bypasses validation — app proceeds to overview.
  await expect(page).toHaveURL(/.*checkout-step-two\.html/);
});
