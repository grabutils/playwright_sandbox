import { test, expect, Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  // Step 1 expected: user lands on Products page
  await expect(page.getByTestId('title')).toHaveText('Products');
}

test.describe('Happy Path Checkout', () => {
  test('TC-003: Full happy-path checkout with a single item', async ({ page }) => {
    // Step 1: Launch and log in with valid credentials
    await login(page);

    // Step 2: Add Sauce Labs Backpack — cart badge shows 1
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Click cart icon — Cart page shows Sauce Labs Backpack as the only item
    await page.getByTestId('shopping-cart-link').click();
    const cartItemNames = page.getByTestId('inventory-item-name');
    await expect(cartItemNames).toHaveCount(1);
    await expect(cartItemNames.first()).toHaveText('Sauce Labs Backpack');

    // Step 4: Click Checkout — Your Information page opens
    await page.getByTestId('checkout').click();
    await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');

    // Step 5: Enter John in First Name
    await page.getByTestId('firstName').fill('John');

    // Step 6: Enter Doe in Last Name
    await page.getByTestId('lastName').fill('Doe');

    // Step 7: Enter 12345 in Postal Code
    await page.getByTestId('postalCode').fill('12345');

    // Step 8: Click Continue — Checkout Overview page opens
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');

    // Step 9: Verify subtotal amount is displayed
    await expect(page.getByTestId('subtotal-label')).toBeVisible();

    // Step 10: Verify tax amount is displayed
    await expect(page.getByTestId('tax-label')).toBeVisible();

    // Step 11: Verify order total is displayed
    await expect(page.getByTestId('total-label')).toBeVisible();

    // Step 12: Click Finish — Order Confirmation page opens
    await page.getByTestId('finish').click();
    await expect(page.getByTestId('title')).toHaveText('Checkout: Complete!');

    // Step 13: Verify confirmation heading reads "Thank you for your order!"
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');

    // Step 14: Verify confirmation message text is displayed below the heading
    await expect(page.getByTestId('complete-text')).toBeVisible();

    // Step 15: Verify Back Home button is visible
    // Note: TC-003 calls this "Back to Products" but the UI label is "Back Home"; data-test="back-to-products"
    await expect(page.getByTestId('back-to-products')).toBeVisible();

    // Step 16: Verify cart badge is no longer visible (cart cleared)
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });

  test('TC-004: Full happy-path checkout with two items', async ({ page }) => {
    // Step 1: Launch and log in with valid credentials
    await login(page);

    // Step 2: Add Sauce Labs Backpack — cart badge shows 1
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Add Sauce Labs Bike Light — cart badge updates to 2
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    // Step 4: Click cart icon — Cart page shows both items
    await page.getByTestId('shopping-cart-link').click();
    const cartItemNames = page.getByTestId('inventory-item-name');
    await expect(cartItemNames).toHaveCount(2);
    await expect(cartItemNames.nth(0)).toHaveText('Sauce Labs Backpack');
    await expect(cartItemNames.nth(1)).toHaveText('Sauce Labs Bike Light');

    // Step 5: Click Checkout — Your Information page opens
    await page.getByTestId('checkout').click();
    await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');

    // Step 6: Enter Jane Smith, 90210 and click Continue — Checkout Overview opens
    await page.getByTestId('firstName').fill('Jane');
    await page.getByTestId('lastName').fill('Smith');
    await page.getByTestId('postalCode').fill('90210');
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');

    // Step 7: Verify both item names are listed in the order overview
    const overviewItems = page.getByTestId('inventory-item-name');
    await expect(overviewItems.nth(0)).toHaveText('Sauce Labs Backpack');
    await expect(overviewItems.nth(1)).toHaveText('Sauce Labs Bike Light');

    // Step 8: Click Finish — Order Confirmation page opens
    await page.getByTestId('finish').click();
    await expect(page.getByTestId('title')).toHaveText('Checkout: Complete!');

    // Step 9: Verify confirmation heading reads "Thank you for your order!"
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');

    // Step 10: Verify cart badge is no longer visible (cart cleared)
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });
});
