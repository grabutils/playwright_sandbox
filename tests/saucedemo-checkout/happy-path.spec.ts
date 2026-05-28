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

test('P0 - TC-001 - complete checkout end-to-end happy path', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

  await page.getByTestId('shopping-cart-link').click();
  await expect(page).toHaveURL(/cart/);
  await expect(page.getByTestId('inventory-item-name')).toContainText('Sauce Labs Backpack');
  await expect(page.getByTestId('inventory-item-price')).toContainText('$29.99');
  await expect(page.getByTestId('item-quantity')).toContainText('1');

  await page.getByTestId('checkout').click();
  await expect(page).toHaveURL(/checkout-step-one/);

  await page.getByTestId('firstName').fill('John');
  await page.getByTestId('lastName').fill('Doe');
  await page.getByTestId('postalCode').fill('12345');
  await page.getByTestId('continue').click();
  await expect(page).toHaveURL(/checkout-step-two/);

  await expect(page.getByTestId('subtotal-label')).toBeVisible();
  await expect(page.getByTestId('tax-label')).toBeVisible();
  await expect(page.getByTestId('total-label')).toBeVisible();

  await page.getByTestId('finish').click();
  await expect(page).toHaveURL(/checkout-complete/);

  await expect(page.getByTestId('complete-header')).toContainText('Thank you for your order!');
  await expect(page.getByTestId('complete-text')).toBeVisible();
  await expect(page.getByRole('img', { name: /pony express/i })).toBeVisible();

  await page.getByTestId('back-to-products').click();
  await expect(page).toHaveURL(/inventory/);
  await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
});
