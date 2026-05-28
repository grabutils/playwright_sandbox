// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import {
  loginAndWait,
  addItemToCart,
  navigateToCart,
  clickCheckout,
  PRODUCTS,
} from './helpers';

test.describe('Checkout Information', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndWait(page);
    await addItemToCart(page, PRODUCTS.backpack);
    await navigateToCart(page);
    await clickCheckout(page);
  });

  test('should display form fields for First Name, Last Name, and Zip Code', async ({ page }) => {
    await expect(page.locator('#first-name')).toBeVisible();
    await expect(page.locator('#last-name')).toBeVisible();
    await expect(page.locator('#postal-code')).toBeVisible();
    await expect(page.locator('#continue')).toBeVisible();
    await expect(page.locator('#cancel')).toBeVisible();
  });

  test('should proceed to order overview when all fields are filled', async ({ page }) => {
    // Step 1: Fill all required fields with valid data
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');

    // Step 2: Click Continue
    await page.click('#continue');

    // Step 3: Verify redirect to order overview
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });

  test('should show error when First Name is empty', async ({ page }) => {
    // Step 1: Fill only last name and postal code
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');

    // Step 2: Click Continue without first name
    await page.click('#continue');

    // Step 3: Verify error message
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('should show error when Last Name is empty', async ({ page }) => {
    // Step 1: Fill only first name and postal code
    await page.fill('#first-name', 'John');
    await page.fill('#postal-code', '12345');

    // Step 2: Click Continue without last name
    await page.click('#continue');

    // Step 3: Verify error message
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
  });

  test('should show error when Zip Code is empty', async ({ page }) => {
    // Step 1: Fill only first and last name
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');

    // Step 2: Click Continue without postal code
    await page.click('#continue');

    // Step 3: Verify error message
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
  });

  test('should show error when all fields are empty', async ({ page }) => {
    // Click Continue without filling any field
    await page.click('#continue');

    // Verify a validation error is shown
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('should cancel checkout and return to cart', async ({ page }) => {
    // Click Cancel on checkout info page
    await page.click('#cancel');

    // Verify return to cart
    await expect(page).toHaveURL(/.*cart\.html/);
  });

  test('should dismiss error message when X button is clicked', async ({ page }) => {
    // Trigger validation error
    await page.click('#continue');
    await expect(page.locator('[data-test="error"]')).toBeVisible();

    // Click the X button to dismiss
    await page.click('.error-button');

    // Error should be gone
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
  });
});
