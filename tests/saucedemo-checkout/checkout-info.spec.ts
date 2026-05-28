import { test, expect } from '@playwright/test';

const USERNAME = process.env.SAUCE_USERNAME ?? 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill(USERNAME);
  await page.getByTestId('password').fill(PASSWORD);
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory/);
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();
  await page.getByTestId('checkout').click();
  await expect(page).toHaveURL(/checkout-step-one/);
});

test('P0 - TC-006 - empty form shows first name required error', async ({ page }) => {
  await page.getByTestId('continue').click();
  await expect(page).toHaveURL(/checkout-step-one/);
  await expect(page.getByTestId('error')).toContainText('First Name is required');
  await expect(page.getByTestId('error-button')).toBeVisible();
});

test('P1 - TC-007 - missing last name shows last name required error', async ({ page }) => {
  await page.getByTestId('firstName').fill('John');
  await page.getByTestId('postalCode').fill('12345');
  await page.getByTestId('continue').click();
  await expect(page).toHaveURL(/checkout-step-one/);
  await expect(page.getByTestId('error')).toContainText('Last Name is required');
});

test('P1 - TC-008 - missing zip shows postal code required error', async ({ page }) => {
  await page.getByTestId('firstName').fill('John');
  await page.getByTestId('lastName').fill('Doe');
  await page.getByTestId('continue').click();
  await expect(page).toHaveURL(/checkout-step-one/);
  await expect(page.getByTestId('error')).toContainText('Postal Code is required');
});

test('P1 - TC-009 - missing first name shows first name required error', async ({ page }) => {
  await page.getByTestId('lastName').fill('Doe');
  await page.getByTestId('postalCode').fill('12345');
  await page.getByTestId('continue').click();
  await expect(page).toHaveURL(/checkout-step-one/);
  await expect(page.getByTestId('error')).toContainText('First Name is required');
});

test('P1 - TC-010 - error banner is dismissible', async ({ page }) => {
  await page.getByTestId('continue').click();
  await expect(page.getByTestId('error')).toBeVisible();

  await page.getByTestId('error-button').click();
  await expect(page.getByTestId('error')).not.toBeVisible();
  await expect(page.getByTestId('firstName')).toBeVisible();
});

test('P1 - TC-011 - cancel from checkout info returns to cart', async ({ page }) => {
  await page.getByTestId('firstName').fill('John');
  await page.getByTestId('cancel').click();
  await expect(page).toHaveURL(/cart/);
  await expect(page.getByTestId('inventory-item-name')).toBeVisible();
});

test('P2 - TC-018 - form fields have correct placeholder text', async ({ page }) => {
  await expect(page.getByPlaceholder('First Name')).toBeVisible();
  await expect(page.getByPlaceholder('Last Name')).toBeVisible();
  await expect(page.getByPlaceholder('Zip/Postal Code')).toBeVisible();
});

test('P2 - TC-019 - alphanumeric zip code is accepted', async ({ page }) => {
  await page.getByTestId('firstName').fill('John');
  await page.getByTestId('lastName').fill('Doe');
  await page.getByTestId('postalCode').fill('A1B 2C3');
  await page.getByTestId('continue').click();
  await expect(page).toHaveURL(/checkout-step-two/);
});
