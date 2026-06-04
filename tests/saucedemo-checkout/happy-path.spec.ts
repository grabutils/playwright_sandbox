import { test, expect, Page } from '@playwright/test';

async function login(page: Page) {
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/.*inventory\.html/);
}

test.describe('Saucedemo Happy Path Checkout', () => {

  test('TC-003: Full happy-path checkout with a single item', async ({ page }) => {
    // Step 1: Launch the application and log in with valid credentials
    await page.goto('/');
    await login(page);
    // Expected: User is logged in and lands on the Products page
    await expect(page.getByText('Products')).toBeVisible();

    // Step 2: Click Add to cart for the Sauce Labs Backpack
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    // Expected: The cart icon shows a badge with the count 1
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Click the cart icon in the top navigation
    await page.getByTestId('shopping-cart-link').click();
    // Expected: The Cart page opens and displays the Sauce Labs Backpack as the only item
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

    // Step 4: Click the Checkout button
    await page.getByTestId('checkout').click();
    // Expected: The Your Information page opens
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Step 5: Enter John in the First Name field
    await page.getByTestId('firstName').fill('John');
    // Expected: Field accepts the input
    await expect(page.getByTestId('firstName')).toHaveValue('John');

    // Step 6: Enter Doe in the Last Name field
    await page.getByTestId('lastName').fill('Doe');
    // Expected: Field accepts the input
    await expect(page.getByTestId('lastName')).toHaveValue('Doe');

    // Step 7: Enter 12345 in the Postal Code field
    await page.getByTestId('postalCode').fill('12345');
    // Expected: Field accepts the input
    await expect(page.getByTestId('postalCode')).toHaveValue('12345');

    // Step 8: Click the Continue button
    await page.getByTestId('continue').click();
    // Expected: The Checkout Overview page opens showing the order summary
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);

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
    await page.getByTestId('finish').click();
    // Expected: The Order Confirmation page opens
    await expect(page).toHaveURL(/.*checkout-complete\.html/);

    // Step 13: Verify the confirmation heading on the page
    // Expected: The heading reads "Thank you for your order!"
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');

    // Step 14: Verify the confirmation message text is displayed
    // Expected: A descriptive confirmation message is shown below the heading
    await expect(page.getByTestId('complete-text')).toBeVisible();

    // Step 15: Verify the Back to Products button is visible
    // Expected: The button is present and clickable
    // Note: Button label in UI is "Back Home"; data-test attribute is "back-to-products"
    await expect(page.getByTestId('back-to-products')).toBeVisible();

    // Step 16: Verify the cart icon in the top navigation
    // Expected: The cart badge is no longer visible, confirming the cart has been cleared
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });

  test('TC-004: Full happy-path checkout with two items', async ({ page }) => {
    // Step 1: Launch the application and log in with valid credentials
    await page.goto('/');
    await login(page);
    // Expected: User is logged in and lands on the Products page
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
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Step 5: Click the Checkout button
    await page.getByTestId('checkout').click();
    // Expected: The Your Information page opens
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Step 6: Enter Jane in First Name, Smith in Last Name, and 90210 in Postal Code. Click Continue.
    await page.getByTestId('firstName').fill('Jane');
    await page.getByTestId('lastName').fill('Smith');
    await page.getByTestId('postalCode').fill('90210');
    await page.getByTestId('continue').click();
    // Expected: The Checkout Overview page opens showing the order summary
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);

    // Step 7: Verify that both item names are listed in the order overview
    // Expected: Sauce Labs Backpack and Sauce Labs Bike Light are both visible in the summary
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Step 8: Click the Finish button
    await page.getByTestId('finish').click();
    // Expected: The Order Confirmation page opens
    await expect(page).toHaveURL(/.*checkout-complete\.html/);

    // Step 9: Verify the confirmation heading on the page
    // Expected: The heading reads "Thank you for your order!"
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');

    // Step 10: Verify the cart icon in the top navigation
    // Expected: The cart badge is no longer visible, confirming the cart has been cleared
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });

});
