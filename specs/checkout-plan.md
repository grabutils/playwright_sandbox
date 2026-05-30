# Checkout Test Plan — SCRUM-101

## App URL
https://www.saucedemo.com

## Test Credentials
- Username: standard_user
- Password: secret_sauce

## Acceptance Criteria Summary
- AC1: Cart Review — logged-in user sees all cart items with name/desc/price/qty, has Continue Shopping and Checkout buttons
- AC2: Order Completion — Finish button → confirmation page with success message + Back Home button

---

## Test Cases

### cart-review.spec.ts — AC1 Cart Page Tests

---

### TC-001 · P0 — Display all cart items with correct details
- **AC:** AC1
- **Steps:**
  1. Navigate to `https://www.saucedemo.com` → login page is displayed
  2. Fill `getByTestId('username')` with `standard_user` → field accepts input
  3. Fill `getByTestId('password')` with `secret_sauce` → field accepts input
  4. Click `getByTestId('login-button')` → redirected to `/inventory.html`, page title shows "Products"
  5. Click `getByTestId('add-to-cart-sauce-labs-backpack')` → button changes to "Remove", badge appears with count "1"
  6. Click `getByTestId('add-to-cart-sauce-labs-bike-light')` → badge updates to "2"
  7. Click `getByTestId('shopping-cart-link')` → redirected to `/cart.html`, page title shows "Your Cart"
  8. Verify `getByTestId('inventory-item-name')` count = 2
  9. Verify `getByTestId('inventory-item-desc')` first item is visible
  10. Verify `getByTestId('inventory-item-price')` first item is visible
  11. Verify `getByTestId('item-quantity')` first item contains text "1"
- **Test data:** standard_user / secret_sauce; products: Sauce Labs Backpack + Sauce Labs Bike Light
- **Expected outcome:** Cart page displays 2 items with name, description, price, and quantity "1" each

---

### TC-002 · P0 — Continue Shopping button returns to products
- **AC:** AC1
- **Steps:**
  1. Login and add Sauce Labs Backpack to cart
  2. Click `getByTestId('shopping-cart-link')` → `/cart.html`
  3. Verify `getByTestId('continue-shopping')` button is visible
  4. Click `getByTestId('continue-shopping')` → redirected to `/inventory.html`
  5. Verify `getByTestId('title')` contains text "Products"
  6. Verify `getByTestId('shopping-cart-badge')` still shows "1" (cart state preserved)
- **Test data:** standard_user / secret_sauce; product: Sauce Labs Backpack
- **Expected outcome:** User is returned to the products page with cart badge intact

---

### TC-003 · P0 — Proceed to Checkout from cart
- **AC:** AC1, AC2
- **Steps:**
  1. Login and add Sauce Labs Backpack to cart
  2. Click `getByTestId('shopping-cart-link')` → `/cart.html`
  3. Verify `getByTestId('checkout')` button is visible
  4. Click `getByTestId('checkout')` → redirected to `/checkout-step-one.html`
  5. Verify `getByTestId('title')` contains text "Checkout: Your Information"
- **Test data:** standard_user / secret_sauce; product: Sauce Labs Backpack
- **Expected outcome:** Checkout button navigates to the customer information form

---

### happy-path.spec.ts — Full End-to-End Checkout

---

### TC-004 · P0 — Complete checkout - single item happy path
- **AC:** AC1, AC2
- **Steps:**
  1. Login → add Sauce Labs Backpack → cart → checkout → fill firstName "John", lastName "Doe", postalCode "12345"
  2. Click `getByTestId('continue')` → `/checkout-step-two.html`
  3. Verify `getByTestId('title')` contains "Checkout: Overview"
  4. Verify `getByTestId('subtotal-label')` contains "Item total: $29.99"
  5. Click `getByTestId('finish')` → `/checkout-complete.html`
  6. Verify `getByTestId('complete-header')` contains "Thank you for your order!"
  7. Verify `getByTestId('back-to-products')` button is visible
- **Test data:** standard_user / secret_sauce; Backpack ($29.99); John Doe; 12345
- **Expected outcome:** Full checkout completes; order confirmation displayed

---

### TC-005 · P0 — Complete checkout - multiple items happy path
- **AC:** AC1, AC2
- **Steps:**
  1. Login → add Backpack + Bike Light → badge shows "2"
  2. Cart → verify 2 items → checkout → fill Jane Smith / 90210
  3. Continue → overview → verify 2 items in list
  4. Verify `getByTestId('subtotal-label')` contains "Item total: $39.98"
  5. Finish → confirmation → verify "Thank you for your order!"
- **Test data:** Backpack ($29.99) + Bike Light ($9.99) = $39.98 subtotal
- **Expected outcome:** All items shown; subtotal sums correctly; order confirms

---

### TC-006 · P0 — Order confirmation page elements visible
- **AC:** AC2
- **Steps:**
  1. Complete full checkout with any valid data
  2. Verify `getByTestId('title')` contains "Checkout: Complete!"
  3. Verify `getByTestId('complete-header')` visible, text "Thank you for your order!"
  4. Verify `getByTestId('complete-text')` visible
  5. Verify `getByTestId('back-to-products')` button "Back Home" visible
  6. Verify `getByTestId('shopping-cart-badge')` NOT visible (cart cleared)
- **Test data:** standard_user / secret_sauce; Backpack; Test User; 10001
- **Expected outcome:** All confirmation elements visible; cart cleared

---

### checkout-info.spec.ts — Step 1 Form Validation

---

### TC-007 · P1 — Missing first name shows error
- **AC:** AC1
- **Steps:**
  1. Navigate to checkout step 1 (login + add item + cart + checkout)
  2. Leave `getByTestId('firstName')` empty; fill lastName "Doe"; postalCode "12345"
  3. Click `getByTestId('continue')`
  4. Verify `getByTestId('error')` visible, contains "First Name is required"
  5. Verify URL stays on `/checkout-step-one.html`
- **Expected outcome:** "Error: First Name is required" displayed; no navigation

---

### TC-008 · P1 — Missing last name shows error
- **AC:** AC1
- **Steps:**
  1. Navigate to checkout step 1
  2. Fill firstName "John"; leave lastName empty; fill postalCode "12345"
  3. Click `getByTestId('continue')`
  4. Verify `getByTestId('error')` contains "Last Name is required"
  5. Verify URL stays on `/checkout-step-one.html`
- **Expected outcome:** "Error: Last Name is required" displayed

---

### TC-009 · P1 — Missing postal code shows error
- **AC:** AC1
- **Steps:**
  1. Navigate to checkout step 1
  2. Fill firstName "John"; fill lastName "Doe"; leave postalCode empty
  3. Click `getByTestId('continue')`
  4. Verify `getByTestId('error')` contains "Postal Code is required"
  5. Verify URL stays on `/checkout-step-one.html`
- **Expected outcome:** "Error: Postal Code is required" displayed

---

### TC-010 · P1 — Cancel on step 1 returns to cart
- **AC:** AC1
- **Steps:**
  1. Navigate to checkout step 1
  2. Optionally type partial data in firstName
  3. Click `getByTestId('cancel')` → redirected to `/cart.html`
  4. Verify `getByTestId('title')` = "Your Cart"
  5. Verify item still listed; badge shows "1"
- **Expected outcome:** Cancel returns to cart with contents unchanged

---

### TC-011 · P0 — Valid form data proceeds to overview
- **AC:** AC1, AC2
- **Steps:**
  1. Navigate to checkout step 1; fill firstName "John", lastName "Doe", postalCode "12345"
  2. Click `getByTestId('continue')` → `/checkout-step-two.html`
  3. Verify `getByTestId('title')` = "Checkout: Overview"
  4. Verify `getByTestId('error')` NOT visible
- **Expected outcome:** Valid form navigates to overview without error

---

### checkout-complete.spec.ts — Step 2 Overview and Completion

---

### TC-012 · P0 — Overview shows correct item subtotal
- **AC:** AC2
- **Steps:**
  1. Add Backpack + Bike Light → checkout → fill form → overview
  2. Verify `getByTestId('subtotal-label')` visible, contains "Item total: $39.98"
  3. Verify item prices visible ($29.99 and $9.99)
- **Test data:** Backpack ($29.99) + Bike Light ($9.99) = $39.98
- **Expected outcome:** Subtotal label shows "$39.98"

---

### TC-013 · P0 — Overview shows tax and total
- **AC:** AC2
- **Steps:**
  1. Add Backpack + Bike Light → checkout → overview
  2. Verify `getByTestId('tax-label')` visible, contains "Tax: $3.20"
  3. Verify `getByTestId('total-label')` visible, contains "Total: $43.18"
- **Test data:** Subtotal $39.98 + Tax $3.20 = Total $43.18
- **Expected outcome:** Tax $3.20 and Total $43.18 displayed

---

### TC-014 · P1 — Cancel on step 2 behaviour
- **AC:** AC2
- **Steps:**
  1. Navigate to overview (step 2)
  2. Click `getByTestId('cancel')`
  3. Verify URL does NOT contain "checkout-step-two"
- **Expected outcome (defect):** Known defect FI-002 — navigates to `/inventory.html` not `/cart.html`

---

### TC-015 · P0 — Finish completes the order
- **AC:** AC2
- **Steps:**
  1. Navigate to overview; verify `getByTestId('finish')` visible
  2. Click `getByTestId('finish')` → `/checkout-complete.html`
  3. Verify `getByTestId('complete-header')` = "Thank you for your order!"
  4. Verify `getByTestId('complete-text')` visible
  5. Verify `getByTestId('back-to-products')` visible
- **Expected outcome:** Finish navigates to confirmation

---

### navigation.spec.ts — Navigation and Page Titles

---

### TC-016 · P0 — Page titles correct at each checkout step
- **AC:** AC1, AC2
- **Steps:**
  1. Login → `getByTestId('title')` = "Products"
  2. Add item → cart → `getByTestId('title')` = "Your Cart"
  3. Checkout → step 1 → `getByTestId('title')` = "Checkout: Your Information"
  4. Fill form → step 2 → `getByTestId('title')` = "Checkout: Overview"
  5. Finish → complete → `getByTestId('title')` = "Checkout: Complete!"
- **Expected outcome:** Correct title at each step

---

### TC-017 · P1 — Cart badge shows correct item count
- **AC:** AC1
- **Steps:**
  1. Login → verify badge NOT visible
  2. Add Backpack → badge = "1"
  3. Add Bike Light → badge = "2"
  4. Navigate to cart → badge still = "2"
- **Expected outcome:** Badge accurately reflects item count; absent when empty

---

### TC-018 · P1 — Remove item from cart
- **AC:** AC1
- **Steps:**
  1. Add Backpack → badge = "1" → cart
  2. Verify "Sauce Labs Backpack" visible in cart
  3. Click `getByTestId('remove-sauce-labs-backpack')` → item removed
  4. Verify `getByTestId('inventory-item-name')` count = 0
  5. Verify badge NOT visible
- **Expected outcome:** Remove deletes item; badge disappears

---

### edge-cases.spec.ts — Edge / Boundary Cases

---

### TC-019 · P2 — Empty cart checkout navigation
- **AC:** AC1
- **Steps:**
  1. Login → cart (no items added) → verify badge absent; item count = 0
  2. Click `getByTestId('checkout')` → observe navigation
  3. Verify URL does NOT contain "cart.html"
- **Expected outcome (defect):** Known defect FI-001 — checkout not blocked for empty cart

---

### TC-020 · P2 — Whitespace-only first name accepted or error
- **AC:** AC1
- **Steps:**
  1. Add item → checkout → step 1
  2. Fill firstName with "   " (spaces only), lastName "Doe", postalCode "12345"
  3. Click `getByTestId('continue')` → observe result
  4. Verify URL does NOT contain "checkout-step-one"
- **Expected outcome (defect):** Known defect FI-003 — whitespace-only accepted; proceeds to overview

---

### TC-021 · P2 — Back to products after confirmation
- **AC:** AC2
- **Steps:**
  1. Complete full checkout → confirmation page
  2. Verify `getByTestId('complete-header')` = "Thank you for your order!"
  3. Click `getByTestId('back-to-products')` → `/inventory.html`
  4. Verify `getByTestId('title')` = "Products"
  5. Verify badge NOT visible (cart cleared)
- **Expected outcome:** Back Home navigates to products; cart empty

---

## Flagged Issues

### FI-001 (Medium): Empty cart proceeds to checkout
- **Description:** Empty cart checkout is not blocked; app navigates to `/checkout-step-one.html`
- **Affected TC:** TC-019
- **Expected:** Checkout disabled or "Your cart is empty" warning
- **Actual:** App proceeds with zero items

### FI-002 (Low): Cancel on step 2 redirects to products, not cart
- **Description:** Cancel on overview goes to `/inventory.html` instead of `/cart.html`
- **Affected TC:** TC-014
- **Expected:** Return to `/cart.html`
- **Actual:** Redirected to `/inventory.html`

### FI-003 (Low): Whitespace-only first name bypasses validation
- **Description:** Spaces-only input passes required field check; no error shown
- **Affected TC:** TC-020
- **Expected:** "Error: First Name is required"
- **Actual:** Proceeds to overview with blank first name
