import { test, expect } from '@playwright/test';

test.describe('Cart Review', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory/);
  });

  test('P0 - Cart displays item name, description, price, quantity, continue-shopping, and checkout buttons', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);

    await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
    await expect(page.getByTestId('inventory-item-desc')).toBeVisible();
    await expect(page.getByTestId('inventory-item-price')).toContainText('29.99');
    await expect(page.getByTestId('item-quantity')).toHaveText('1');
    await expect(page.getByTestId('continue-shopping')).toBeVisible();
    await expect(page.getByTestId('checkout')).toBeVisible();
  });

  test('P1 - Continue Shopping returns to products with cart intact', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);

    await page.getByTestId('continue-shopping').click();
    await expect(page).toHaveURL(/inventory/);
    // Cart badge should still show 1
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('P1 - Remove item from cart clears item and badge', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);

    await page.getByTestId('remove-sauce-labs-backpack').click();

    await expect(page.getByTestId('inventory-item-name')).not.toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });

  test('P2 - Cart badge count increments with each item added', async ({ page }) => {
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');
  });
});
