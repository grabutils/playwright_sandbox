import { test, expect } from '@playwright/test';

test.describe('Checkout Complete', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory/);
  });

  test('P0 - Order confirmation shows success header, message, Back Home button, and clears cart', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();
    await page.getByTestId('finish').click();

    await expect(page).toHaveURL(/checkout-complete/);
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
    await expect(page.getByTestId('complete-text')).toBeVisible();
    await expect(page.getByTestId('back-to-products')).toBeVisible();

    // Click Back Home and verify cart is cleared
    await page.getByTestId('back-to-products').click();
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });
});
