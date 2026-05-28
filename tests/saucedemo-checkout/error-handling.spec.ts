import { test, expect } from '../../fixtures/test-fixtures';
import { PRODUCTS, CHECKOUT_INFO } from '../../helpers/data';

test.describe('Error Handling', () => {
  test.beforeEach(async ({ page, inventoryPage, cartPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC-011: Error message dismisses on close button click', async ({
    page,
    checkoutInfoPage,
  }) => {
    await checkoutInfoPage.submit();
    await expect(checkoutInfoPage.errorMessage).toBeVisible();
    await checkoutInfoPage.dismissError();
    await expect(checkoutInfoPage.errorMessage).not.toBeVisible();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC-013: Postal code accepts alphanumeric input', async ({
    page,
    checkoutInfoPage,
  }) => {
    await checkoutInfoPage.firstNameInput.fill(CHECKOUT_INFO.firstName);
    await checkoutInfoPage.lastNameInput.fill(CHECKOUT_INFO.lastName);
    await checkoutInfoPage.postalCodeInput.fill('AB1 2CD');
    await checkoutInfoPage.submit();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });
});
