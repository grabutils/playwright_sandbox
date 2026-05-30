import { test, expect } from '@playwright/test';

// TC-001, TC-007, TC-008 — login and authentication flows

test('TC-001 - P0 - Successful login with valid credentials', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('username')).toBeVisible();
  await expect(page.getByTestId('password')).toBeVisible();
  await expect(page.getByTestId('login-button')).toBeVisible();

  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();

  await page.waitForURL('**/inventory.html');
  await expect(page.getByTestId('inventory-container')).toBeVisible();
  await expect(page.getByTestId('title')).toHaveText('Products');
});

test('TC-007 - P1 - Login fails with invalid credentials', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill('wrong_user');
  await page.getByTestId('password').fill('wrong_pass');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('error')).toBeVisible();
  await expect(page.getByTestId('error')).toContainText('Username and password do not match');
  await expect(page.getByTestId('inventory-container')).not.toBeVisible();
  await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);
});

test('TC-008 - P1 - Empty cart checkout navigates to step 1 (defect FI-001)', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/inventory.html');

  await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');

  // FI-001: Empty cart checkout is not blocked — app navigates to step 1 instead of showing error.
  await page.getByTestId('checkout').click();
  await expect(page).toHaveURL(/.*checkout-step-one\.html/);
});
