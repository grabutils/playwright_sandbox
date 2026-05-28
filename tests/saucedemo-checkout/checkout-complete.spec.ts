import { test, expect } from '../../fixtures/test-fixtures';
import { PRODUCTS, CHECKOUT_INFO } from '../../helpers/data';

test.describe('Checkout Complete', () => {
  test.beforeEach(async ({
    page,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
  }) => {
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
    await checkoutOverviewPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
  });

  test('TC-005: Order completion page confirms order', async ({
    page,
    checkoutCompletePage,
    inventoryPage,
  }) => {
    await expect(checkoutCompletePage.completeContainer).toBeVisible();
    await expect(checkoutCompletePage.thankYouHeading).toContainText('Thank you for your order');
    await expect(checkoutCompletePage.backHomeButton).toBeVisible();

    await checkoutCompletePage.backToProducts();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });
});
