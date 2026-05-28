import { test, expect } from '../../fixtures/test-fixtures';
import { PRODUCTS, CHECKOUT_INFO } from '../../helpers/data';

test.describe('Checkout Info', () => {
  test.beforeEach(async ({ page, inventoryPage, cartPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC-003: Checkout form shows errors on empty submit', async ({
    page,
    checkoutInfoPage,
  }) => {
    await checkoutInfoPage.submit();
    await expect(checkoutInfoPage.errorMessage).toBeVisible();
    await expect(checkoutInfoPage.errorMessage).toContainText('First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC-006: Missing first name field shows error', async ({
    page,
    checkoutInfoPage,
  }) => {
    await checkoutInfoPage.lastNameInput.fill(CHECKOUT_INFO.lastName);
    await checkoutInfoPage.postalCodeInput.fill(CHECKOUT_INFO.postalCode);
    await checkoutInfoPage.submit();
    await expect(checkoutInfoPage.errorMessage).toBeVisible();
    await expect(checkoutInfoPage.errorMessage).toContainText('First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC-009: Missing last name field shows error', async ({
    page,
    checkoutInfoPage,
  }) => {
    await checkoutInfoPage.firstNameInput.fill(CHECKOUT_INFO.firstName);
    await checkoutInfoPage.postalCodeInput.fill(CHECKOUT_INFO.postalCode);
    await checkoutInfoPage.submit();
    await expect(checkoutInfoPage.errorMessage).toBeVisible();
    await expect(checkoutInfoPage.errorMessage).toContainText('Last Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC-010: Missing postal code field shows error', async ({
    page,
    checkoutInfoPage,
  }) => {
    await checkoutInfoPage.firstNameInput.fill(CHECKOUT_INFO.firstName);
    await checkoutInfoPage.lastNameInput.fill(CHECKOUT_INFO.lastName);
    await checkoutInfoPage.submit();
    await expect(checkoutInfoPage.errorMessage).toBeVisible();
    await expect(checkoutInfoPage.errorMessage).toContainText('Postal Code is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC-015: Cancel from checkout info returns to cart', async ({
    page,
    checkoutInfoPage,
  }) => {
    await checkoutInfoPage.cancel();
    await expect(page).toHaveURL(/cart\.html/);
  });
});
