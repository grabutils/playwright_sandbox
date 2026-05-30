import { test, expect } from '@playwright/test';

// TC-003, TC-004 — full end-to-end happy-path checkout flows

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/inventory.html');
});

test('TC-003 - P0 - Full happy-path checkout with a single item', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');
  await expect(page.getByTestId('cart-list')).toBeVisible();

  await page.getByTestId('checkout').click();
  await page.waitForURL('**/checkout-step-one.html');
  await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');

  await page.getByTestId('firstName').fill('John');
  await page.getByTestId('lastName').fill('Doe');
  await page.getByTestId('postalCode').fill('12345');
  await page.getByTestId('continue').click();

  await page.waitForURL('**/checkout-step-two.html');
  await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');
  await expect(page.getByTestId('subtotal-label')).toBeVisible();
  await expect(page.getByTestId('tax-label')).toBeVisible();
  await expect(page.getByTestId('total-label')).toBeVisible();

  await page.getByTestId('finish').click();
  await page.waitForURL('**/checkout-complete.html');
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  await expect(page.getByTestId('complete-text')).toBeVisible();
  await expect(page.getByTestId('back-to-products')).toBeVisible();
  await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
});

test('TC-004 - P0 - Full happy-path checkout with multiple items', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');
  await expect(page.getByTestId('inventory-item-name')).toHaveCount(2);

  await page.getByTestId('checkout').click();
  await page.waitForURL('**/checkout-step-one.html');

  await page.getByTestId('firstName').fill('Jane');
  await page.getByTestId('lastName').fill('Smith');
  await page.getByTestId('postalCode').fill('90210');
  await page.getByTestId('continue').click();

  await page.waitForURL('**/checkout-step-two.html');
  await expect(page.getByTestId('inventory-item-name')).toHaveCount(2);

  await page.getByTestId('finish').click();
  await page.waitForURL('**/checkout-complete.html');
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
});
