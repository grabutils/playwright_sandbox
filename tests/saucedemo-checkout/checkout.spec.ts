import { test, expect, Page } from '@playwright/test';

async function login(page: Page, username: string, password: string): Promise<void> {
  await page.goto('/');
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory/);
}

test.describe('SauceDemo Checkout', () => {

  // TC-003: Full happy-path checkout with a single item
  test('TC-003: Single item checkout happy path', async ({ page }) => {
    // Step 1: Launch the application and log in with valid credentials
    await login(page, 'standard_user', 'secret_sauce');
    await expect(page.getByText('Products')).toBeVisible();

    // Step 2: Click Add to cart for the Sauce Labs Backpack
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    // Expected: The cart icon shows a badge with the count 1
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Click the cart icon in the top navigation
    await page.getByTestId('shopping-cart-link').click();
    // Expected: The Cart page opens and displays the Sauce Labs Backpack as the only item
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByTestId('cart-list').getByText('Sauce Labs Bike Light')).not.toBeVisible();

    // Step 4: Click the Checkout button
    await page.getByTestId('checkout').click();
    // Expected: The Your Information page opens
    await expect(page).toHaveURL(/checkout-step-one/);

    // Step 5: Enter John in the First Name field
    await page.getByTestId('firstName').fill('John');

    // Step 6: Enter Doe in the Last Name field
    await page.getByTestId('lastName').fill('Doe');

    // Step 7: Enter 12345 in the Postal Code field
    await page.getByTestId('postalCode').fill('12345');

    // Step 8: Click the Continue button
    await page.getByTestId('continue').click();
    // Expected: The Checkout Overview page opens showing the order summary
    await expect(page).toHaveURL(/checkout-step-two/);

    // Step 9: Verify that the subtotal amount is displayed on the overview page
    await expect(page.getByTestId('subtotal-label')).toBeVisible();

    // Step 10: Verify that the tax amount is displayed on the overview page
    await expect(page.getByTestId('tax-label')).toBeVisible();

    // Step 11: Verify that the order total is displayed on the overview page
    await expect(page.getByTestId('total-label')).toBeVisible();

    // Step 12: Click the Finish button
    await page.getByTestId('finish').click();
    // Expected: The Order Confirmation page opens
    await expect(page).toHaveURL(/checkout-complete/);

    // Step 13: Verify the confirmation heading reads "Thank you for your order!"
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

    // Step 14: Verify the confirmation message text is displayed
    await expect(page.getByTestId('complete-text')).toBeVisible();

    // Step 15: Verify the Back to Products button is visible
    await expect(page.getByTestId('back-to-products')).toBeVisible();

    // Step 16: Verify the cart badge is no longer visible (cart is cleared)
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });

  // TC-004: Full happy-path checkout with multiple items
  test('TC-004: Multi-item checkout happy path', async ({ page }) => {
    // Step 1: Launch the application and log in with valid credentials
    await login(page, 'standard_user', 'secret_sauce');
    await expect(page.getByText('Products')).toBeVisible();

    // Step 2: Click Add to cart for the Sauce Labs Backpack
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    // Expected: The cart icon shows a badge with the count 1
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Click Add to cart for the Sauce Labs Bike Light
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    // Expected: The cart badge updates and shows the count 2
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    // Step 4: Click the cart icon in the top navigation
    await page.getByTestId('shopping-cart-link').click();
    // Expected: The Cart page opens and displays both items
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Step 5: Click the Checkout button
    await page.getByTestId('checkout').click();
    // Expected: The Your Information page opens
    await expect(page).toHaveURL(/checkout-step-one/);

    // Step 6: Enter Jane in First Name, Smith in Last Name, 90210 in Postal Code, click Continue
    await page.getByTestId('firstName').fill('Jane');
    await page.getByTestId('lastName').fill('Smith');
    await page.getByTestId('postalCode').fill('90210');
    await page.getByTestId('continue').click();
    // Expected: The Checkout Overview page opens showing the order summary
    await expect(page).toHaveURL(/checkout-step-two/);

    // Step 7: Verify that both item names are listed in the order overview
    // Expected: Sauce Labs Backpack and Sauce Labs Bike Light are both visible
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Step 8: Click the Finish button
    await page.getByTestId('finish').click();
    // Expected: The Order Confirmation page opens
    await expect(page).toHaveURL(/checkout-complete/);

    // Step 9: Verify the confirmation heading reads "Thank you for your order!"
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

    // Step 10: Verify the cart badge is no longer visible (cart is cleared)
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });

});
