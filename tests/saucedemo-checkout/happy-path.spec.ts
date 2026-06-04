import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

async function login(page: Page): Promise<void> {
  await page.goto(BASE_URL);
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  // Step 1 expected result: user lands on Products page
  await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  await expect(page.locator('[data-test="title"]')).toHaveText('Products');
}

test.describe('Happy Path Checkout', () => {

  // TC-003: Full happy-path checkout with a single item
  test('TC-003: Checkout single item - Sauce Labs Backpack', async ({ page }) => {
    // Step 1: Login with valid credentials
    await login(page);

    // Step 2: Add Sauce Labs Backpack to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    // Expected: cart badge shows count 1
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    // Step 3: Click cart icon
    await page.locator('[data-test="shopping-cart-link"]').click();
    // Expected: Cart page opens with Sauce Labs Backpack as the only item
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.locator('[data-test="cart-item"]')).toHaveCount(1);

    // Step 4: Click Checkout
    await page.locator('[data-test="checkout"]').click();
    // Expected: Your Information page opens
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);

    // Steps 5-7: Enter customer information
    // Step 5: First Name
    await page.locator('[data-test="firstName"]').fill('John');
    // Step 6: Last Name
    await page.locator('[data-test="lastName"]').fill('Doe');
    // Step 7: Postal Code
    await page.locator('[data-test="postalCode"]').fill('12345');

    // Step 8: Click Continue
    await page.locator('[data-test="continue"]').click();
    // Expected: Checkout Overview page opens
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

    // Step 9: Verify subtotal is displayed
    await expect(page.locator('[data-test="subtotal-label"]')).toBeVisible();

    // Step 10: Verify tax is displayed
    await expect(page.locator('[data-test="tax-label"]')).toBeVisible();

    // Step 11: Verify order total is displayed
    await expect(page.locator('[data-test="total-label"]')).toBeVisible();

    // Step 12: Click Finish
    await page.locator('[data-test="finish"]').click();
    // Expected: Order Confirmation page opens
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);

    // Step 13: Verify confirmation heading
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

    // Step 14: Verify confirmation message
    await expect(page.getByText('Your order has been dispatched, and will arrive just as fast as the pony can get there!')).toBeVisible();

    // Step 15: Verify Back Home button is visible (button label in app is "Back Home")
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();

    // Step 16: Verify cart badge is no longer visible (cart cleared)
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
  });

  // TC-004: Full happy-path checkout with two items
  test('TC-004: Checkout two items - Sauce Labs Backpack + Bike Light', async ({ page }) => {
    // Step 1: Login with valid credentials
    await login(page);

    // Step 2: Add Sauce Labs Backpack to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    // Expected: cart badge shows count 1
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    // Step 3: Add Sauce Labs Bike Light to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    // Expected: cart badge updates to count 2
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');

    // Step 4: Click cart icon, verify both items
    await page.locator('[data-test="shopping-cart-link"]').click();
    // Expected: Cart page opens displaying both items
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Step 5: Click Checkout
    await page.locator('[data-test="checkout"]').click();
    // Expected: Your Information page opens
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);

    // Step 6: Enter Jane Smith / 90210 and click Continue
    await page.locator('[data-test="firstName"]').fill('Jane');
    await page.locator('[data-test="lastName"]').fill('Smith');
    await page.locator('[data-test="postalCode"]').fill('90210');
    await page.locator('[data-test="continue"]').click();
    // Expected: Checkout Overview page opens
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

    // Step 7: Verify both item names are listed in the order overview
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Step 8: Click Finish
    await page.locator('[data-test="finish"]').click();
    // Expected: Order Confirmation page opens
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);

    // Step 9: Verify confirmation heading
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

    // Step 10: Verify cart badge is no longer visible (cart cleared)
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
  });

});
