import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  PRODUCTS,
  EXPECTED,
  navigateToCheckoutOverview,
} from './helpers';

test.describe('Checkout Overview Page (AC3)', () => {
  test('TC-007: overview displays all items, payment, shipping, subtotal, tax, and total', async ({ page }) => {
    await navigateToCheckoutOverview(page, [PRODUCTS.backpack.id, PRODUCTS.bikeLight.id]);

    await expect(page.locator('text=Checkout: Overview')).toBeVisible();

    const itemNames = page.locator('.inventory_item_name');
    await expect(itemNames).toHaveCount(2);
    await expect(itemNames.nth(0)).toHaveText(PRODUCTS.backpack.name);
    await expect(itemNames.nth(1)).toHaveText(PRODUCTS.bikeLight.name);

    const prices = page.locator('.inventory_item_price');
    await expect(prices.nth(0)).toHaveText(PRODUCTS.backpack.price);
    await expect(prices.nth(1)).toHaveText(PRODUCTS.bikeLight.price);

    await expect(page.locator('text=Payment Information:')).toBeVisible();
    await expect(page.locator(`text=${EXPECTED.payment}`)).toBeVisible();

    await expect(page.locator('text=Shipping Information:')).toBeVisible();
    await expect(page.locator(`text=${EXPECTED.shipping}`)).toBeVisible();

    await expect(page.locator('.summary_subtotal_label')).toHaveText(EXPECTED.subtotalTwo);
    await expect(page.locator('.summary_tax_label')).toHaveText(EXPECTED.tax);
    await expect(page.locator('.summary_total_label')).toHaveText(EXPECTED.totalTwo);

    await expect(page.locator('#cancel')).toBeVisible();
    await expect(page.locator('#finish')).toBeVisible();
  });

  test('TC-008: Cancel on overview returns to inventory with cart preserved', async ({ page }) => {
    await navigateToCheckoutOverview(page, [PRODUCTS.backpack.id]);

    await page.locator('#cancel').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('overview quantities are correct for each item', async ({ page }) => {
    await navigateToCheckoutOverview(page, [PRODUCTS.backpack.id, PRODUCTS.bikeLight.id]);

    // Overview page uses .cart_quantity (same class as cart page, no .summary_quantity exists)
    const quantities = page.locator('.cart_quantity');
    await expect(quantities).toHaveCount(2);
    await expect(quantities.nth(0)).toHaveText('1');
    await expect(quantities.nth(1)).toHaveText('1');
  });
});
