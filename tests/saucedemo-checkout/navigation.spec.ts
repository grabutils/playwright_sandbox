import { test, expect } from '@playwright/test';

test.describe('Navigation — Authenticated', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory/);
  });

  test('P1 - Cancel on checkout step 1 returns to cart with items intact', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);

    await page.getByTestId('cancel').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
  });

  test('P1 - Cancel on checkout step 2 returns to inventory (FI-002: navigates to inventory not cart)', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);

    await page.getByTestId('cancel').click();
    // FI-002: saucedemo navigates to /inventory.html on cancel from step 2
    await expect(page).toHaveURL(/inventory/);
  });

  test('P2 - Checking out with empty cart navigates to step 1 (FI-001: app does not block empty-cart checkout)', async ({ page }) => {
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);

    await page.getByTestId('checkout').click();
    // FI-001: saucedemo allows checkout with empty cart
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('P2 - Inventory page title is "Products"', async ({ page }) => {
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  test('P2 - Cart page title is "Your Cart"', async ({ page }) => {
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('title')).toHaveText('Your Cart');
  });

  test('P2 - Checkout step 1 title is "Checkout: Your Information"', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');
  });

  test('P2 - Checkout step 2 title is "Checkout: Overview"', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');
  });
});

test.describe('Navigation — Unauthenticated', () => {
  test('P1 - Direct navigation to inventory without login redirects to login page', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('P1 - Locked-out user sees error on login attempt', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('locked_out_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page).toHaveURL('/');
  });
});
