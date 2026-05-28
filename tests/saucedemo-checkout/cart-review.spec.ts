import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  PRODUCTS,
  login,
  addToCart,
  goToCart,
} from './helpers';

test.describe('Cart Review (AC1)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('TC-002: cart shows all added items with name, description, price, quantity', async ({ page }) => {
    await addToCart(page, PRODUCTS.backpack.id);
    await addToCart(page, PRODUCTS.bikeLight.id);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    await goToCart(page);
    await expect(page.locator('.cart_list .cart_item')).toHaveCount(2);

    const firstItem = page.locator('.cart_item').nth(0);
    await expect(firstItem.locator('.inventory_item_name')).toHaveText(PRODUCTS.backpack.name);
    await expect(firstItem.locator('.inventory_item_desc')).not.toBeEmpty();
    await expect(firstItem.locator('.inventory_item_price')).toHaveText(PRODUCTS.backpack.price);
    await expect(firstItem.locator('.cart_quantity')).toHaveText('1');

    const secondItem = page.locator('.cart_item').nth(1);
    await expect(secondItem.locator('.inventory_item_name')).toHaveText(PRODUCTS.bikeLight.name);
    await expect(secondItem.locator('.inventory_item_desc')).not.toBeEmpty();
    await expect(secondItem.locator('.inventory_item_price')).toHaveText(PRODUCTS.bikeLight.price);
    await expect(secondItem.locator('.cart_quantity')).toHaveText('1');

    await expect(page.locator('#continue-shopping')).toBeVisible();
    await expect(page.locator('#checkout')).toBeVisible();
  });

  test('TC-002: Continue Shopping returns to inventory with cart badge preserved', async ({ page }) => {
    await addToCart(page, PRODUCTS.backpack.id);
    await addToCart(page, PRODUCTS.bikeLight.id);

    await goToCart(page);
    await page.locator('#continue-shopping').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('TC-014: removing one item updates cart and subsequent checkout overview', async ({ page }) => {
    await addToCart(page, PRODUCTS.backpack.id);
    await addToCart(page, PRODUCTS.bikeLight.id);
    await goToCart(page);

    await page.locator(`#remove-${PRODUCTS.bikeLight.id}`).click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await expect(page.locator('.inventory_item_name')).toHaveText(PRODUCTS.backpack.name);

    await page.locator('#checkout').click();
    await page.locator('#first-name').fill('Test');
    await page.locator('#last-name').fill('User');
    await page.locator('#postal-code').fill('12345');
    await page.locator('#continue').click();

    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
    await expect(page.locator('.inventory_item_name')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toHaveText(PRODUCTS.backpack.name);
    await expect(page.locator('.summary_subtotal_label')).toContainText('$29.99');
  });
});
