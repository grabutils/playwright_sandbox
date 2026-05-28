// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { CREDENTIALS } from './helpers';

test.describe('Happy Path — Complete End-to-End Checkout', () => {
  test('complete checkout flow from login to order confirmation', async ({ page }) => {
    // Step 1: Navigate to application
    await page.goto('/');

    // Step 2: Login with valid credentials
    await page.fill('#user-name', CREDENTIALS.username);
    await page.fill('#password', CREDENTIALS.password);
    await page.click('#login-button');

    // Step 3: Verify Products page loads
    await page.waitForURL('**/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');

    // Step 4: Add Sauce Labs Backpack to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');

    // Step 5: Verify cart badge shows 1
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Step 6: Click cart icon
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');

    // Step 7: Verify cart page shows the item
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toContainText('Sauce Labs Backpack');

    // Step 8: Click Checkout button
    await page.click('#checkout');
    await page.waitForURL('**/checkout-step-one.html');

    // Step 9: Fill checkout information
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '10001');
    await page.click('#continue');

    // Step 10: Verify order overview page
    await page.waitForURL('**/checkout-step-two.html');
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.summary_subtotal_label')).toBeVisible();
    await expect(page.locator('.summary_tax_label')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();

    // Step 11: Verify total = subtotal + tax
    const parsePrice = async (selector: string): Promise<number> => {
      const text = await page.locator(selector).textContent() ?? '';
      const match = text.match(/\$([\d.]+)/);
      return match ? parseFloat(match[1]) : 0;
    };
    const subtotal = await parsePrice('.summary_subtotal_label');
    const tax = await parsePrice('.summary_tax_label');
    const total = await parsePrice('.summary_total_label');
    expect(total).toBeCloseTo(subtotal + tax, 2);

    // Step 12: Click Finish
    await page.click('#finish');
    await page.waitForURL('**/checkout-complete.html');

    // Step 13: Verify order confirmation
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('.complete-text')).toBeVisible();
    await expect(page.locator('#back-to-products')).toBeVisible();

    // Step 14: Click Back Home
    await page.click('#back-to-products');
    await page.waitForURL('**/inventory.html');

    // Step 15: Verify products page and empty cart
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});
