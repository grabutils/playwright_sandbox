import { test, expect } from '@playwright/test';

test.describe('Edge Cases — Authentication', () => {
  test('P1 - Login with wrong credentials shows error and stays on login page', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('wrong_user');
    await page.getByTestId('password').fill('wrong_pass');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('login-button')).toBeVisible();
  });
});
