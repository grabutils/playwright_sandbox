import { test, expect } from '@playwright/test';

test.describe('Happy Path Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory/);
  });

  test('P0 - Complete checkout with single item — happy path', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);

    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);

    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);

    await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete/);

    await expect(page.getByTestId('complete-header')).toBeVisible();
    await expect(page.getByTestId('back-to-products')).toBeVisible();
  });

  test('P0 - Complete checkout with two items — cart total accuracy', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('inventory-item-name')).toHaveCount(2);

    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('Jane');
    await page.getByTestId('lastName').fill('Smith');
    await page.getByTestId('postalCode').fill('90210');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);

    await expect(page.getByTestId('inventory-item-name')).toHaveCount(2);
    // Subtotal = $29.99 + $9.99 = $39.98
    await expect(page.getByTestId('subtotal-label')).toContainText('39.98');

    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(page.getByTestId('complete-header')).toBeVisible();
  });

  test('P0 - Checkout overview shows correct item details, subtotal, tax, and total', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('Test');
    await page.getByTestId('lastName').fill('User');
    await page.getByTestId('postalCode').fill('11111');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);

    await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
    await expect(page.getByTestId('inventory-item-price')).toContainText('29.99');
    await expect(page.getByTestId('subtotal-label')).toContainText('29.99');
    await expect(page.getByTestId('tax-label')).toBeVisible();
    await expect(page.getByTestId('total-label')).toBeVisible();
    await expect(page.getByTestId('finish')).toBeVisible();
    await expect(page.getByTestId('cancel')).toBeVisible();
  });
});
