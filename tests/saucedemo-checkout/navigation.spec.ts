import { test, expect } from '@playwright/test';

// TC-012, TC-013, TC-014, TC-019, TC-021 — navigation and flow control

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/inventory.html');
});

test('TC-012 - P1 - Cancel on checkout step 1 returns to cart', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');
  await page.getByTestId('checkout').click();
  await page.waitForURL('**/checkout-step-one.html');

  await page.getByTestId('firstName').fill('John');
  await page.getByTestId('cancel').click();

  await page.waitForURL('**/cart.html');
  await expect(page.getByTestId('cart-list')).toBeVisible();
  await expect(page.getByTestId('inventory-item-name').first()).toBeVisible();
});

test('TC-013 - P1 - Cancel on checkout step 2 goes to inventory not cart (defect FI-002)', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');
  await page.getByTestId('checkout').click();
  await page.waitForURL('**/checkout-step-one.html');
  await page.getByTestId('firstName').fill('John');
  await page.getByTestId('lastName').fill('Doe');
  await page.getByTestId('postalCode').fill('12345');
  await page.getByTestId('continue').click();
  await page.waitForURL('**/checkout-step-two.html');

  await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');
  await page.getByTestId('cancel').click();

  // FI-002: Cancel on overview goes to /inventory.html instead of /cart.html.
  await expect(page).toHaveURL(/.*inventory\.html/);
});

test('TC-014 - P1 - Logout via burger menu', async ({ page }) => {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await expect(page.getByTestId('logout-sidebar-link')).toBeVisible();
  await page.getByTestId('logout-sidebar-link').click();

  await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);
  await expect(page.getByTestId('login-button')).toBeVisible();

  await page.goto('/inventory.html');
  await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);
});

test('TC-019 - P2 - Cart persists after navigating away via continue shopping', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');
  await page.getByTestId('continue-shopping').click();
  await page.waitForURL('**/inventory.html');

  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');
  await expect(page.getByTestId('inventory-item-name').first()).toBeVisible();
});

test('TC-021 - P2 - Burger menu opens and closes correctly', async ({ page }) => {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await expect(page.getByTestId('logout-sidebar-link')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByTestId('logout-sidebar-link')).not.toBeVisible();
  await expect(page.getByTestId('inventory-container')).toBeVisible();
});
