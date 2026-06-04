import { test, expect, Page } from '@playwright/test';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

async function login(page: Page): Promise<void> {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill(USERNAME);
  await page.locator('[data-test="password"]').fill(PASSWORD);
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/inventory/);
}

// TC-003: Full happy-path checkout with a single item
test('TC-003: Full happy-path checkout with a single item', async ({ page }) => {
  // Step 1: Launch the application and log in with valid credentials
  await login(page);
  await expect(page.getByText('Products')).toBeVisible();

  // Step 2: Click Add to cart for the Sauce Labs Backpack
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  // Expected: Cart icon shows a badge with count 1
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  // Step 3: Click the cart icon in the top navigation
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/cart/);
  // Expected: Cart page shows Sauce Labs Backpack as the only item
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);

  // Step 4: Click the Checkout button
  await page.locator('[data-test="checkout"]').click();
  // Expected: Your Information page opens
  await expect(page).toHaveURL(/checkout-step-one/);

  // Step 5: Enter John in the First Name field
  await page.locator('[data-test="firstName"]').fill('John');

  // Step 6: Enter Doe in the Last Name field
  await page.locator('[data-test="lastName"]').fill('Doe');

  // Step 7: Enter 12345 in the Postal Code field
  await page.locator('[data-test="postalCode"]').fill('12345');

  // Step 8: Click the Continue button
  await page.locator('[data-test="continue"]').click();
  // Expected: Checkout Overview page opens showing the order summary
  await expect(page).toHaveURL(/checkout-step-two/);

  // Step 9: Verify subtotal amount is displayed on the overview page
  await expect(page.locator('[data-test="subtotal-label"]')).toBeVisible();

  // Step 10: Verify tax amount is displayed on the overview page
  await expect(page.locator('[data-test="tax-label"]')).toBeVisible();

  // Step 11: Verify order total is displayed on the overview page
  await expect(page.locator('[data-test="total-label"]')).toBeVisible();

  // Step 12: Click the Finish button
  await page.locator('[data-test="finish"]').click();
  // Expected: Order Confirmation page opens
  await expect(page).toHaveURL(/checkout-complete/);

  // Step 13: Verify the confirmation heading
  // Expected: Heading reads "Thank you for your order!"
  await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

  // Step 14: Verify the confirmation message text is displayed
  await expect(page.locator('[data-test="complete-text"]')).toBeVisible();

  // Step 15: Verify the Back Home button is visible and clickable
  await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();

  // Step 16: Verify cart badge is no longer visible — cart has been cleared
  await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});

// TC-004: Full happy-path checkout with two items
test('TC-004: Full happy-path checkout with two items', async ({ page }) => {
  // Step 1: Launch the application and log in with valid credentials
  await login(page);
  await expect(page.getByText('Products')).toBeVisible();

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
  await expect(page).toHaveURL(/cart/);
  // Expected: Cart page shows both items
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

  // Step 5: Click the Checkout button
  await page.locator('[data-test="checkout"]').click();
  // Expected: Your Information page opens
  await expect(page).toHaveURL(/checkout-step-one/);

  // Step 6: Enter Jane / Smith / 90210 then click Continue
  await page.locator('[data-test="firstName"]').fill('Jane');
  await page.locator('[data-test="lastName"]').fill('Smith');
  await page.locator('[data-test="postalCode"]').fill('90210');
  await page.locator('[data-test="continue"]').click();
  // Expected: Checkout Overview page opens showing the order summary
  await expect(page).toHaveURL(/checkout-step-two/);

  // Step 7: Verify both item names are listed in the order overview
  // Expected: Sauce Labs Backpack and Sauce Labs Bike Light are both visible
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

  // Step 8: Click the Finish button
  await page.locator('[data-test="finish"]').click();
  // Expected: Order Confirmation page opens
  await expect(page).toHaveURL(/checkout-complete/);

  // Step 9: Verify the confirmation heading
  // Expected: Heading reads "Thank you for your order!"
  await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

  // Step 10: Verify cart badge is no longer visible — cart has been cleared
  await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});
