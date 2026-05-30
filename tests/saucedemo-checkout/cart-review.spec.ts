import { test, expect } from '@playwright/test';

// TC-002, TC-005, TC-015, TC-016, TC-022 — cart review and item management

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/inventory.html');
});

test('TC-002 - P0 - Add single item to cart and verify badge updates', async ({ page }) => {
  await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await expect(page.getByTestId('shopping-cart-badge')).toBeVisible();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
});

test('TC-005 - P0 - Verify cart item details (name, description, price, quantity)', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');

  await expect(page.getByTestId('cart-list')).toBeVisible();
  await expect(page.getByTestId('inventory-item-name').first()).toBeVisible();
  await expect(page.getByTestId('inventory-item-name').first()).not.toHaveText('');
  await expect(page.getByTestId('inventory-item-desc').first()).toBeVisible();
  await expect(page.getByTestId('inventory-item-desc').first()).not.toHaveText('');
  await expect(page.getByTestId('inventory-item-price').first()).toBeVisible();
  await expect(page.getByTestId('inventory-item-price').first()).toContainText('$');
  await expect(page.getByTestId('item-quantity').first()).toHaveText('1');
  await expect(page.getByTestId('continue-shopping')).toBeVisible();
  await expect(page.getByTestId('checkout')).toBeVisible();
});

test('TC-015 - P1 - Remove item from cart', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');

  await expect(page.getByTestId('inventory-item-name').first()).toBeVisible();
  await page.getByTestId('remove-sauce-labs-backpack').click();

  await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  await expect(page.getByTestId('inventory-item-name')).not.toBeVisible();
});

test('TC-016 - P2 - Cart badge count handles two items (boundary)', async ({ page }) => {
  await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');
  await expect(page.getByTestId('inventory-item-name')).toHaveCount(2);
});

test('TC-022 - P2 - Multi-item cart review shows all items with correct details', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');

  const names = page.getByTestId('inventory-item-name');
  const descs = page.getByTestId('inventory-item-desc');
  const prices = page.getByTestId('inventory-item-price');
  const quantities = page.getByTestId('item-quantity');

  await expect(names).toHaveCount(2);
  await expect(descs).toHaveCount(2);
  await expect(prices).toHaveCount(2);
  await expect(quantities).toHaveCount(2);

  for (let i = 0; i < 2; i++) {
    await expect(names.nth(i)).not.toHaveText('');
    await expect(descs.nth(i)).not.toHaveText('');
    await expect(prices.nth(i)).toContainText('$');
    await expect(quantities.nth(i)).toHaveText('1');
  }

  await expect(page.getByTestId('continue-shopping')).toBeVisible();
  await expect(page.getByTestId('checkout')).toBeVisible();
});
