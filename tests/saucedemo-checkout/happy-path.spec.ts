import { test, expect, Page } from '@playwright/test';

const CREDENTIALS = { username: 'standard_user', password: 'secret_sauce' };

async function login(page: Page) {
  await page.goto('/');
  await page.getByTestId('username').fill(CREDENTIALS.username);
  await page.getByTestId('password').fill(CREDENTIALS.password);
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);
}

test.describe('Checkout Happy Path', () => {
  // TC-003: Full happy-path checkout with a single item
  test('TC-003: Single item checkout - Sauce Labs Backpack', async ({ page }) => {
    // Step 1: Launch and log in with valid credentials
    await login(page);
    await expect(page.getByText('Products')).toBeVisible();

    // Step 2: Click Add to cart for the Sauce Labs Backpack
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    // Cart badge shows count 1
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Click the cart icon — Cart page opens showing only the Backpack
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(1);

    // Step 4: Click the Checkout button — Your Information page opens
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.getByText('Checkout: Your Information')).toBeVisible();

    // Steps 5–7: Enter First Name, Last Name, Postal Code
    await page.getByTestId('firstName').fill('John');   // Step 5
    await page.getByTestId('lastName').fill('Doe');     // Step 6
    await page.getByTestId('postalCode').fill('12345'); // Step 7

    // Step 8: Click Continue — Checkout Overview page opens
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.getByText('Checkout: Overview')).toBeVisible();

    // Step 9: Subtotal is displayed
    await expect(page.getByTestId('subtotal-label')).toBeVisible();

    // Step 10: Tax is displayed
    await expect(page.getByTestId('tax-label')).toBeVisible();

    // Step 11: Order total is displayed
    await expect(page.getByTestId('total-label')).toBeVisible();

    // Step 12: Click Finish — Order Confirmation page opens
    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete\.html/);

    // Step 13: Confirmation heading reads "Thank you for your order!"
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

    // Step 14: Confirmation message is displayed below the heading
    await expect(page.getByText('Your order has been dispatched, and will arrive just as fast as the pony can get there!')).toBeVisible();

    // Step 15: Back to Products button is visible and clickable
    await expect(page.getByTestId('back-to-products')).toBeVisible();

    // Step 16: Cart badge is gone — cart has been cleared
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });

  // TC-004: Full happy-path checkout with two items
  test('TC-004: Two-item checkout - Sauce Labs Backpack + Bike Light', async ({ page }) => {
    // Step 1: Launch and log in with valid credentials
    await login(page);
    await expect(page.getByText('Products')).toBeVisible();

    // Step 2: Add Sauce Labs Backpack — badge shows 1
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Add Sauce Labs Bike Light — badge updates to 2
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    // Step 4: Click cart icon — Cart page shows both items
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Step 5: Click Checkout — Your Information page opens
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Step 6: Enter Jane, Smith, 90210 then Continue — Overview page opens
    await page.getByTestId('firstName').fill('Jane');
    await page.getByTestId('lastName').fill('Smith');
    await page.getByTestId('postalCode').fill('90210');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Step 7: Both item names are listed in the order overview
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Step 8: Click Finish — Order Confirmation page opens
    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete\.html/);

    // Step 9: Confirmation heading reads "Thank you for your order!"
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

    // Step 10: Cart badge is gone — cart has been cleared
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });
});
