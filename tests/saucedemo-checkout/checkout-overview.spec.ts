// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import {
  loginAndWait,
  addItemToCart,
  navigateToCart,
  clickCheckout,
  fillCheckoutInfo,
  PRODUCTS,
} from './helpers';

test.describe('Checkout Overview', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndWait(page);
    await addItemToCart(page, PRODUCTS.backpack);
    await navigateToCart(page);
    await clickCheckout(page);
    await fillCheckoutInfo(page, 'John', 'Doe', '10001');
    await page.waitForURL('**/checkout-step-two.html');
  });

  test('should show summary of all ordered items', async ({ page }) => {
    // Verify cart items are displayed in overview
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toBeVisible();
    await expect(page.locator('.inventory_item_price')).toBeVisible();
  });

  test('should display payment information', async ({ page }) => {
    // Verify payment information section is present
    await expect(page.locator('.summary_info')).toBeVisible();
    await expect(page.locator('.summary_info_label').filter({ hasText: 'Payment Information:' })).toBeVisible();
  });

  test('should display shipping information', async ({ page }) => {
    // Verify shipping information section is present
    await expect(page.locator('.summary_info_label').filter({ hasText: 'Shipping Information:' })).toBeVisible();
  });

  test('should show subtotal, tax, and total amounts', async ({ page }) => {
    // Verify all price breakdowns are visible
    await expect(page.locator('.summary_subtotal_label')).toBeVisible();
    await expect(page.locator('.summary_tax_label')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();

    // Verify they contain dollar amounts
    const subtotalText = await page.locator('.summary_subtotal_label').textContent();
    const taxText = await page.locator('.summary_tax_label').textContent();
    const totalText = await page.locator('.summary_total_label').textContent();

    expect(subtotalText).toMatch(/\$[\d.]+/);
    expect(taxText).toMatch(/\$[\d.]+/);
    expect(totalText).toMatch(/\$[\d.]+/);
  });

  test('should have Cancel and Finish buttons', async ({ page }) => {
    await expect(page.locator('#finish')).toBeVisible();
    await expect(page.locator('#finish')).toBeEnabled();
    await expect(page.locator('#cancel')).toBeVisible();
    await expect(page.locator('#cancel')).toBeEnabled();
  });

  test('should navigate to products when Cancel is clicked', async ({ page }) => {
    await page.click('#cancel');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('should have correct total equal to subtotal plus tax', async ({ page }) => {
    // Extract numeric values from price labels
    const parsePrice = async (selector: string): Promise<number> => {
      const text = await page.locator(selector).textContent() ?? '';
      const match = text.match(/\$([\d.]+)/);
      return match ? parseFloat(match[1]) : 0;
    };

    const subtotal = await parsePrice('.summary_subtotal_label');
    const tax = await parsePrice('.summary_tax_label');
    const total = await parsePrice('.summary_total_label');

    // Allow for floating-point rounding to 2 decimal places
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });
});
