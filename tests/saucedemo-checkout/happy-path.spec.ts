import { test, expect } from '../../fixtures/test-fixtures';
import { PRODUCTS, CHECKOUT_INFO, PRICES } from '../../helpers/data';

test.describe('Happy Path Checkout', () => {
  test('Complete checkout happy path', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await page.goto('/inventory.html');
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(1);

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await checkoutInfoPage.fillForm(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkoutInfoPage.submit();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await expect(checkoutOverviewPage.subtotalLabel).toContainText(PRICES.backpack);
    await expect(checkoutOverviewPage.taxLabel).toContainText(PRICES.backpackTax);
    await expect(checkoutOverviewPage.totalLabel).toContainText(PRICES.backpackTotal);

    await checkoutOverviewPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);

    await expect(checkoutCompletePage.completeContainer).toBeVisible();
    await expect(checkoutCompletePage.thankYouHeading).toContainText('Thank you for your order');
    await expect(checkoutCompletePage.backHomeButton).toBeVisible();

    await checkoutCompletePage.backToProducts();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });
});
