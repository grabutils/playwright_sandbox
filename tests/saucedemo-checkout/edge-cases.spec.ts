import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'https://www.saucedemo.com';
const USERNAME = process.env.SAUCE_USERNAME || 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD || 'secret_sauce';

test.describe('Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.getByTestId('username').fill(USERNAME);
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-020 - P2 - Cart badge count accuracy with multiple add/remove', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    await page.getByTestId('add-to-cart-sauce-labs-bolt-t-shirt').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('3');

    // Navigate to cart, remove Bike Light
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('remove-sauce-labs-bike-light').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    // Back to inventory, remove Backpack from inventory
    await page.getByTestId('continue-shopping').click();
    await page.getByTestId('remove-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Only Bolt T-Shirt remains
    await page.getByTestId('shopping-cart-link').click();
    await expect(page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Bolt T-Shirt' })).toBeVisible();
    await expect(page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Backpack' })).not.toBeVisible();
    await expect(page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Bike Light' })).not.toBeVisible();
  });
});
