import { test, expect } from '@playwright/test';

const USERNAME = process.env.SAUCE_USERNAME ?? 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill(USERNAME);
  await page.getByTestId('password').fill(PASSWORD);
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory/);
});

test('P2 - TC-017 - checkout button accessible from empty cart (FI-01)', async ({ page }) => {
  await page.getByTestId('shopping-cart-link').click();
  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('[data-test="cart-item"]')).toHaveCount(0);
  await expect(page.getByTestId('checkout')).toBeVisible();

  await page.getByTestId('checkout').click();
  // FI-01: app does not block empty-cart checkout — records actual navigation
  await expect(page).toHaveURL(/checkout-step-one/);
});
