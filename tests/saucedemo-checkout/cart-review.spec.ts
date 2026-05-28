// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import {
  loginAndWait,
  addItemToCart,
  navigateToCart,
  PRODUCTS,
  CREDENTIALS,
} from './helpers';

test.describe('Cart Review', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndWait(page);
    await addItemToCart(page, PRODUCTS.backpack);
    await navigateToCart(page);
  });

  test('should display product details (name, description, price, quantity)', async ({ page }) => {
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toBeVisible();
    await expect(page.locator('.inventory_item_desc')).toBeVisible();
    await expect(page.locator('.inventory_item_price')).toBeVisible();
    await expect(page.locator('.cart_quantity')).toHaveText('1');
  });

  test('should show Continue Shopping button', async ({ page }) => {
    await expect(page.locator('#continue-shopping')).toBeVisible();
    await expect(page.locator('#continue-shopping')).toBeEnabled();
  });

  test('should show Proceed to Checkout button', async ({ page }) => {
    await expect(page.locator('#checkout')).toBeVisible();
    await expect(page.locator('#checkout')).toBeEnabled();
  });

  test('should navigate back to products when Continue Shopping is clicked', async ({ page }) => {
    await page.click('#continue-shopping');
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should proceed to checkout information when Checkout is clicked', async ({ page }) => {
    await page.click('#checkout');
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });

  test('should show cart badge with correct item count', async ({ page }) => {
    // Navigate back to products to verify badge
    await page.goto('/inventory.html');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Add a second item and verify badge increments
    await addItemToCart(page, PRODUCTS.bikeLight);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('should show multiple items in cart', async ({ page }) => {
    // Go back and add another item
    await page.goto('/inventory.html');
    await addItemToCart(page, PRODUCTS.bikeLight);
    await navigateToCart(page);
    await expect(page.locator('.cart_item')).toHaveCount(2);
  });

  test('should remove item when delete icon is clicked', async ({ page }) => {
    await page.click(`[data-test="remove-${PRODUCTS.backpack}"]`);
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});
