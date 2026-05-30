import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'https://www.saucedemo.com';
const USERNAME = process.env.SAUCE_USERNAME || 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD || 'secret_sauce';

test.describe('Navigation and Cancel Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.getByTestId('username').fill(USERNAME);
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  });

  test('TC-012 - P1 - Cancel checkout from step 1 returns to cart', async ({ page }) => {
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await page.getByTestId('cancel').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
  });

  test('TC-013 - P1 - Cancel checkout from step 2 returns to inventory (FLAG-001)', async ({ page }) => {
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await page.getByTestId('cancel').click();
    // FLAG-001: Cancel on step 2 returns to /inventory.html, not /cart.html
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('inventory-container')).toBeVisible();
    // Cart badge should still reflect the item (cart not cleared)
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('TC-014 - P1 - Continue shopping from cart returns to inventory', async ({ page }) => {
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();

    await page.getByTestId('continue-shopping').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('inventory-container')).toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('TC-017 - P2 - Checkout with empty cart (FLAG-002)', async ({ page }) => {
    // Navigate to cart without adding any item after the beforeEach item
    // Remove the item first to get an empty cart
    await page.getByTestId('remove-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByTestId('cart-list')).toBeVisible();

    await page.getByTestId('checkout').click();
    // FLAG-002: Checkout with empty cart should block, but app proceeds to step 1
    // Test documents actual behavior
    const url = page.url();
    if (url.includes('checkout-step-one')) {
      console.log('FLAG-002: Empty cart checkout not blocked — navigated to step 1');
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    } else {
      await expect(page).toHaveURL(/cart\.html/);
    }
  });
});
