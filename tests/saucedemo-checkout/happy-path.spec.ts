import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

async function login(page: import('@playwright/test').Page) {
  await page.goto(BASE_URL);
  await page.locator('[data-test="username"]').fill(USERNAME);
  await page.locator('[data-test="password"]').fill(PASSWORD);
  await page.locator('[data-test="login-button"]').click();
  // Step 1 expected: User lands on the Products page
  await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
}

// TC-003: Full happy-path checkout with a single item (Sauce Labs Backpack)
test('TC-003: Single item happy-path checkout', async ({ page }) => {
  // Step 1: Launch the application and log in with valid credentials
  await login(page);

  // Step 2: Click Add to cart for the Sauce Labs Backpack
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  // Expected: Cart icon shows badge with count 1
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  // Step 3: Click the cart icon in the top navigation
  await page.locator('[data-test="shopping-cart-link"]').click();
  // Expected: Cart page opens and displays Sauce Labs Backpack as the only item
  await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

  // Step 4: Click the Checkout button
  await page.locator('[data-test="checkout"]').click();
  // Expected: Your Information page opens
  await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);

  // Step 5: Enter John in the First Name field
  await page.locator('[data-test="firstName"]').fill('John');

  // Step 6: Enter Doe in the Last Name field
  await page.locator('[data-test="lastName"]').fill('Doe');

  // Step 7: Enter 12345 in the Postal Code field
  await page.locator('[data-test="postalCode"]').fill('12345');

  // Step 8: Click the Continue button
  await page.locator('[data-test="continue"]').click();
  // Expected: Checkout Overview page opens
  await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

  // Step 9: Verify subtotal amount is displayed
  await expect(page.locator('[data-test="subtotal-label"]')).toBeVisible();

  // Step 10: Verify tax amount is displayed
  await expect(page.locator('[data-test="tax-label"]')).toBeVisible();

  // Step 11: Verify order total is displayed
  await expect(page.locator('[data-test="total-label"]')).toBeVisible();

  // Step 12: Click the Finish button
  await page.locator('[data-test="finish"]').click();
  // Expected: Order Confirmation page opens
  await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);

  // Step 13: Verify the confirmation heading
  await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');

  // Step 14: Verify the confirmation message text is displayed
  await expect(page.locator('[data-test="complete-text"]')).toBeVisible();

  // Step 15: Verify the Back to Products button is visible
  await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();

  // Step 16: Verify the cart badge is no longer visible (cart cleared)
  await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});

// TC-004: Multi-item happy-path checkout (Sauce Labs Backpack + Sauce Labs Bike Light)
test('TC-004: Multi-item happy-path checkout', async ({ page }) => {
  // Step 1: Launch the application and log in with valid credentials
  await login(page);

  // Step 2: Click Add to cart for the Sauce Labs Backpack
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  // Expected: Cart icon shows badge with count 1
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  // Step 3: Click Add to cart for the Sauce Labs Bike Light
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  // Expected: Cart badge updates to count 2
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');

  // Step 4: Click the cart icon in the top navigation
  await page.locator('[data-test="shopping-cart-link"]').click();
  // Expected: Cart page opens and displays both items
  await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

  // Step 5: Click the Checkout button
  await page.locator('[data-test="checkout"]').click();
  // Expected: Your Information page opens
  await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);

  // Step 6: Enter Jane in First Name, Smith in Last Name, 90210 in Postal Code, click Continue
  await page.locator('[data-test="firstName"]').fill('Jane');
  await page.locator('[data-test="lastName"]').fill('Smith');
  await page.locator('[data-test="postalCode"]').fill('90210');
  await page.locator('[data-test="continue"]').click();
  // Expected: Checkout Overview page opens
  await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

  // Step 7: Verify that both item names are listed in the order overview
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

  // Step 8: Click the Finish button
  await page.locator('[data-test="finish"]').click();
  // Expected: Order Confirmation page opens
  await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);

  // Step 9: Verify the confirmation heading
  await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');

  // Step 10: Verify the cart badge is no longer visible (cart cleared)
  await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});
