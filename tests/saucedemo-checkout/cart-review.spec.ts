import { test, expect } from '@playwright/test';

test.describe('Cart Review', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill(process.env.APP_USERNAME ?? 'standard_user');
    await page.getByTestId('password').fill(process.env.APP_PASSWORD ?? 'secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory/);
  });

  test('TC-001 P0 - Display all cart items with correct details', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);

    await expect(page.getByTestId('inventory-item-name')).toHaveCount(2);
    await expect(page.getByTestId('inventory-item-desc').first()).toBeVisible();
    await expect(page.getByTestId('inventory-item-price').first()).toBeVisible();
    await expect(page.getByTestId('item-quantity').first()).toHaveText('1');
  });

  test('TC-002 P0 - Continue Shopping button returns to products', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);

    await page.getByTestId('continue-shopping').click();
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByTestId('title')).toHaveText('Products');
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('TC-003 P0 - Proceed to Checkout from cart', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);

    await expect(page.getByTestId('checkout')).toBeVisible();
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');
  });
});
