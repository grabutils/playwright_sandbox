import { test, expect } from '@playwright/test';

test.describe('Navigation and Cart Badge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill(process.env.APP_USERNAME ?? 'standard_user');
    await page.getByTestId('password').fill(process.env.APP_PASSWORD ?? 'secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory/);
  });

  test('TC-016 P0 - Page titles correct at each checkout step', async ({ page }) => {
    await expect(page.getByTestId('title')).toHaveText('Products');

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('title')).toHaveText('Your Cart');

    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');

    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');

    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Complete!');
  });

  test('TC-017 P1 - Cart badge shows correct item count', async ({ page }) => {
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');
  });

  test('TC-018 P1 - Remove item from cart', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('inventory-item-name').first()).toContainText('Sauce Labs Backpack');

    await page.getByTestId('remove-sauce-labs-backpack').click();

    await expect(page.getByTestId('inventory-item-name')).toHaveCount(0);
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });
});
