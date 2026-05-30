import { test, expect } from '@playwright/test';

test.describe('Happy Path Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill(process.env.APP_USERNAME ?? 'standard_user');
    await page.getByTestId('password').fill(process.env.APP_PASSWORD ?? 'secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory/);
  });

  test('TC-004 P0 - Complete checkout - single item happy path', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('inventory-item-name').first()).toContainText('Sauce Labs Backpack');
    await expect(page.getByTestId('inventory-item-price').first()).toContainText('$29.99');

    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);

    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);

    await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');
    await expect(page.getByTestId('subtotal-label')).toContainText('Item total: $29.99');

    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
    await expect(page.getByTestId('back-to-products')).toBeVisible();
  });

  test('TC-005 P0 - Complete checkout - multiple items happy path', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('inventory-item-name')).toHaveCount(2);

    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);

    await page.getByTestId('firstName').fill('Jane');
    await page.getByTestId('lastName').fill('Smith');
    await page.getByTestId('postalCode').fill('90210');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);

    await expect(page.getByTestId('inventory-item-name')).toHaveCount(2);
    await expect(page.getByTestId('subtotal-label')).toContainText('Item total: $39.98');

    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  });

  test('TC-006 P0 - Order confirmation page elements visible', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('Test');
    await page.getByTestId('lastName').fill('User');
    await page.getByTestId('postalCode').fill('10001');
    await page.getByTestId('continue').click();
    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete/);

    await expect(page.getByTestId('title')).toHaveText('Checkout: Complete!');
    await expect(page.getByTestId('complete-header')).toBeVisible();
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
    await expect(page.getByTestId('complete-text')).toBeVisible();
    await expect(page.getByTestId('back-to-products')).toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });
});
