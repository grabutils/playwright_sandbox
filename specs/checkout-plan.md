# SCRUM-101 Checkout Test Plan

**Application:** https://www.saucedemo.com  
**Date:** 2026-05-30  
**Browser:** Chromium only  
**testIdAttribute:** `data-test` (configured in `playwright.config.ts`; `getByTestId()` maps to `data-test`)

---

## Acceptance Criteria

- **AC1:** Cart Review — logged-in user with items sees item details (name, description, price, quantity), total price, continue-shopping and proceed-to-checkout options
- **AC2:** Order Completion — Finish → order confirmation page with success message and "Back Home" button

**Business Rules:** all checkout fields mandatory; must be logged in; cart cannot be empty; order confirmation clears cart; can cancel at any step

---

## Locator Reference

| Element | Locator |
|---|---|
| Username field | `getByTestId('username')` |
| Password field | `getByTestId('password')` |
| Login button | `getByTestId('login-button')` |
| Error message | `getByTestId('error')` |
| Cart link (clickable) | `getByTestId('shopping-cart-link')` |
| Cart badge | `getByTestId('shopping-cart-badge')` |
| Add to cart (Backpack) | `getByTestId('add-to-cart-sauce-labs-backpack')` |
| Add to cart (Bike Light) | `getByTestId('add-to-cart-sauce-labs-bike-light')` |
| Remove (Backpack) | `getByTestId('remove-sauce-labs-backpack')` |
| Cart item name | `getByTestId('inventory-item-name')` |
| Cart item description | `getByTestId('inventory-item-desc')` |
| Cart item price | `getByTestId('inventory-item-price')` |
| Cart item quantity | `getByTestId('item-quantity')` |
| Continue Shopping | `getByTestId('continue-shopping')` |
| Checkout button (cart) | `getByTestId('checkout')` |
| First Name | `getByTestId('firstName')` |
| Last Name | `getByTestId('lastName')` |
| Postal Code | `getByTestId('postalCode')` |
| Continue (step 1) | `getByTestId('continue')` |
| Cancel | `getByTestId('cancel')` |
| Finish | `getByTestId('finish')` |
| Subtotal label | `getByTestId('subtotal-label')` |
| Tax label | `getByTestId('tax-label')` |
| Total label | `getByTestId('total-label')` |
| Complete header | `getByTestId('complete-header')` |
| Complete text | `getByTestId('complete-text')` |
| Back Home button | `getByTestId('back-to-products')` |
| Page title | `getByTestId('title')` |

---

## Test Cases

### TC-001 | P0 | Complete checkout with single item — happy path
**AC:** AC1, AC2 · **Data:** standard_user/secret_sauce, Backpack, John/Doe/12345

1. Navigate to `/` → login with standard_user/secret_sauce → expect `/inventory.html`
   - `getByTestId('username')`, `getByTestId('password')`, `getByTestId('login-button')`
2. Click add-to-cart for Backpack → badge shows 1
   - `getByTestId('add-to-cart-sauce-labs-backpack')`
3. Click cart link → expect `/cart.html`; item shows name=$29.99, qty=1
   - `getByTestId('shopping-cart-link')`, `getByTestId('inventory-item-name')`, `getByTestId('inventory-item-price')`, `getByTestId('item-quantity')`
4. Click Checkout → `/checkout-step-one.html`
   - `getByTestId('checkout')`
5. Fill John / Doe / 12345 → Continue → `/checkout-step-two.html`
   - `getByTestId('firstName')`, `getByTestId('lastName')`, `getByTestId('postalCode')`, `getByTestId('continue')`
6. Overview shows "Sauce Labs Backpack" → click Finish → `/checkout-complete.html`
   - `getByTestId('inventory-item-name')`, `getByTestId('finish')`
7. Confirm header visible; Back Home button visible
   - `getByTestId('complete-header')`, `getByTestId('back-to-products')`

---

### TC-002 | P0 | Complete checkout with two items — cart total accuracy
**AC:** AC1, AC2 · **Data:** Backpack ($29.99) + Bike Light ($9.99), Jane/Smith/90210

1. Login → add both items → badge=2 → cart shows 2 items
   - `getByTestId('add-to-cart-sauce-labs-backpack')`, `getByTestId('add-to-cart-sauce-labs-bike-light')`, `getByTestId('shopping-cart-badge')`, `getByTestId('shopping-cart-link')`
2. Proceed through checkout info → Overview shows 2 items, subtotal="39.98"
   - `getByTestId('subtotal-label')`
3. Finish → confirmation header visible
   - `getByTestId('finish')`, `getByTestId('complete-header')`

---

### TC-003 | P0 | Cart displays all AC1 fields and navigation buttons
**AC:** AC1

1. Login → add Backpack → navigate to cart
   - `getByTestId('shopping-cart-link')`
2. Assert: name visible (Sauce Labs Backpack), desc visible, price ($29.99), qty (1)
   - `getByTestId('inventory-item-name')`, `getByTestId('inventory-item-desc')`, `getByTestId('inventory-item-price')`, `getByTestId('item-quantity')`
3. Assert Continue Shopping visible; Checkout visible
   - `getByTestId('continue-shopping')`, `getByTestId('checkout')`

---

### TC-004 | P0 | Order confirmation page — success, Back Home, cart cleared (AC2)
**AC:** AC2

1. Login → add Backpack → checkout → fill info → Finish
2. Assert URL `/checkout-complete.html`
3. Assert `complete-header` = "Thank you for your order!"; `complete-text` visible; `back-to-products` visible
4. Click Back Home → `/inventory.html`; assert badge not visible (cart cleared)
   - `getByTestId('complete-header')`, `getByTestId('complete-text')`, `getByTestId('back-to-products')`, `getByTestId('shopping-cart-badge')`

---

### TC-005 | P1 | Submitting empty checkout form shows error
**AC:** Business Rule — mandatory fields · **Data:** no input

1. Login → add Backpack → cart → Checkout → submit with no fields → assert `error` visible; URL stays `/checkout-step-one.html`
   - `getByTestId('error')`, `getByTestId('continue')`

---

### TC-006 | P1 | Missing first name shows error mentioning "First Name"
**AC:** Business Rule

1. Fill lastName + postalCode, leave firstName empty → Continue → `error` contains "First Name"
   - `getByTestId('error')`

---

### TC-007 | P1 | Missing last name shows error mentioning "Last Name"
**AC:** Business Rule

1. Fill firstName + postalCode, leave lastName empty → Continue → `error` contains "Last Name"

---

### TC-008 | P1 | Missing postal code shows error mentioning "Postal Code"
**AC:** Business Rule

1. Fill firstName + lastName, leave postalCode empty → Continue → `error` contains "Postal Code"

---

### TC-009 | P1 | Cancel on checkout step 1 returns to cart
**AC:** Business Rule — cancel at any step · **Data:** Backpack in cart

1. Login → add Backpack → cart → Checkout → Cancel → expect `/cart.html`; Backpack still listed
   - `getByTestId('cancel')`, `getByTestId('inventory-item-name')`

---

### TC-010 | P1 | Cancel on checkout step 2 returns to inventory
**AC:** Business Rule (FI-002: app goes to /inventory not /cart)

1. Login → add Backpack → checkout → fill info → Continue → Cancel → expect `/inventory.html`
   - `getByTestId('cancel')`

---

### TC-011 | P1 | Continue Shopping returns to products with cart intact
**AC:** AC1

1. Login → add Backpack → cart → Continue Shopping → `/inventory.html`; badge still shows 1
   - `getByTestId('continue-shopping')`, `getByTestId('shopping-cart-badge')`

---

### TC-012 | P2 | Checkout with empty cart navigates to step 1 (FI-001)
**AC:** Business Rule (defect — should block but doesn't)

1. Login → cart (empty) → Checkout → expect `/checkout-step-one.html` (actual behavior)
   - `getByTestId('checkout')`

---

### TC-013 | P1 | Wrong credentials shows error
**AC:** Business Rule — must be logged in

1. Navigate to `/` → fill wrong_user/wrong_pass → Login → `error` visible; URL stays `/`
   - `getByTestId('error')`

---

### TC-014 | P1 | Direct URL to inventory without login redirects to login
**AC:** Business Rule

1. Navigate to `/inventory.html` without session → expect URL `/`; `login-button` visible
   - `getByTestId('login-button')`

---

### TC-015 | P1 | Locked-out user sees error on login
**AC:** Business Rule

1. Login with locked_out_user/secret_sauce → `error` visible; URL stays `/`
   - `getByTestId('error')`

---

### TC-016 | P1 | Remove item from cart clears item and badge
**AC:** AC1

1. Login → add Backpack → badge=1 → cart → click remove → item gone; badge gone
   - `getByTestId('remove-sauce-labs-backpack')`, `getByTestId('shopping-cart-badge')`

---

### TC-017 | P2 | Cart badge count increments with each item
**AC:** AC1

1. Login → no badge → add Backpack → badge=1 → add Bike Light → badge=2
   - `getByTestId('shopping-cart-badge')`

---

### TC-018 | P0 | Checkout overview shows correct item details and price breakdown
**AC:** AC1, AC2

1. Login → add Backpack → checkout → fill info → Continue
2. Assert item name, price, subtotal (29.99), tax visible, total visible; Finish and Cancel present
   - `getByTestId('inventory-item-name')`, `getByTestId('inventory-item-price')`, `getByTestId('subtotal-label')`, `getByTestId('tax-label')`, `getByTestId('total-label')`, `getByTestId('finish')`, `getByTestId('cancel')`

---

### TC-019 | P2 | Whitespace-only first name is accepted (FI-003)
**AC:** Business Rule (defect — should reject)

1. Login → add Backpack → checkout → fill "   "/Doe/12345 → Continue → proceeds to `/checkout-step-two.html` (actual behavior)

---

### TC-020 | P2 | Special characters in postal code proceed to step 2
**AC:** Business Rule

1. Login → add Backpack → checkout → fill John/Doe/!@#$% → Continue → proceeds to `/checkout-step-two.html` (app accepts any non-empty value)

---

### TC-021 | P2 | Page titles on each step
**AC:** AC1, AC2

1. Inventory → title = "Products"
2. Cart → title = "Your Cart"
3. Step 1 → title = "Checkout: Your Information"
4. Step 2 → title = "Checkout: Overview"
- `getByTestId('title')`

---

## Flagged Issues

### FI-001 | Medium | Empty-cart checkout not blocked
- **Observed:** Checkout button navigates to `/checkout-step-one.html` with empty cart
- **Expected:** Block with error or disabled button
- **Page:** `/cart.html` · `getByTestId('checkout')`

### FI-002 | Low | Cancel on step 2 goes to inventory, not cart
- **Observed:** Cancel on `/checkout-step-two.html` → `/inventory.html`
- **Expected:** Return to `/cart.html`
- **Page:** `/checkout-step-two.html` · `getByTestId('cancel')`

### FI-003 | Low | Whitespace-only first name accepted
- **Observed:** Spaces-only first name passes checkout form validation
- **Expected:** Error: "First Name is required"
- **Page:** `/checkout-step-one.html` · `getByTestId('firstName')`

---

## Summary

| Priority | Count |
|---|---|
| P0 (core AC) | 5 — TC-001, TC-002, TC-003, TC-004, TC-018 |
| P1 (validation/negative) | 10 — TC-005..TC-011, TC-013, TC-014, TC-016 |
| P2 (edge/boundary) | 4 — TC-012, TC-015, TC-017, TC-019..TC-021 |
| **Total** | **19 distinct scenarios / 24 tests** |
