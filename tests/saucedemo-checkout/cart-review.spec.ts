import { test, expect } from '../../fixtures/test-fixtures';
import { PRODUCTS, PRICES } from '../../helpers/data';

test.describe('Cart Review', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
  });

  test('TC-002: Cart displays item details correctly', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.itemQuantities.first()).toHaveText('1');
    await expect(cartPage.itemPrices.first()).toHaveText(PRICES.backpack);
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });

  test('TC-008: Continue Shopping from cart returns to inventory', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-012: Removing item from cart updates badge count', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.goToCart();
    await cartPage.removeItem(PRODUCTS.backpack).click();
    await expect(inventoryPage.cartBadge).not.toBeVisible();
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('TC-014: Cart badge reflects multiple product additions', async ({
    page,
    inventoryPage,
  }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.addToCart(PRODUCTS.bikeLight);
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.addToCart(PRODUCTS.boltTShirt);
    await expect(inventoryPage.cartBadge).toHaveText('3');
  });
});
