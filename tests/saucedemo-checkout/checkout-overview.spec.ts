import { test, expect } from '@playwright/test';

const USERNAME = process.env.SAUCE_USERNAME ?? 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

test.describe('single item overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill(USERNAME);
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory/);
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('Jane');
    await page.getByTestId('lastName').fill('Smith');
    await page.getByTestId('postalCode').fill('90210');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);
  });

  test('P0 - TC-012 - overview displays item, payment, shipping, and totals', async ({ page }) => {
    await expect(page.getByTestId('inventory-item-name')).toContainText('Sauce Labs Backpack');
    await expect(page.getByTestId('inventory-item-price')).toContainText('$29.99');

    await expect(page.getByTestId('payment-info-label')).toBeVisible();
    await expect(page.getByTestId('payment-info-value')).toBeVisible();
    await expect(page.getByTestId('shipping-info-label')).toBeVisible();
    await expect(page.getByTestId('shipping-info-value')).toBeVisible();

    await expect(page.getByTestId('subtotal-label')).toContainText('$29.99');
    await expect(page.getByTestId('tax-label')).toBeVisible();
    await expect(page.getByTestId('total-label')).toBeVisible();

    await expect(page.getByTestId('cancel')).toBeVisible();
    await expect(page.getByTestId('finish')).toBeVisible();
  });

  test('P1 - TC-013 - cancel from overview returns to inventory', async ({ page }) => {
    await page.getByTestId('cancel').click();
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByTestId('title')).toContainText('Products');
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('P1 - TC-021 - price calculation: total equals subtotal plus tax', async ({ page }) => {
    const subtotalText = await page.getByTestId('subtotal-label').textContent();
    const taxText = await page.getByTestId('tax-label').textContent();
    const totalText = await page.getByTestId('total-label').textContent();

    const extract = (text: string | null) =>
      parseFloat((text ?? '').replace(/[^0-9.]/g, ''));

    const subtotal = extract(subtotalText);
    const tax = extract(taxText);
    const total = extract(totalText);

    expect(subtotal).toBeCloseTo(29.99, 1);
    expect(tax).toBeGreaterThan(0);
    expect(total).toBeCloseTo(subtotal + tax, 1);
  });
});

// storageState: undefined required for multi-item tests — see TC-020 note in cart-review.spec.ts
test.describe('multi-item overview', () => {
  test.use({ storageState: undefined });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill(USERNAME);
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory/);
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two/);
  });

  test('P1 - TC-014 - overview shows all items and combined subtotal', async ({ page }) => {
    await expect(page.getByTestId('inventory-item-name')).toHaveCount(2);
    await expect(page.getByTestId('subtotal-label')).toContainText('39.98');
    await expect(page.getByTestId('total-label')).toBeVisible();
  });
});
