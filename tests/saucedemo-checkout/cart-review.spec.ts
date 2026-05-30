import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'https://www.saucedemo.com';
const USERNAME = process.env.SAUCE_USERNAME || 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD || 'secret_sauce';

test.describe('Cart Review', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.getByTestId('username').fill(USERNAME);
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-002 - P0 - Add single item to cart from inventory page', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('add-to-cart-sauce-labs-backpack')).not.toBeVisible();
    await expect(page.getByTestId('remove-sauce-labs-backpack')).toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('TC-003 - P0 - Add multiple items to cart', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();
  });

  test('TC-004 - P0 - Navigate to cart via cart icon', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByTestId('title')).toHaveText('Your Cart');
    await expect(page.getByTestId('cart-list')).toBeVisible();
    await expect(page.getByTestId('checkout')).toBeVisible();
    await expect(page.getByTestId('continue-shopping')).toBeVisible();
  });

  test('TC-015 - P1 - Remove item from cart', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart\.html/);
    await page.getByTestId('remove-sauce-labs-backpack').click();
    await expect(page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Backpack' })).not.toBeVisible();
    await expect(page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });
});
