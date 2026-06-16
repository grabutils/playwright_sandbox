import { test, expect, Page } from '@playwright/test';

async function login(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory/);
}

test.describe('Checkout Happy Path', () => {

  /**
   * TC-003: Full happy-path checkout with a single item (Sauce Labs Backpack)
   * Note: TC-003 step 15 refers to "Back to Products" but the actual button
   * in the app is labelled "Back Home" — asserting on the rendered label.
   */
  test('TC-003: Single item checkout – Sauce Labs Backpack', async ({ page }) => {
    // Step 1: Launch application and log in
    await login(page);

    // Step 2: Add Sauce Labs Backpack to cart
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    // Expected: cart badge shows count 1
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Open cart
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    // Expected: Sauce Labs Backpack is the only item
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

    // Step 4: Click Checkout
    await page.getByTestId('checkout').click();
    // Expected: Your Information page opens
    await expect(page).toHaveURL(/checkout-step-one/);

    // Steps 5–7: Enter customer information
    await page.getByTestId('firstName').fill('John');   // Step 5
    await page.getByTestId('lastName').fill('Doe');     // Step 6
    await page.getByTestId('postalCode').fill('12345'); // Step 7

    // Step 8: Click Continue
    await page.getByTestId('continue').click();
    // Expected: Checkout Overview page opens
    await expect(page).toHaveURL(/checkout-step-two/);

    // Step 9: Subtotal is displayed
    await expect(page.getByTestId('subtotal-label')).toBeVisible();

    // Step 10: Tax is displayed
    await expect(page.getByTestId('tax-label')).toBeVisible();

    // Step 11: Order total is displayed
    await expect(page.getByTestId('total-label')).toBeVisible();

    // Step 12: Click Finish
    await page.getByTestId('finish').click();
    // Expected: Order Confirmation page opens
    await expect(page).toHaveURL(/checkout-complete/);

    // Step 13: Confirmation heading
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');

    // Step 14: Confirmation message is displayed below the heading
    await expect(page.getByTestId('complete-text')).toBeVisible();

    // Step 15: Back Home button is visible (app label; TC-003 calls it "Back to Products")
    await expect(page.getByTestId('back-to-products')).toBeVisible();

    // Step 16: Cart badge is no longer visible — cart has been cleared
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });

  /**
   * TC-004: Full happy-path checkout with multiple items
   * (Sauce Labs Backpack + Sauce Labs Bike Light)
   */
  test('TC-004: Multi-item checkout – Backpack + Bike Light', async ({ page }) => {
    // Step 1: Launch application and log in
    await login(page);

    // Step 2: Add Sauce Labs Backpack to cart
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    // Expected: cart badge shows count 1
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Add Sauce Labs Bike Light to cart
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    // Expected: cart badge updates to count 2
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    // Step 4: Open cart
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    // Expected: both items are displayed
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Step 5: Click Checkout
    await page.getByTestId('checkout').click();
    // Expected: Your Information page opens
    await expect(page).toHaveURL(/checkout-step-one/);

    // Step 6: Enter customer information and continue
    await page.getByTestId('firstName').fill('Jane');
    await page.getByTestId('lastName').fill('Smith');
    await page.getByTestId('postalCode').fill('90210');
    await page.getByTestId('continue').click();
    // Expected: Checkout Overview page opens
    await expect(page).toHaveURL(/checkout-step-two/);

    // Step 7: Both item names are listed in the order overview
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Step 8: Click Finish
    await page.getByTestId('finish').click();
    // Expected: Order Confirmation page opens
    await expect(page).toHaveURL(/checkout-complete/);

    // Step 9: Confirmation heading
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');

    // Step 10: Cart badge is no longer visible — cart has been cleared
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });

});
