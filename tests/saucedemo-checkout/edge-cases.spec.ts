import { test, expect } from '@playwright/test';

test.describe('Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill(process.env.APP_USERNAME ?? 'standard_user');
    await page.getByTestId('password').fill(process.env.APP_PASSWORD ?? 'secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory/);
  });

  test('TC-019 P2 - Empty cart checkout navigation', async ({ page }) => {
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
    await expect(page.getByTestId('inventory-item-name')).toHaveCount(0);

    // Known defect FI-001: checkout should block empty cart, but app allows proceeding
    await page.getByTestId('checkout').click();
    await expect(page).not.toHaveURL(/cart\.html/);
  });

  test('TC-020 P2 - Whitespace-only first name accepted or error', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);

    // Known defect FI-003: whitespace-only first name bypasses required field validation
    await page.getByTestId('firstName').fill('   ');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();

    // App accepts whitespace and proceeds — defect: should show "First Name is required"
    await expect(page).not.toHaveURL(/checkout-step-one/);
  });

  test('TC-021 P2 - Back to products after confirmation', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);
    await page.getByTestId('firstName').fill('Test');
    await page.getByTestId('lastName').fill('User');
    await page.getByTestId('postalCode').fill('99999');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);
    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete/);

    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
    await expect(page.getByTestId('back-to-products')).toBeVisible();

    await page.getByTestId('back-to-products').click();
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByTestId('title')).toHaveText('Products');
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });
});
