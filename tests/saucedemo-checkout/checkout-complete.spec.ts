import { test, expect } from '@playwright/test';

test.describe('Checkout Overview and Completion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill(process.env.APP_USERNAME ?? 'standard_user');
    await page.getByTestId('password').fill(process.env.APP_PASSWORD ?? 'secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory/);

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);
  });

  test('TC-012 P0 - Overview shows correct item subtotal', async ({ page }) => {
    await expect(page.getByTestId('subtotal-label')).toBeVisible();
    await expect(page.getByTestId('subtotal-label')).toContainText('Item total: $39.98');
    await expect(page.getByTestId('inventory-item-price').first()).toBeVisible();
  });

  test('TC-013 P0 - Overview shows tax and total', async ({ page }) => {
    await expect(page.getByTestId('tax-label')).toBeVisible();
    await expect(page.getByTestId('tax-label')).toContainText('Tax: $3.20');
    await expect(page.getByTestId('total-label')).toBeVisible();
    await expect(page.getByTestId('total-label')).toContainText('Total: $43.18');
  });

  test('TC-014 P1 - Cancel on step 2 behaviour', async ({ page }) => {
    // Known defect FI-002: cancel navigates to /inventory.html instead of /cart.html
    await page.getByTestId('cancel').click();
    await expect(page).not.toHaveURL(/checkout-step-two/);
  });

  test('TC-015 P0 - Finish completes the order', async ({ page }) => {
    await expect(page.getByTestId('finish')).toBeVisible();
    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete/);

    await expect(page.getByTestId('complete-header')).toBeVisible();
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
    await expect(page.getByTestId('complete-text')).toBeVisible();
    await expect(page.getByTestId('back-to-products')).toBeVisible();
  });
});
