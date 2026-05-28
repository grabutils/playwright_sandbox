// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import {
  loginAndWait,
  completeFullCheckout,
  PRODUCTS,
} from './helpers';

test.describe('Checkout Complete', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndWait(page);
    await completeFullCheckout(page);
  });

  test('should redirect to confirmation page after clicking Finish', async ({ page }) => {
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
  });

  test('should show success message "Thank you for your order!"', async ({ page }) => {
    await expect(page.locator('.complete-header')).toBeVisible();
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('should show order confirmation descriptive text', async ({ page }) => {
    await expect(page.locator('.complete-text')).toBeVisible();
    const text = await page.locator('.complete-text').textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('should show Back Home button', async ({ page }) => {
    await expect(page.locator('#back-to-products')).toBeVisible();
    await expect(page.locator('#back-to-products')).toBeEnabled();
  });

  test('should navigate to products when Back Home is clicked', async ({ page }) => {
    // Click the Back Home button
    await page.click('#back-to-products');

    // Verify user is on the products page
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('cart should be empty after order completion', async ({ page }) => {
    // Go back to products
    await page.click('#back-to-products');

    // Cart badge should not be visible (cart is cleared after order)
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});
