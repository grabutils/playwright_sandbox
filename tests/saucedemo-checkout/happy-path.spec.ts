import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  PRODUCTS,
  CHECKOUT_DATA,
  EXPECTED,
  login,
  addToCart,
  goToCart,
  proceedToCheckoutInfo,
  fillCheckoutForm,
} from './helpers';

test.describe('Happy Path — Checkout End-to-End', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('TC-001: single item completes full checkout flow', async ({ page }) => {
    await addToCart(page, PRODUCTS.backpack.id);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await goToCart(page);
    await expect(page.locator('.inventory_item_name')).toHaveText(PRODUCTS.backpack.name);
    await expect(page.locator('.inventory_item_price')).toHaveText(PRODUCTS.backpack.price);
    await expect(page.locator('.cart_quantity')).toHaveText('1');

    await proceedToCheckoutInfo(page);
    await fillCheckoutForm(
      page,
      CHECKOUT_DATA.valid.firstName,
      CHECKOUT_DATA.valid.lastName,
      CHECKOUT_DATA.valid.zip,
    );
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

    await expect(page.locator('.inventory_item_name')).toHaveText(PRODUCTS.backpack.name);
    await expect(page.locator('.inventory_item_price')).toHaveText(PRODUCTS.backpack.price);
    await expect(page.locator('.summary_subtotal_label')).toContainText('$29.99');
    await expect(page.locator('.summary_total_label')).toContainText('$');

    await page.locator('#finish').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);
    await expect(page.locator('.complete-header')).toHaveText(EXPECTED.confirmationHeader);
    await expect(page.locator('.complete-text')).toHaveText(EXPECTED.confirmationText);
    await expect(page.locator('#back-to-products')).toBeVisible();
  });

  test('TC-015: multiple items complete full checkout with correct totals', async ({ page }) => {
    await addToCart(page, PRODUCTS.backpack.id);
    await addToCart(page, PRODUCTS.bikeLight.id);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    await goToCart(page);
    const itemNames = page.locator('.inventory_item_name');
    await expect(itemNames).toHaveCount(2);
    await expect(itemNames.nth(0)).toHaveText(PRODUCTS.backpack.name);
    await expect(itemNames.nth(1)).toHaveText(PRODUCTS.bikeLight.name);

    await proceedToCheckoutInfo(page);
    await fillCheckoutForm(
      page,
      CHECKOUT_DATA.valid.firstName,
      CHECKOUT_DATA.valid.lastName,
      CHECKOUT_DATA.valid.zip,
    );
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

    const overviewItems = page.locator('.inventory_item_name');
    await expect(overviewItems).toHaveCount(2);
    await expect(page.locator('.summary_subtotal_label')).toHaveText(EXPECTED.subtotalTwo);
    await expect(page.locator('.summary_tax_label')).toHaveText(EXPECTED.tax);
    await expect(page.locator('.summary_total_label')).toHaveText(EXPECTED.totalTwo);

    await page.locator('#finish').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);
    await expect(page.locator('.complete-header')).toHaveText(EXPECTED.confirmationHeader);

    await page.locator('#back-to-products').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('TC-012: URL progression is correct at each checkout step', async ({ page }) => {
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);

    await addToCart(page, PRODUCTS.backpack.id);
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);

    await page.locator('#checkout').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);

    await fillCheckoutForm(page, 'Test', 'User', '00001');
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

    await page.locator('#finish').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);

    await page.locator('#back-to-products').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });
});
