import { test, expect, Page } from "@playwright/test";

async function login(page: Page): Promise<void> {
  await page.goto("/");
  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();
  await expect(page.getByTestId("inventory-container")).toBeVisible();
}

test.describe("Checkout Happy Path", () => {
  // TC-003: Full happy-path checkout with a single item
  test("TC-003: Single item happy-path checkout", async ({ page }) => {
    // Step 1: Launch the application and log in with valid credentials
    await login(page);

    // Step 2: Click Add to cart for the Sauce Labs Backpack
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
    // Expected: cart icon shows badge with count 1
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");

    // Step 3: Click the cart icon in the top navigation
    await page.getByTestId("shopping-cart-link").click();
    await expect(page).toHaveURL(/cart\.html/);
    // Expected: Cart page shows Sauce Labs Backpack as the only item
    const cartItems = page.getByTestId("inventory-item-name");
    await expect(cartItems).toHaveCount(1);
    await expect(cartItems.first()).toHaveText("Sauce Labs Backpack");

    // Step 4: Click the Checkout button
    await page.getByTestId("checkout").click();
    // Expected: Your Information page opens
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Step 5: Enter John in the First Name field
    await page.getByTestId("firstName").fill("John");

    // Step 6: Enter Doe in the Last Name field
    await page.getByTestId("lastName").fill("Doe");

    // Step 7: Enter 12345 in the Postal Code field
    await page.getByTestId("postalCode").fill("12345");

    // Step 8: Click the Continue button
    await page.getByTestId("continue").click();
    // Expected: Checkout Overview page opens
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Step 9: Verify the subtotal amount is displayed
    await expect(page.getByTestId("subtotal-label")).toBeVisible();
    await expect(page.getByTestId("subtotal-label")).toContainText("$");

    // Step 10: Verify the tax amount is displayed
    await expect(page.getByTestId("tax-label")).toBeVisible();
    await expect(page.getByTestId("tax-label")).toContainText("$");

    // Step 11: Verify the order total is displayed
    await expect(page.getByTestId("total-label")).toBeVisible();
    await expect(page.getByTestId("total-label")).toContainText("$");

    // Step 12: Click the Finish button
    await page.getByTestId("finish").click();
    // Expected: Order Confirmation page opens
    await expect(page).toHaveURL(/checkout-complete\.html/);

    // Step 13: Verify the confirmation heading
    await expect(page.getByTestId("complete-header")).toHaveText(
      "Thank you for your order!"
    );

    // Step 14: Verify the confirmation message text is displayed
    await expect(page.getByTestId("complete-text")).toBeVisible();

    // Step 15: Verify the Back to Products button is visible
    await expect(page.getByTestId("back-to-products")).toBeVisible();

    // Step 16: Verify the cart badge is no longer visible
    await expect(page.getByTestId("shopping-cart-badge")).toBeHidden();
  });

  // TC-004: Full happy-path checkout with two items
  test("TC-004: Two-item happy-path checkout", async ({ page }) => {
    // Step 1: Launch the application and log in with valid credentials
    await login(page);

    // Step 2: Click Add to cart for the Sauce Labs Backpack
    await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
    // Expected: cart badge shows count 1
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("1");

    // Step 3: Click Add to cart for the Sauce Labs Bike Light
    await page.getByTestId("add-to-cart-sauce-labs-bike-light").click();
    // Expected: cart badge updates to count 2
    await expect(page.getByTestId("shopping-cart-badge")).toHaveText("2");

    // Step 4: Click the cart icon in the top navigation
    await page.getByTestId("shopping-cart-link").click();
    await expect(page).toHaveURL(/cart\.html/);
    // Expected: Cart page displays both items
    const cartItems = page.getByTestId("inventory-item-name");
    await expect(cartItems).toHaveCount(2);
    await expect(cartItems.filter({ hasText: "Sauce Labs Backpack" })).toBeVisible();
    await expect(cartItems.filter({ hasText: "Sauce Labs Bike Light" })).toBeVisible();

    // Step 5: Click the Checkout button
    await page.getByTestId("checkout").click();
    // Expected: Your Information page opens
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Step 6: Enter Jane in First Name, Smith in Last Name, 90210 in Postal Code, click Continue
    await page.getByTestId("firstName").fill("Jane");
    await page.getByTestId("lastName").fill("Smith");
    await page.getByTestId("postalCode").fill("90210");
    await page.getByTestId("continue").click();
    // Expected: Checkout Overview page opens
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Step 7: Verify both item names are listed in the order overview
    const overviewItems = page.getByTestId("inventory-item-name");
    await expect(
      overviewItems.filter({ hasText: "Sauce Labs Backpack" })
    ).toBeVisible();
    await expect(
      overviewItems.filter({ hasText: "Sauce Labs Bike Light" })
    ).toBeVisible();

    // Step 8: Click the Finish button
    await page.getByTestId("finish").click();
    // Expected: Order Confirmation page opens
    await expect(page).toHaveURL(/checkout-complete\.html/);

    // Step 9: Verify the confirmation heading
    await expect(page.getByTestId("complete-header")).toHaveText(
      "Thank you for your order!"
    );

    // Step 10: Verify the cart badge is no longer visible
    await expect(page.getByTestId("shopping-cart-badge")).toBeHidden();
  });
});
