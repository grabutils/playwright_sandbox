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
  // Cart icon shows badge count 1
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  // Step 3: Click the cart icon in the top navigation
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/cart/);
  // Cart page shows Sauce Labs Backpack as the only item
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);

  // Step 4: Click the Checkout button
  await page.locator('[data-test="checkout"]').click();
  // Your Information page opens
  await expect(page).toHaveURL(/checkout-step-one/);

  // Steps 5-7: Enter First Name, Last Name, and Postal Code
  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('12345');

  // Step 8: Click Continue
  await page.locator('[data-test="continue"]').click();
  // Checkout Overview page opens
  await expect(page).toHaveURL(/checkout-step-two/);

  // Step 9: Verify subtotal amount is displayed
  await expect(page.locator('[data-test="subtotal-label"]')).toBeVisible();

  // Step 10: Verify tax amount is displayed
  await expect(page.locator('[data-test="tax-label"]')).toBeVisible();

  // Step 11: Verify order total is displayed
  await expect(page.locator('[data-test="total-label"]')).toBeVisible();

  // Step 12: Click the Finish button
  await page.locator('[data-test="finish"]').click();
  await expect(page).toHaveURL(/checkout-complete/);

  // Step 13: Verify confirmation heading reads "Thank you for your order!"
  await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

  // Step 14: Verify the confirmation message text is displayed
  await expect(page.locator('[data-test="complete-text"]')).toBeVisible();

  // Step 15: Verify the Back Home button is visible and clickable
  await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();

  // Step 16: Verify cart badge is no longer visible (cart has been cleared)
  await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});

// TC-004: Full happy-path checkout with two items
test('TC-004: Full happy-path checkout with two items', async ({ page }) => {
  // Step 1: Launch the application and log in with valid credentials
  await login(page);
  await expect(page.getByText('Products')).toBeVisible();

  // Step 2: Click Add to cart for the Sauce Labs Backpack
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  // Cart badge updates to 1
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  // Step 3: Click Add to cart for the Sauce Labs Bike Light
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  // Cart badge updates to 2
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');

  // Step 4: Click the cart icon in the top navigation
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/cart/);
  // Cart page displays both items
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

  // Step 5: Click the Checkout button
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/checkout-step-one/);

  // Step 6: Enter Jane in First Name, Smith in Last Name, 90210 in Postal Code, then Continue
  await page.locator('[data-test="firstName"]').fill('Jane');
  await page.locator('[data-test="lastName"]').fill('Smith');
  await page.locator('[data-test="postalCode"]').fill('90210');
  await page.locator('[data-test="continue"]').click();
  // Checkout Overview page opens
  await expect(page).toHaveURL(/checkout-step-two/);

  // Step 7: Verify both item names are listed in the order overview
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

  // Step 8: Click the Finish button
  await page.locator('[data-test="finish"]').click();
  await expect(page).toHaveURL(/checkout-complete/);

  // Step 9: Verify confirmation heading reads "Thank you for your order!"
  await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

  // Step 10: Verify cart badge is no longer visible (cart has been cleared)
  await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});
