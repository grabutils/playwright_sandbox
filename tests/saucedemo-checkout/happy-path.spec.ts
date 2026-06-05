import { test, expect } from '@playwright/test';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

async function login(page: any) {
  await page.goto('/');
  await page.getByTestId('username').fill(USERNAME);
  await page.getByTestId('password').fill(PASSWORD);
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory/);
}

test.describe('Checkout Happy Path', () => {
  /**
   * TC-003: Full happy-path checkout with a single item
   */
  test('TC-003: Single item checkout - Sauce Labs Backpack', async ({ page }) => {
    // Step 1: Launch the application and log in with valid credentials
    // Expected: User is logged in and lands on the Products page
    await login(page);
    await expect(page.getByTestId('title')).toHaveText('Products');

    // Step 2: Click Add to cart for the Sauce Labs Backpack
    // Expected: The cart icon shows a badge with the count 1
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Click the cart icon in the top navigation
    // Expected: The Cart page opens and displays the Sauce Labs Backpack as the only item
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('title')).toHaveText('Your Cart');
    const cartItemNames = page.getByTestId('inventory-item-name');
    await expect(cartItemNames).toHaveCount(1);
    await expect(cartItemNames.first()).toHaveText('Sauce Labs Backpack');

    // Step 4: Click the Checkout button
    // Expected: The Your Information page opens
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');

    // Steps 5-7: Enter John in First Name, Doe in Last Name, 12345 in Postal Code
    // Expected: Fields accept the input
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');

    // Step 8: Click the Continue button
    // Expected: The Checkout Overview page opens showing the order summary
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');

    // Step 9: Verify that the subtotal amount is displayed on the overview page
    // Expected: A subtotal with a dollar amount is visible
    await expect(page.getByTestId('subtotal-label')).toBeVisible();
    await expect(page.getByTestId('subtotal-label')).toContainText('$');

    // Step 10: Verify that the tax amount is displayed on the overview page
    // Expected: A tax value with a dollar amount is visible
    await expect(page.getByTestId('tax-label')).toBeVisible();
    await expect(page.getByTestId('tax-label')).toContainText('$');

    // Step 11: Verify that the order total is displayed on the overview page
    // Expected: A total with a dollar amount is visible
    await expect(page.getByTestId('total-label')).toBeVisible();
    await expect(page.getByTestId('total-label')).toContainText('$');

    // Step 12: Click the Finish button
    // Expected: The Order Confirmation page opens
    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete/);

    // Step 13: Verify the confirmation heading on the page
    // Expected: The heading reads "Thank you for your order!"
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');

    // Step 14: Verify the confirmation message text is displayed
    // Expected: A descriptive confirmation message is shown below the heading
    await expect(page.getByTestId('complete-text')).toBeVisible();

    // Step 15: Verify the Back to Products button is visible
    // Expected: The button is present and clickable
    // Note: The button is labeled "Back Home" in the app but identified by data-test="back-to-products"
    await expect(page.getByTestId('back-to-products')).toBeVisible();

    // Step 16: Verify the cart icon in the top navigation
    // Expected: The cart badge is no longer visible, confirming the cart has been cleared
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });

  /**
   * TC-004: Multi-item checkout with two products
   */
  test('TC-004: Multi-item checkout - Sauce Labs Backpack and Bike Light', async ({ page }) => {
    // Step 1: Launch the application and log in with valid credentials
    // Expected: User is logged in and lands on the Products page
    await login(page);
    await expect(page.getByTestId('title')).toHaveText('Products');

    // Step 2: Click Add to cart for the Sauce Labs Backpack
    // Expected: The cart icon shows a badge with the count 1
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Click Add to cart for the Sauce Labs Bike Light
    // Expected: The cart badge updates and shows the count 2
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    // Step 4: Click the cart icon in the top navigation
    // Expected: The Cart page opens and displays both items
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('title')).toHaveText('Your Cart');
    const cartItems = page.getByTestId('inventory-item-name');
    await expect(cartItems).toHaveCount(2);

    // Step 5: Click the Checkout button
    // Expected: The Your Information page opens
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);

    // Step 6: Enter Jane in First Name, Smith in Last Name, 90210 in Postal Code, Click Continue
    // Expected: The Checkout Overview page opens showing the order summary
    await page.getByTestId('firstName').fill('Jane');
    await page.getByTestId('lastName').fill('Smith');
    await page.getByTestId('postalCode').fill('90210');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');

    // Step 7: Verify that both item names are listed in the order overview
    // Expected: Sauce Labs Backpack and Sauce Labs Bike Light are both visible in the summary
    const overviewItems = page.getByTestId('inventory-item-name');
    await expect(overviewItems.filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(overviewItems.filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();

    // Step 8: Click the Finish button
    // Expected: The Order Confirmation page opens
    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete/);

    // Step 9: Verify the confirmation heading on the page
    // Expected: The heading reads "Thank you for your order!"
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');

    // Step 10: Verify the cart icon in the top navigation
    // Expected: The cart badge is no longer visible, confirming the cart has been cleared
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });
});
