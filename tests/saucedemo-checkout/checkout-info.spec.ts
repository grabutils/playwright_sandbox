import { test, expect } from '@playwright/test';

test.describe('Checkout Info Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory/);

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('P1 - Submitting empty checkout form shows error and stays on step 1', async ({ page }) => {
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('P1 - Missing first name shows error mentioning First Name', async ({ page }) => {
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('error')).toContainText('First Name');
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('P1 - Missing last name shows error mentioning Last Name', async ({ page }) => {
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('error')).toContainText('Last Name');
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('P1 - Missing postal code shows error mentioning Postal Code', async ({ page }) => {
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('error')).toContainText('Postal Code');
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  // FI-003: App accepts whitespace-only first name — does not strip or validate (P2 defect, documented)
  test('P2 - Whitespace-only first name is accepted by app and proceeds to step 2', async ({ page }) => {
    await page.getByTestId('firstName').fill('   ');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();
    // saucedemo does not validate whitespace-only — proceeds to overview (FI-003)
    await expect(page).toHaveURL(/checkout-step-two/);
  });

  test('P2 - Postal code with special characters proceeds to step 2 (app accepts any non-empty value)', async ({ page }) => {
    await page.getByTestId('firstName').fill('John');
    await page.getByTestId('lastName').fill('Doe');
    await page.getByTestId('postalCode').fill('!@#$%');
    await page.getByTestId('continue').click();
    // saucedemo accepts any non-empty postal code — assert actual behavior
    await expect(page).toHaveURL(/checkout-step-two/);
  });
});
