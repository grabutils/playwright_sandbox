import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'https://www.saucedemo.com';
const USERNAME = process.env.SAUCE_USERNAME || 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD || 'secret_sauce';

test.describe('Happy Path Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.getByTestId('username').fill(USERNAME);
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-005 - P0 - Full checkout flow end-to-end', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart\.html/);

    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await expect(page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(page.getByTestId('subtotal-label')).toContainText('29.99');
    await expect(page.getByTestId('tax-label')).toBeVisible();
    await expect(page.getByTestId('total-label')).toBeVisible();

    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
    await expect(page.getByTestId('complete-text')).toBeVisible();
  });

  test('TC-006 - P0 - Return to inventory after order completion', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();
    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete\.html/);

    await expect(page.getByTestId('back-to-products')).toBeVisible();
    await page.getByTestId('back-to-products').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('inventory-container')).toBeVisible();
    // Cart badge should be gone (cleared after order)
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });
});
