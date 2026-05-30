import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'https://www.saucedemo.com';
const USERNAME = process.env.SAUCE_USERNAME || 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD || 'secret_sauce';

async function loginAndAddToCart(page: any, items: string[] = ['add-to-cart-sauce-labs-backpack']) {
  await page.goto(APP_URL);
  await page.getByTestId('username').fill(USERNAME);
  await page.getByTestId('password').fill(PASSWORD);
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);
  for (const item of items) {
    await page.getByTestId(item).click();
  }
}

async function proceedToCheckoutOverview(page: any, firstName = 'John', lastName = 'Doe', postalCode = '12345') {
  await page.getByTestId('shopping-cart-link').click();
  await page.getByTestId('checkout').click();
  await page.getByTestId('firstName').fill(firstName);
  await page.getByTestId('lastName').fill(lastName);
  await page.getByTestId('postalCode').fill(postalCode);
  await page.getByTestId('continue').click();
  await expect(page).toHaveURL(/checkout-step-two\.html/);
}

test.describe('Checkout Overview and Completion', () => {
  test('TC-016 - P1 - Checkout step 2 displays correct order summary', async ({ page }) => {
    await loginAndAddToCart(page);
    await proceedToCheckoutOverview(page);

    await expect(page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(page.getByTestId('inventory-item-price').first()).toContainText('29.99');
    await expect(page.getByTestId('subtotal-label')).toContainText('Item total: $29.99');
    await expect(page.getByTestId('tax-label')).toContainText('Tax:');
    await expect(page.getByTestId('total-label')).toContainText('Total: $');
    await expect(page.getByTestId('payment-info-label')).toBeVisible();
    await expect(page.getByTestId('shipping-info-label')).toBeVisible();
  });

  test('TC-021 - P2 - Multiple items checkout: total price calculation accuracy', async ({ page }) => {
    await loginAndAddToCart(page, [
      'add-to-cart-sauce-labs-backpack',
      'add-to-cart-sauce-labs-bike-light',
    ]);
    await proceedToCheckoutOverview(page, 'Jane', 'Smith', '90210');

    await expect(page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(page.getByTestId('inventory-item-name').filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();
    // Item total = $29.99 + $9.99 = $39.98
    await expect(page.getByTestId('subtotal-label')).toContainText('$39.98');
    await expect(page.getByTestId('tax-label')).toContainText('Tax:');

    // Parse and verify total = subtotal + tax
    const subtotalText = await page.getByTestId('subtotal-label').textContent();
    const taxText = await page.getByTestId('tax-label').textContent();
    const totalText = await page.getByTestId('total-label').textContent();
    const subtotal = parseFloat(subtotalText!.replace(/[^0-9.]/g, ''));
    const tax = parseFloat(taxText!.replace(/[^0-9.]/g, ''));
    const total = parseFloat(totalText!.replace(/[^0-9.]/g, ''));
    expect(Math.abs(total - (subtotal + tax))).toBeLessThan(0.01);
  });
});
