import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  PRODUCTS,
  login,
  addToCart,
  goToCart,
  proceedToCheckoutInfo,
} from './helpers';

test.describe('Checkout Form Validation / Error Handling (AC2, AC5)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await addToCart(page, PRODUCTS.backpack.id);
    await goToCart(page);
    await proceedToCheckoutInfo(page);
  });

  test('TC-003: empty First Name shows required error and blocks progression', async ({ page }) => {
    await page.locator('#last-name').fill('Doe');
    await page.locator('#postal-code').fill('12345');
    await page.locator('#continue').click();

    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
    await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required');
  });

  test('TC-004: empty Last Name shows required error and blocks progression', async ({ page }) => {
    await page.locator('#first-name').fill('John');
    await page.locator('#postal-code').fill('12345');
    await page.locator('#continue').click();

    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
    await expect(page.locator('[data-test="error"]')).toContainText('Error: Last Name is required');
  });

  test('TC-005: empty Postal Code shows required error and blocks progression', async ({ page }) => {
    await page.locator('#first-name').fill('John');
    await page.locator('#last-name').fill('Doe');
    await page.locator('#continue').click();

    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
    await expect(page.locator('[data-test="error"]')).toContainText('Error: Postal Code is required');
  });

  test('TC-006: all fields empty shows validation error and blocks progression', async ({ page }) => {
    await page.locator('#continue').click();

    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Error:');
  });

  test('error message dismisses when X button is clicked', async ({ page }) => {
    await page.locator('#continue').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();

    await page.locator('[data-test="error"] button').click();
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
  });

  test('error clears after correcting fields and submitting successfully', async ({ page }) => {
    await page.locator('#continue').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();

    await page.locator('#first-name').fill('John');
    await page.locator('#last-name').fill('Doe');
    await page.locator('#postal-code').fill('12345');
    await page.locator('#continue').click();

    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
  });
});
