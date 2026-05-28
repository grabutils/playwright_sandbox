import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(process.cwd(), '.auth', 'state.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/inventory.html');
  await page.context().storageState({ path: authFile });
});
