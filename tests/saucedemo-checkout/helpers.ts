// spec: specs/saucedemo-checkout-test-plan.md

import { Page } from '@playwright/test';

export const CREDENTIALS = {
  username: 'standard_user',
  password: 'secret_sauce',
  lockedUsername: 'locked_out_user',
  wrongPassword: 'wrong_password',
};

export const PRODUCTS = {
  backpack: 'sauce-labs-backpack',
  bikeLight: 'sauce-labs-bike-light',
  boltTShirt: 'sauce-labs-bolt-t-shirt',
};

export const CHECKOUT_INFO = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '10001',
};

export async function login(
  page: Page,
  username = CREDENTIALS.username,
  password = CREDENTIALS.password
) {
  await page.goto('/');
  await page.fill('#user-name', username);
  await page.fill('#password', password);
  await page.click('#login-button');
}

export async function loginAndWait(
  page: Page,
  username = CREDENTIALS.username,
  password = CREDENTIALS.password
) {
  await login(page, username, password);
  await page.waitForURL('**/inventory.html');
}

export async function addItemToCart(page: Page, productKey: string = PRODUCTS.backpack) {
  await page.click(`[data-test="add-to-cart-${productKey}"]`);
}

export async function navigateToCart(page: Page) {
  await page.click('.shopping_cart_link');
  await page.waitForURL('**/cart.html');
}

export async function clickCheckout(page: Page) {
  await page.click('#checkout');
  await page.waitForURL('**/checkout-step-one.html');
}

export async function fillCheckoutInfo(
  page: Page,
  firstName = CHECKOUT_INFO.firstName,
  lastName = CHECKOUT_INFO.lastName,
  postalCode = CHECKOUT_INFO.postalCode
) {
  await page.fill('#first-name', firstName);
  await page.fill('#last-name', lastName);
  await page.fill('#postal-code', postalCode);
  await page.click('#continue');
}

export async function clickFinish(page: Page) {
  await page.click('#finish');
  await page.waitForURL('**/checkout-complete.html');
}

/** Runs the full checkout flow from the products page */
export async function completeFullCheckout(page: Page) {
  await addItemToCart(page);
  await navigateToCart(page);
  await clickCheckout(page);
  await fillCheckoutInfo(page);
  await page.waitForURL('**/checkout-step-two.html');
  await clickFinish(page);
}
