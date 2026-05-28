import { test, expect } from '@playwright/test';

const USERNAME = process.env.SAUCE_USERNAME ?? 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill(USERNAME);
  await page.getByTestId('password').fill(PASSWORD);
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory/);
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();
  await page.getByTestId('checkout').click();
  await page.getByTestId('firstName').fill('John');
  await page.getByTestId('lastName').fill('Doe');
  await page.getByTestId('postalCode').fill('12345');
  await page.getByTestId('continue').click();
  await page.getByTestId('finish').click();
  await expect(page).toHaveURL(/checkout-complete/);
});

test('P0 - TC-015 - success page shows header, text, image, and back home button', async ({ page }) => {
  await expect(page.getByTestId('complete-header')).toContainText('Thank you for your order!');
  await expect(page.getByTestId('complete-text')).toBeVisible();
  await expect(page.getByRole('img', { name: /pony express/i })).toBeVisible();
  await expect(page.getByTestId('back-to-products')).toBeVisible();
});

test('P0 - TC-016 - back home navigates to inventory and cart is cleared', async ({ page }) => {
  await page.getByTestId('back-to-products').click();
  await expect(page).toHaveURL(/inventory/);
  await expect(page.getByTestId('title')).toContainText('Products');
  await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
});
