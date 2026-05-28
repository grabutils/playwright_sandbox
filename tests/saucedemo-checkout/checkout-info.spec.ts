import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  PRODUCTS,
  login,
  addToCart,
  goToCart,
  proceedToCheckoutInfo,
} from './helpers';

test.describe('Checkout Information Page (AC2)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await addToCart(page, PRODUCTS.backpack.id);
    await goToCart(page);
    await proceedToCheckoutInfo(page);
  });

  test('checkout info page has all required form elements', async ({ page }) => {
    await expect(page.locator('#first-name')).toBeVisible();
    await expect(page.locator('#last-name')).toBeVisible();
    await expect(page.locator('#postal-code')).toBeVisible();
    await expect(page.locator('#continue')).toBeVisible();
    await expect(page.locator('#cancel')).toBeVisible();
    await expect(page.locator('text=Checkout: Your Information')).toBeVisible();
  });

  test('TC-013: Cancel on checkout info form returns to cart with items preserved', async ({ page }) => {
    await page.locator('#first-name').fill('John');
    await page.locator('#cancel').click();
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await expect(page.locator('.inventory_item_name')).toHaveText(PRODUCTS.backpack.name);
  });

  test('TC-011: special characters in form fields complete checkout successfully', async ({ page }) => {
    await page.locator('#first-name').fill('José');
    await page.locator('#last-name').fill("O'Brien");
    await page.locator('#postal-code').fill('SW1A 1AA');
    await page.locator('#continue').click();

    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
    await expect(page.locator('.inventory_item_name')).toBeVisible();

    await page.locator('#finish').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });
});
