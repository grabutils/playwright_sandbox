// spec: KAN-4 — Sauce Labs Demo App Happy-Path Checkout
// TC-003: Single item happy-path checkout
// TC-004: Multi-item happy-path checkout

import { test, expect, type Page } from '@playwright/test';

// Helper: log in with standard_user and land on the Products page
async function login(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory/);
}

test.describe('Happy-Path Checkout', () => {
  test('TC-003 — Single item happy-path checkout', async ({ page }) => {
    // Step 1: Launch the app and log in
    await login(page);

    // Step 2: Add Sauce Labs Backpack to cart — cart badge shows 1
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Click the cart icon — cart page opens showing Sauce Labs Backpack as only item
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');

    // Step 4: Click Checkout — Your Information page opens
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);

    // Step 5: Enter First Name, Last Name, Postal Code
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');

    // Step 6: Click Continue — Checkout Overview page opens
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);

    // Step 7: Assert subtotal is visible
    await expect(page.getByTestId('subtotal-label')).toBeVisible();

    // Step 8: Assert tax is visible
    await expect(page.getByTestId('tax-label')).toBeVisible();

    // Step 9: Assert order total is visible
    await expect(page.getByTestId('total-label')).toBeVisible();

    // Step 10: Click Finish — Order Confirmation page opens
    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete/);

    // Step 11: Assert heading reads "Thank you for your order!"
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');

    // Step 12: Assert confirmation message text is visible below the heading
    await expect(page.getByTestId('complete-text')).toBeVisible();

    // Step 13: Assert the Back to Products button is visible
    await expect(page.getByTestId('back-to-products')).toBeVisible();

    // Step 14: Assert cart badge is no longer visible (cart cleared)
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });

  test('TC-004 — Multi-item happy-path checkout', async ({ page }) => {
    // Step 1: Launch the app and log in
    await login(page);

    // Step 2: Add Sauce Labs Backpack to cart — cart badge shows 1
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Add Sauce Labs Bike Light to cart — cart badge shows 2
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    // Step 4: Click the cart icon — cart page shows both items
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    const cartItems = page.getByTestId('inventory-item-name');
    await expect(cartItems.filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(cartItems.filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();

    // Step 5: Click Checkout — Your Information page opens
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);

    // Step 6: Enter Jane, Smith, 90210 and click Continue
    await page.getByTestId('firstName').fill('Jane');
    await page.getByTestId('lastName').fill('Smith');
    await page.getByTestId('postalCode').fill('90210');
    await page.getByTestId('continue').click();

    // Step 7: Checkout Overview opens — assert both items are visible
    await expect(page).toHaveURL(/checkout-step-two/);
    const overviewItems = page.getByTestId('inventory-item-name');
    await expect(overviewItems.filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(overviewItems.filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();

    // Step 8: Click Finish — Order Confirmation page opens
    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete/);

    // Step 9: Assert heading reads "Thank you for your order!"
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');

    // Step 10: Assert cart badge is no longer visible
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });
});
