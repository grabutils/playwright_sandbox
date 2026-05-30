import { test, expect } from '@playwright/test';

// TC-006, TC-020, TC-023 — order confirmation and post-checkout state

async function completeCheckout(page: any) {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/inventory.html');
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');
  await page.getByTestId('checkout').click();
  await page.waitForURL('**/checkout-step-one.html');
  await page.getByTestId('firstName').fill('John');
  await page.getByTestId('lastName').fill('Doe');
  await page.getByTestId('postalCode').fill('12345');
  await page.getByTestId('continue').click();
  await page.waitForURL('**/checkout-step-two.html');
  await page.getByTestId('finish').click();
  await page.waitForURL('**/checkout-complete.html');
}

test('TC-006 - P0 - Order confirmation page details are complete', async ({ page }) => {
  await completeCheckout(page);

  await expect(page.getByTestId('title')).toHaveText('Checkout: Complete!');
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  await expect(page.getByTestId('complete-text')).toBeVisible();
  await expect(page.getByTestId('complete-text')).not.toHaveText('');
  await expect(page.getByTestId('back-to-products')).toBeVisible();
  await expect(page.getByTestId('back-to-products')).toBeEnabled();

  await page.getByTestId('back-to-products').click();
  await page.waitForURL('**/inventory.html');
  await expect(page.getByTestId('inventory-container')).toBeVisible();
});

test('TC-020 - P2 - Cart clears after order is completed', async ({ page }) => {
  await completeCheckout(page);

  await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
  await page.getByTestId('back-to-products').click();
  await page.waitForURL('**/inventory.html');
  await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();

  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');
  await expect(page.getByTestId('inventory-item-name')).not.toBeVisible();
});

test('TC-023 - P2 - No order reference number on confirmation page (defect FI-004)', async ({ page }) => {
  await completeCheckout(page);

  // FI-004: No order reference number is displayed on the confirmation page.
  const headerText = await page.getByTestId('complete-header').textContent() ?? '';
  const bodyText = await page.getByTestId('complete-text').textContent() ?? '';
  expect(headerText.match(/\b[A-Z0-9]{6,}\b/)).toBeNull();
  expect(bodyText.match(/order\s*(#|number|id)\s*\d+/i)).toBeNull();
});
