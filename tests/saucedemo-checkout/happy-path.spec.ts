import { test, expect } from '@playwright/test';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

async function login(page: import('@playwright/test').Page) {
  // Navigate to base URL and authenticate with valid credentials
  await page.goto('/');
  await page.getByTestId('username').fill(USERNAME);
  await page.getByTestId('password').fill(PASSWORD);
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);
}

test.describe('Saucedemo Checkout – Happy Path', () => {

  // TC-003: Full happy-path checkout with a single item
  test('TC-003: Single item checkout – Sauce Labs Backpack', async ({ page }) => {
    // Step 1: Launch the application and log in with valid credentials
    await login(page);

    // Step 2: Click Add to cart for the Sauce Labs Backpack
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    // Expected: cart icon shows badge count 1
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Click the cart icon in the top navigation
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart\.html/);
    // Expected: Cart page shows Sauce Labs Backpack as the only item
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

    // Step 4: Click the Checkout button
    await page.getByTestId('checkout').click();
    // Expected: Your Information page opens
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Steps 5-7: Enter checkout information
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');

    // Step 8: Click Continue
    await page.getByTestId('continue').click();
    // Expected: Checkout Overview page opens
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Step 9: Verify subtotal amount is displayed
    await expect(page.getByTestId('subtotal-label')).toBeVisible();

    // Step 10: Verify tax amount is displayed
    await expect(page.getByTestId('tax-label')).toBeVisible();

    // Step 11: Verify order total is displayed
    await expect(page.getByTestId('total-label')).toBeVisible();

    // Step 12: Click the Finish button
    await page.getByTestId('finish').click();
    // Expected: Order Confirmation page opens
    await expect(page).toHaveURL(/checkout-complete\.html/);

    // Step 13: Verify the confirmation heading
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

    // Step 14: Verify the confirmation message text is displayed
    await expect(page.getByTestId('complete-text')).toBeVisible();

    // Step 15: Verify the Back to Products button is visible
    await expect(page.getByTestId('back-to-products')).toBeVisible();

    // Step 16: Verify cart badge is no longer visible (cart cleared)
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });

  // TC-004: Multi-item checkout with two products
  test('TC-004: Multi-item checkout – Sauce Labs Backpack and Bike Light', async ({ page }) => {
    // Step 1: Launch the application and log in with valid credentials
    await login(page);

    // Step 2: Click Add to cart for the Sauce Labs Backpack
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    // Expected: cart badge shows count 1
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Click Add to cart for the Sauce Labs Bike Light
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    // Expected: cart badge updates to count 2
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    // Step 4: Click the cart icon in the top navigation
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart\.html/);
    // Expected: Cart page displays both items
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Step 5: Click the Checkout button
    await page.getByTestId('checkout').click();
    // Expected: Your Information page opens
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Step 6: Enter Jane Smith / 90210 and click Continue
    await page.getByTestId('firstName').fill('Jane');
    await page.getByTestId('lastName').fill('Smith');
    await page.getByTestId('postalCode').fill('90210');
    await page.getByTestId('continue').click();
    // Expected: Checkout Overview page opens
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Step 7: Verify both item names are listed in the order overview
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Step 8: Click the Finish button
    await page.getByTestId('finish').click();
    // Expected: Order Confirmation page opens
    await expect(page).toHaveURL(/checkout-complete\.html/);

    // Step 9: Verify the confirmation heading
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

    // Step 10: Verify cart badge is no longer visible (cart cleared)
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });

});
