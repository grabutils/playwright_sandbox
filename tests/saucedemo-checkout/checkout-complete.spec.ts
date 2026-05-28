import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  PRODUCTS,
  EXPECTED,
  navigateToCheckoutOverview,
} from './helpers';

test.describe('Order Completion (AC4)', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToCheckoutOverview(page, [PRODUCTS.backpack.id]);
    await page.locator('#finish').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);
  });

  test('TC-009: confirmation page shows success header and dispatch message', async ({ page }) => {
    await expect(page.locator('.complete-header')).toHaveText(EXPECTED.confirmationHeader);
    await expect(page.locator('.complete-text')).toHaveText(EXPECTED.confirmationText);
  });

  test('TC-009: confirmation page shows pony express image', async ({ page }) => {
    await expect(page.locator('img[alt="Pony Express"]')).toBeVisible();
  });

  test('TC-009: Back Home button is visible on confirmation page', async ({ page }) => {
    await expect(page.locator('#back-to-products')).toBeVisible();
    await expect(page.locator('#back-to-products')).toHaveText('Back Home');
  });

  test('TC-010: Back Home redirects to inventory page', async ({ page }) => {
    await page.locator('#back-to-products').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-010: cart is empty after completing order', async ({ page }) => {
    await page.locator('#back-to-products').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('TC-010: inventory page loads fully after Back Home', async ({ page }) => {
    await page.locator('#back-to-products').click();
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });
});
