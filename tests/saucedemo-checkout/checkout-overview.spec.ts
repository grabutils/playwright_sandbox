import { test, expect } from '../../fixtures/test-fixtures';
import { PRODUCTS, CHECKOUT_INFO, PRICES } from '../../helpers/data';

test.describe('Checkout Overview', () => {
  test.beforeEach(async ({ page, inventoryPage, cartPage, checkoutInfoPage }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillForm(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkoutInfoPage.submit();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('TC-004: Order overview shows complete summary', async ({
    page,
    checkoutOverviewPage,
  }) => {
    await expect(checkoutOverviewPage.cartItems).toHaveCount(1);
    await expect(checkoutOverviewPage.paymentInfoValue).toBeVisible();
    await expect(checkoutOverviewPage.shippingInfoValue).toBeVisible();
    await expect(checkoutOverviewPage.subtotalLabel).toContainText(PRICES.backpack);
    await expect(checkoutOverviewPage.taxLabel).toContainText(PRICES.backpackTax);
    await expect(checkoutOverviewPage.totalLabel).toContainText(PRICES.backpackTotal);
    await expect(checkoutOverviewPage.finishButton).toBeVisible();
    await expect(checkoutOverviewPage.cancelButton).toBeVisible();
  });

  test('TC-007: Cancel from overview navigates to inventory', async ({
    page,
    checkoutOverviewPage,
  }) => {
    await checkoutOverviewPage.cancel();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
