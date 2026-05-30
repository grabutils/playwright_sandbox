import { test, expect } from '@playwright/test';

test.describe('Checkout Information Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill(process.env.APP_USERNAME ?? 'standard_user');
    await page.getByTestId('password').fill(process.env.APP_PASSWORD ?? 'secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory/);

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('TC-007 P1 - Missing first name shows error', async ({ page }) => {
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();

    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('First Name is required');
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('TC-008 P1 - Missing last name shows error', async ({ page }) => {
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();

    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('Last Name is required');
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('TC-009 P1 - Missing postal code shows error', async ({ page }) => {
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('continue').click();

    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('Postal Code is required');
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('TC-010 P1 - Cancel on step 1 returns to cart', async ({ page }) => {
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('cancel').click();

    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('title')).toHaveText('Your Cart');
    await expect(page.getByTestId('inventory-item-name').first()).toContainText('Sauce Labs Backpack');
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('TC-011 P0 - Valid form data proceeds to overview', async ({ page }) => {
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();

    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');
    await expect(page.getByTestId('error')).not.toBeVisible();
  });
});
