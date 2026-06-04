import { test, expect, Page } from '@playwright/test';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

async function login(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByTestId('username').fill(USERNAME);
  await page.getByTestId('password').fill(PASSWORD);
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('inventory-container')).toBeVisible();
}

test.describe('Happy Path Checkout', () => {
  test('TC-003: Full happy-path checkout with a single item', async ({ page }) => {
    // Step 1: Log in with valid credentials → lands on Products page
    await login(page);

    // Step 2: Add Sauce Labs Backpack → cart badge shows 1
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Open cart → Backpack is the only item
    await page.getByTestId('shopping-cart-link').click();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

    // Step 4: Click Checkout → Your Information page opens
    await page.getByTestId('checkout').click();
    await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');

    // Steps 5–7: Fill customer info fields
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');

    // Step 8: Continue → Checkout Overview opens
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');

    // Steps 9–11: Subtotal, tax, and total amounts are visible
    await expect(page.getByTestId('subtotal-label')).toBeVisible();
    await expect(page.getByTestId('tax-label')).toBeVisible();
    await expect(page.getByTestId('total-label')).toBeVisible();

    // Step 12: Finish → Order Confirmation page opens
    await page.getByTestId('finish').click();

    // Step 13: Confirmation heading reads "Thank you for your order!"
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');

    // Step 14: Descriptive confirmation message is visible below the heading
    await expect(page.getByTestId('complete-text')).toBeVisible();

    // Step 15: Back to Products button is visible and present
    await expect(page.getByTestId('back-to-products')).toBeVisible();

    // Step 16: Cart badge is gone — cart was cleared after order
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });

  test('TC-004: Full happy-path checkout with two items', async ({ page }) => {
    // Step 1: Log in with valid credentials → lands on Products page
    await login(page);

    // Step 2: Add Sauce Labs Backpack → badge shows 1
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Step 3: Add Sauce Labs Bike Light → badge updates to 2
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    // Step 4: Open cart → both items are listed
    await page.getByTestId('shopping-cart-link').click();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Step 5: Click Checkout → Your Information page opens
    await page.getByTestId('checkout').click();

    // Step 6: Fill Jane Smith 90210 and continue → Overview opens
    await page.getByTestId('firstName').fill('Jane');
    await page.getByTestId('lastName').fill('Smith');
    await page.getByTestId('postalCode').fill('90210');
    await page.getByTestId('continue').click();

    // Step 7: Both item names are listed in the order overview
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Step 8: Finish → Order Confirmation page opens
    await page.getByTestId('finish').click();

    // Step 9: Confirmation heading reads "Thank you for your order!"
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');

    // Step 10: Cart badge is gone — cart was cleared after order
    await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  });
});
