import { Page, expect } from '@playwright/test';

export const BASE_URL = 'https://www.saucedemo.com';

export const CREDENTIALS = {
  username: 'standard_user',
  password: 'secret_sauce',
};

export const PRODUCTS = {
  backpack: {
    id: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: '$29.99',
  },
  bikeLight: {
    id: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    price: '$9.99',
  },
};

export const CHECKOUT_DATA = {
  valid: { firstName: 'John', lastName: 'Doe', zip: '12345' },
  special: { firstName: 'José', lastName: "O'Brien", zip: 'SW1A 1AA' },
};

export const EXPECTED = {
  subtotalTwo: 'Item total: $39.98',
  tax: 'Tax: $3.20',
  totalTwo: 'Total: $43.18',
  subtotalOne: 'Item total: $29.99',
  totalOne: 'Total: $32.39',
  payment: 'SauceCard #31337',
  shipping: 'Free Pony Express Delivery!',
  confirmationHeader: 'Thank you for your order!',
  confirmationText: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
};

export async function login(page: Page): Promise<void> {
  await page.goto(BASE_URL);
  await page.locator('#user-name').fill(CREDENTIALS.username);
  await page.locator('#password').fill(CREDENTIALS.password);
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
}

export async function addToCart(page: Page, productId: string): Promise<void> {
  await page.locator(`#add-to-cart-${productId}`).click();
}

export async function goToCart(page: Page): Promise<void> {
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
}

export async function proceedToCheckoutInfo(page: Page): Promise<void> {
  await page.locator('#checkout').click();
  await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
}

export async function fillCheckoutForm(
  page: Page,
  firstName: string,
  lastName: string,
  zip: string,
): Promise<void> {
  await page.locator('#first-name').fill(firstName);
  await page.locator('#last-name').fill(lastName);
  await page.locator('#postal-code').fill(zip);
  await page.locator('#continue').click();
}

export async function loginAndAddToCart(
  page: Page,
  productIds: string[],
): Promise<void> {
  await login(page);
  for (const id of productIds) {
    await addToCart(page, id);
  }
}

export async function navigateToCheckoutOverview(
  page: Page,
  productIds: string[],
  checkoutData = CHECKOUT_DATA.valid,
): Promise<void> {
  await loginAndAddToCart(page, productIds);
  await goToCart(page);
  await proceedToCheckoutInfo(page);
  await fillCheckoutForm(
    page,
    checkoutData.firstName,
    checkoutData.lastName,
    checkoutData.zip,
  );
  await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
}
