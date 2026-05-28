// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import {
  login,
  loginAndWait,
  addItemToCart,
  navigateToCart,
  clickCheckout,
  CREDENTIALS,
  PRODUCTS,
} from './helpers';

test.describe('Error Handling', () => {
  test('should show error for empty login credentials', async ({ page }) => {
    await page.goto('/');

    // Click login without entering credentials
    await page.click('#login-button');

    // Verify error is displayed
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('should show error for incorrect password', async ({ page }) => {
    await login(page, CREDENTIALS.username, CREDENTIALS.wrongPassword);

    // Verify authentication error
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match any user in this service'
    );
  });

  test('should show error for locked out user', async ({ page }) => {
    await login(page, CREDENTIALS.lockedUsername, CREDENTIALS.password);

    // Verify locked-out error
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Sorry, this user has been locked out'
    );
  });

  test('should reflect empty cart with no items', async ({ page }) => {
    await loginAndWait(page);

    // Navigate directly to cart without adding items
    await page.goto('/cart.html');

    // No cart items should be shown
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('should handle special characters in checkout form fields', async ({ page }) => {
    await loginAndWait(page);
    await addItemToCart(page, PRODUCTS.backpack);
    await navigateToCart(page);
    await clickCheckout(page);

    // Enter special characters
    await page.fill('#first-name', 'John@#$');
    await page.fill('#last-name', 'Doe!%^');
    await page.fill('#postal-code', 'AB!@#');
    await page.click('#continue');

    // SauceDemo accepts all text input — verify it proceeds to step 2
    // (the site does not validate field content, only that fields are non-empty)
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });

  test('should keep user on checkout info page when validation fails', async ({ page }) => {
    await loginAndWait(page);
    await addItemToCart(page, PRODUCTS.backpack);
    await navigateToCart(page);
    await clickCheckout(page);

    // Submit without filling any fields
    await page.click('#continue');

    // Should stay on checkout step one
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('should dismiss login error when X button is clicked', async ({ page }) => {
    await page.goto('/');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();

    // Click the X button to dismiss
    await page.click('.error-button');
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
  });
});
