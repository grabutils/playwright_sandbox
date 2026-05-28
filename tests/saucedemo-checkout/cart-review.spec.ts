import { test, expect } from '@playwright/test';

const USERNAME = process.env.SAUCE_USERNAME ?? 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill(USERNAME);
  await page.getByTestId('password').fill(PASSWORD);
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory/);
});

test('P0 - TC-002 - item details displayed correctly in cart', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-bolt-t-shirt').click();
  await page.getByTestId('shopping-cart-link').click();

  await expect(page.getByTestId('inventory-item-name')).toContainText('Sauce Labs Bolt T-Shirt');
  await expect(page.getByTestId('inventory-item-desc')).not.toBeEmpty();
  await expect(page.getByTestId('inventory-item-price')).toContainText('$');
  await expect(page.getByTestId('item-quantity')).toContainText('1');
  await expect(page.getByTestId('cart-quantity-label')).toBeVisible();
  await expect(page.getByTestId('cart-desc-label')).toBeVisible();
});

test('P1 - TC-003 - continue shopping returns to inventory with cart intact', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();
  await expect(page).toHaveURL(/cart/);

  await page.getByTestId('continue-shopping').click();
  await expect(page).toHaveURL(/inventory/);
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
});

test('P1 - TC-004 - remove item clears cart', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();

  await page.getByTestId('remove-sauce-labs-backpack').click();
  await expect(page.locator('[data-test="cart-item"]')).toHaveCount(0);
  await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
});

test('P0 - TC-005 - checkout and continue shopping buttons present', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();

  await expect(page.getByTestId('checkout')).toBeVisible();
  await expect(page.getByTestId('continue-shopping')).toBeVisible();
});

test('P2 - TC-020 - cart badge count matches multiple items added', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('add-to-cart-sauce-labs-fleece-jacket').click();
  await page.getByTestId('add-to-cart-sauce-labs-onesie').click();

  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('3');

  await page.getByTestId('shopping-cart-link').click();
  await expect(page.getByTestId('inventory-item-name')).toHaveCount(3);
});
