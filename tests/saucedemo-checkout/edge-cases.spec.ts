import { test, expect } from '@playwright/test';

// TC-018 — edge cases and boundary conditions

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/inventory.html');
});

test('TC-018 - P2 - Price totals math: subtotal + tax = total', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
  await page.getByTestId('shopping-cart-link').click();
  await page.waitForURL('**/cart.html');
  await page.getByTestId('checkout').click();
  await page.waitForURL('**/checkout-step-one.html');
  await page.getByTestId('firstName').fill('John');
  await page.getByTestId('lastName').fill('Doe');
  await page.getByTestId('postalCode').fill('12345');
  await page.getByTestId('continue').click();
  await page.waitForURL('**/checkout-step-two.html');

  const subtotalText = await page.getByTestId('subtotal-label').textContent() ?? '';
  const taxText = await page.getByTestId('tax-label').textContent() ?? '';
  const totalText = await page.getByTestId('total-label').textContent() ?? '';

  const parse = (s: string) => parseFloat(s.replace(/[^0-9.]/g, ''));
  const subtotal = parse(subtotalText);
  const tax = parse(taxText);
  const total = parse(totalText);

  expect(subtotal).toBeGreaterThan(0);
  expect(tax).toBeGreaterThan(0);
  expect(total).toBeGreaterThan(0);
  // Sauce Labs Backpack $29.99 + Bike Light $9.99 = $39.98
  expect(subtotal).toBeCloseTo(39.98, 1);
  expect(Math.abs(subtotal + tax - total)).toBeLessThanOrEqual(0.01);
});
