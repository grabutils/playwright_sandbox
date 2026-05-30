import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'https://www.saucedemo.com';
const USERNAME = process.env.SAUCE_USERNAME || 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD || 'secret_sauce';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test('TC-001 - P0 - Successful login with valid credentials', async ({ page }) => {
    await page.getByTestId('username').fill(USERNAME);
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('inventory-container')).toBeVisible();
  });

  test('TC-007 - P1 - Login failure: invalid username', async ({ page }) => {
    await page.getByTestId('username').fill('invalid_user');
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('Username and password do not match');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('TC-008 - P1 - Login failure: empty credentials', async ({ page }) => {
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('Username is required');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });
});
