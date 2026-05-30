# SCRUM-101 — E-commerce Checkout Process: Test Plan

**App URL:** https://www.saucedemo.com  
**Credentials:** username=`standard_user`, password=`secret_sauce`  
**testIdAttribute:** `data-test` (saucedemo uses `data-test`, NOT `data-testid`)  
**Date:** 2026-05-30  
**Author:** QA Planner (AgenticAI Workflow — Run #5)

---

## Acceptance Criteria Reference

| AC | Description |
|----|-------------|
| AC1 | Cart Review — logged-in user sees items with name/description/price/quantity, subtotal, continue-shopping and checkout buttons |
| AC2 | Order Completion — Finish button → confirmation page with success message and Back Home button |
| BR1 | All checkout info form fields are mandatory |
| BR2 | User must be logged in to access checkout |
| BR3 | Cart cannot be empty to proceed to checkout |
| BR4 | Confirmation page clears the cart |
| BR5 | Cancel at any checkout step returns to cart |

---

## Test Cases

---

### TC-001

**ID:** TC-001  
**Priority:** P0  
**Title:** Successful login with valid credentials  
**AC:** BR2

**Test Data:**
- username: `standard_user`
- password: `secret_sauce`

**Steps:**

1. Navigate to `https://www.saucedemo.com`.
   - Expected: Login page loads; `getByTestId('username')`, `getByTestId('password')`, `getByTestId('login-button')` visible.
2. Fill `getByTestId('username')` with `standard_user`.
3. Fill `getByTestId('password')` with `secret_sauce`.
4. Click `getByTestId('login-button')`.
   - Expected: Navigates to `/inventory.html`; `getByTestId('inventory-container')` visible; `getByTestId('title')` reads "Products".

**Success Criteria:** User is on inventory page with products listed.

---

### TC-002

**ID:** TC-002  
**Priority:** P0  
**Title:** Add single item to cart and verify cart badge updates  
**AC:** AC1

**Test Data:**
- Item: Sauce Labs Backpack

**Steps:**

1. Log in with valid credentials.
2. Confirm `getByTestId('shopping-cart-badge')` is NOT present.
3. Click `getByTestId('add-to-cart-sauce-labs-backpack')`.
   - Expected: Button label changes to "Remove"; `getByTestId('shopping-cart-badge')` shows `1`.
4. Verify `getByTestId('shopping-cart-badge')` text equals `"1"`.

**Success Criteria:** Cart badge shows `1` after adding one item.

---

### TC-003

**ID:** TC-003  
**Priority:** P0  
**Title:** Full happy-path checkout with a single item  
**AC:** AC1, AC2, BR1, BR4

**Test Data:**
- Item: Sauce Labs Backpack
- First Name: `John`, Last Name: `Doe`, Postal Code: `12345`

**Steps:**

1. Log in; land on `/inventory.html`.
2. Click `getByTestId('add-to-cart-sauce-labs-backpack')` — badge shows `1`.
3. Click `getByTestId('shopping-cart-link')` — URL `/cart.html`; `getByTestId('cart-list')` shows one item.
4. Click `getByTestId('checkout')` — URL `/checkout-step-one.html`; `getByTestId('title')` reads "Checkout: Your Information".
5. Fill `getByTestId('firstName')` with `John`.
6. Fill `getByTestId('lastName')` with `Doe`.
7. Fill `getByTestId('postalCode')` with `12345`.
8. Click `getByTestId('continue')` — URL `/checkout-step-two.html`; `getByTestId('title')` reads "Checkout: Overview".
9. Verify `getByTestId('subtotal-label')` visible with dollar amount.
10. Verify `getByTestId('tax-label')` visible with dollar amount.
11. Verify `getByTestId('total-label')` visible with dollar amount.
12. Click `getByTestId('finish')` — URL `/checkout-complete.html`.
13. Verify `getByTestId('complete-header')` text = `"Thank you for your order!"`.
14. Verify `getByTestId('complete-text')` visible.
15. Verify `getByTestId('back-to-products')` visible.
16. Verify `getByTestId('shopping-cart-badge')` NOT present (cart cleared).

**Success Criteria:** Confirmation page shows success message; cart badge absent.

---

### TC-004

**ID:** TC-004  
**Priority:** P0  
**Title:** Full happy-path checkout with multiple items  
**AC:** AC1, AC2, BR1, BR4

**Test Data:**
- Items: Sauce Labs Backpack, Sauce Labs Bike Light
- First Name: `Jane`, Last Name: `Smith`, Postal Code: `90210`

**Steps:**

1. Log in; land on `/inventory.html`.
2. Click `getByTestId('add-to-cart-sauce-labs-backpack')`.
3. Click `getByTestId('add-to-cart-sauce-labs-bike-light')` — badge shows `2`.
4. Click `getByTestId('shopping-cart-link')` — cart shows two items.
5. Click `getByTestId('checkout')`.
6. Fill info: `Jane` / `Smith` / `90210`; click `getByTestId('continue')`.
7. On overview: verify both `getByTestId('inventory-item-name')` elements visible.
8. Click `getByTestId('finish')` — URL `/checkout-complete.html`.
9. Verify `getByTestId('complete-header')` = `"Thank you for your order!"`.
10. Verify `getByTestId('shopping-cart-badge')` NOT present.

**Success Criteria:** Multi-item order completes; cart clears.

---

### TC-005

**ID:** TC-005  
**Priority:** P0  
**Title:** Verify cart item details (name, description, price, quantity)  
**AC:** AC1

**Test Data:**
- Item: Sauce Labs Backpack

**Steps:**

1. Log in; add Sauce Labs Backpack; click `getByTestId('shopping-cart-link')`.
2. Verify `getByTestId('inventory-item-name')` visible and non-empty.
3. Verify `getByTestId('inventory-item-desc')` visible and non-empty.
4. Verify `getByTestId('inventory-item-price')` text matches `$XX.XX`.
5. Verify `getByTestId('item-quantity')` shows `1`.
6. Verify `getByTestId('continue-shopping')` visible.
7. Verify `getByTestId('checkout')` visible.

**Success Criteria:** All four item attributes display; both action buttons present.

---

### TC-006

**ID:** TC-006  
**Priority:** P0  
**Title:** Order confirmation page details are complete  
**AC:** AC2

**Steps:**

1. Complete full checkout (TC-003 flow); arrive at `/checkout-complete.html`.
2. Verify `getByTestId('title')` text = `"Checkout: Complete!"`.
3. Verify `getByTestId('complete-header')` text = `"Thank you for your order!"`.
4. Verify `getByTestId('complete-text')` visible and non-empty.
5. Verify `getByTestId('back-to-products')` visible and enabled.
6. Click `getByTestId('back-to-products')` — URL `/inventory.html`; `getByTestId('inventory-container')` visible.

**Success Criteria:** All confirmation elements render; Back Home navigates to inventory.

---

### TC-007

**ID:** TC-007  
**Priority:** P1  
**Title:** Login fails with invalid credentials  
**AC:** BR2

**Test Data:**
- username: `wrong_user`, password: `wrong_pass`

**Steps:**

1. Navigate to `https://www.saucedemo.com`.
2. Fill username `wrong_user`, password `wrong_pass`.
3. Click `getByTestId('login-button')`.
   - Expected: URL stays at `/`; `getByTestId('error')` visible.
4. Verify error text includes "Username and password do not match".
5. Verify `getByTestId('inventory-container')` NOT visible.

**Success Criteria:** Error shown; user stays on login page.

---

### TC-008

**ID:** TC-008  
**Priority:** P1  
**Title:** Empty cart checkout navigates to step 1 without blocking (known defect FI-001)  
**AC:** BR3

**Steps:**

1. Log in; confirm `getByTestId('shopping-cart-badge')` NOT present.
2. Click `getByTestId('shopping-cart-link')` — `/cart.html` with no items.
3. Click `getByTestId('checkout')`.
   - **Known Defect FI-001:** App navigates to `/checkout-step-one.html` instead of blocking.
4. Verify URL is `/checkout-step-one.html` (documenting actual behavior).

**Expected (ideal):** Error shown or checkout disabled for empty cart.  
**Actual (defect):** Proceeds to checkout step 1 with no items.

---

### TC-009

**ID:** TC-009  
**Priority:** P1  
**Title:** Missing first name triggers validation error  
**AC:** BR1

**Test Data:** First Name: (empty), Last Name: `Doe`, Postal Code: `12345`

**Steps:**

1. Log in; add Sauce Labs Backpack; navigate to `/checkout-step-one.html`.
2. Leave `getByTestId('firstName')` empty.
3. Fill `getByTestId('lastName')` with `Doe`; fill `getByTestId('postalCode')` with `12345`.
4. Click `getByTestId('continue')`.
   - Expected: URL stays `/checkout-step-one.html`; `getByTestId('error')` visible.
5. Verify error text includes "First Name is required".

**Success Criteria:** Error displayed; form not submitted.

---

### TC-010

**ID:** TC-010  
**Priority:** P1  
**Title:** Missing last name triggers validation error  
**AC:** BR1

**Test Data:** First Name: `John`, Last Name: (empty), Postal Code: `12345`

**Steps:**

1. Log in; add Sauce Labs Backpack; navigate to `/checkout-step-one.html`.
2. Fill `getByTestId('firstName')` with `John`; leave `getByTestId('lastName')` empty; fill `getByTestId('postalCode')` with `12345`.
3. Click `getByTestId('continue')`.
   - Expected: `getByTestId('error')` visible with "Last Name is required".

**Success Criteria:** Error displayed; form not submitted.

---

### TC-011

**ID:** TC-011  
**Priority:** P1  
**Title:** Missing postal code triggers validation error  
**AC:** BR1

**Test Data:** First Name: `John`, Last Name: `Doe`, Postal Code: (empty)

**Steps:**

1. Log in; add Sauce Labs Backpack; navigate to `/checkout-step-one.html`.
2. Fill `getByTestId('firstName')` with `John`; fill `getByTestId('lastName')` with `Doe`; leave `getByTestId('postalCode')` empty.
3. Click `getByTestId('continue')`.
   - Expected: `getByTestId('error')` visible with "Postal Code is required".

**Success Criteria:** Error displayed; form not submitted.

---

### TC-012

**ID:** TC-012  
**Priority:** P1  
**Title:** Cancel on checkout step 1 returns to cart  
**AC:** BR5

**Steps:**

1. Log in; add Sauce Labs Backpack; navigate to `/checkout-step-one.html`.
2. Fill `getByTestId('firstName')` with `John` (partial).
3. Click `getByTestId('cancel')`.
   - Expected: URL `/cart.html`; `getByTestId('inventory-item-name')` still visible in cart.

**Success Criteria:** Returns to cart with item still present.

---

### TC-013

**ID:** TC-013  
**Priority:** P1  
**Title:** Cancel on checkout step 2 goes to inventory not cart (known defect FI-002)  
**AC:** BR5

**Test Data:** Item: Sauce Labs Backpack; First Name: `John`, Last Name: `Doe`, Postal Code: `12345`

**Steps:**

1. Log in; add Sauce Labs Backpack; complete checkout info form; arrive at `/checkout-step-two.html`.
2. Verify `getByTestId('title')` = "Checkout: Overview".
3. Click `getByTestId('cancel')`.
   - **Known Defect FI-002:** Navigates to `/inventory.html` instead of `/cart.html`.
4. Verify actual URL (documents defect).

**Expected (ideal):** `/cart.html` per BR5.  
**Actual (defect):** `/inventory.html`.

---

### TC-014

**ID:** TC-014  
**Priority:** P1  
**Title:** Logout via burger menu  
**AC:** BR2

**Steps:**

1. Log in; land on `/inventory.html`.
2. Click `getByRole('button', { name: 'Open Menu' })` — sidebar opens; `getByTestId('logout-sidebar-link')` visible.
3. Click `getByTestId('logout-sidebar-link')`.
   - Expected: URL `/`; login form visible.
4. Navigate to `/inventory.html` directly — redirected back to login.

**Success Criteria:** User fully logged out; protected routes redirect to login.

---

### TC-015

**ID:** TC-015  
**Priority:** P1  
**Title:** Remove item from cart  
**AC:** AC1

**Steps:**

1. Log in; add Sauce Labs Backpack; click `getByTestId('shopping-cart-link')`.
2. Verify `getByTestId('shopping-cart-badge')` shows `1`; item visible in `getByTestId('cart-list')`.
3. Click `getByTestId('remove-sauce-labs-backpack')`.
   - Expected: Item row gone; `getByTestId('shopping-cart-badge')` NOT present.
4. Verify cart-list contains no item rows.

**Success Criteria:** Cart empty after removal; badge disappears.

---

### TC-016

**ID:** TC-016  
**Priority:** P2  
**Title:** Cart badge count handles two items (boundary)  
**AC:** AC1

**Test Data:** Items: Sauce Labs Backpack, Sauce Labs Bike Light

**Steps:**

1. Log in; confirm badge NOT present.
2. Click `getByTestId('add-to-cart-sauce-labs-backpack')` — badge shows `1`.
3. Click `getByTestId('add-to-cart-sauce-labs-bike-light')` — badge shows `2`.
4. Click `getByTestId('shopping-cart-link')`.
5. Verify two item rows in `getByTestId('cart-list')`.

**Success Criteria:** Badge accurately shows `2`; both items in cart.

---

### TC-017

**ID:** TC-017  
**Priority:** P2  
**Title:** Whitespace-only first name accepted without validation (known defect FI-003)  
**AC:** BR1

**Test Data:** First Name: `   ` (spaces), Last Name: `Doe`, Postal Code: `12345`

**Steps:**

1. Log in; add Sauce Labs Backpack; navigate to `/checkout-step-one.html`.
2. Fill `getByTestId('firstName')` with `   ` (spaces only).
3. Fill `getByTestId('lastName')` with `Doe`; fill `getByTestId('postalCode')` with `12345`.
4. Click `getByTestId('continue')`.
   - **Known Defect FI-003:** App proceeds to `/checkout-step-two.html` without error.

**Expected (ideal):** Validation error shown.  
**Actual (defect):** Form submits with whitespace-only first name.

---

### TC-018

**ID:** TC-018  
**Priority:** P2  
**Title:** Price totals math — subtotal + tax = total  
**AC:** AC1, AC2

**Test Data:** Items: Sauce Labs Backpack ($29.99), Sauce Labs Bike Light ($9.99) — subtotal $39.98

**Steps:**

1. Log in; add both items; proceed through checkout info (`John`/`Doe`/`12345`); arrive at overview.
2. Read `getByTestId('subtotal-label')` — parse dollar amount; expect `$39.98`.
3. Read `getByTestId('tax-label')` — parse dollar amount (> $0.00).
4. Read `getByTestId('total-label')` — parse dollar amount.
5. Verify: subtotal + tax ≈ total (±$0.01).

**Success Criteria:** Total = subtotal + tax with no unexpected rounding.

---

### TC-019

**ID:** TC-019  
**Priority:** P2  
**Title:** Cart persists after navigating away via continue shopping  
**AC:** AC1

**Steps:**

1. Log in; add Sauce Labs Backpack — badge shows `1`.
2. Click `getByTestId('shopping-cart-link')`.
3. Click `getByTestId('continue-shopping')` — URL `/inventory.html`; badge still shows `1`.
4. Click `getByTestId('shopping-cart-link')` again.
5. Verify Sauce Labs Backpack still in cart (`getByTestId('inventory-item-name')` visible).

**Success Criteria:** Item preserved after continue-shopping navigation.

---

### TC-020

**ID:** TC-020  
**Priority:** P2  
**Title:** Cart clears after order is completed  
**AC:** BR4

**Steps:**

1. Complete full checkout (TC-003); arrive at `/checkout-complete.html`.
2. Verify `getByTestId('shopping-cart-badge')` NOT present.
3. Click `getByTestId('back-to-products')` — `/inventory.html`.
4. Verify badge still NOT present.
5. Click `getByTestId('shopping-cart-link')` — `/cart.html` with no items.

**Success Criteria:** Cart empty after order; persists as empty on inventory.

---

### TC-021

**ID:** TC-021  
**Priority:** P2  
**Title:** Burger menu opens and closes correctly  
**AC:** (Navigation UX)

**Steps:**

1. Log in; land on `/inventory.html`.
2. Click `getByRole('button', { name: 'Open Menu' })` — sidebar visible; `getByTestId('logout-sidebar-link')` visible.
3. Press Escape — sidebar closes; `getByTestId('logout-sidebar-link')` NOT visible.
4. Verify `getByTestId('inventory-container')` still visible.

**Success Criteria:** Menu opens and closes; page state intact.

---

### TC-022

**ID:** TC-022  
**Priority:** P2  
**Title:** Multi-item cart review shows all items with correct details  
**AC:** AC1

**Test Data:** Items: Sauce Labs Backpack ($29.99), Sauce Labs Bike Light ($9.99)

**Steps:**

1. Log in; add both items; click `getByTestId('shopping-cart-link')` — badge `2`.
2. Verify two item rows in `getByTestId('cart-list')`.
3. For each row: `getByTestId('inventory-item-name')` non-empty, `getByTestId('inventory-item-desc')` non-empty, `getByTestId('inventory-item-price')` matches `$XX.XX`, `getByTestId('item-quantity')` = `1`.
4. Verify `getByTestId('continue-shopping')` and `getByTestId('checkout')` visible.

**Success Criteria:** Both items fully described; action buttons present.

---

### TC-023

**ID:** TC-023  
**Priority:** P2  
**Title:** No order reference number on confirmation page (known defect FI-004)  
**AC:** AC2

**Steps:**

1. Complete full checkout; arrive at `/checkout-complete.html`.
2. Verify `getByTestId('complete-header')` and `getByTestId('complete-text')` contain no numeric order reference.
   - **Known Defect FI-004:** No order reference number shown.

**Expected (ideal):** Unique order ID visible.  
**Actual (defect):** No order reference number present.

---

## Flagged Issues

| ID | Severity | Description |
|----|----------|-------------|
| FI-001 | Medium | Empty cart checkout not blocked — clicking Checkout on an empty cart navigates to `/checkout-step-one.html`. Expected: error or disabled button. |
| FI-002 | Medium | Cancel on overview (step 2) navigates to `/inventory.html` instead of `/cart.html`. Violates BR5. |
| FI-003 | Low | Whitespace-only first name accepted by info form. Expected: trim-and-reject. |
| FI-004 | Low | No order reference number on confirmation page. |

---

## Selector Reference

| Element | Selector |
|---------|----------|
| Username input | `getByTestId('username')` |
| Password input | `getByTestId('password')` |
| Login button | `getByTestId('login-button')` |
| Cart link | `getByTestId('shopping-cart-link')` |
| Cart badge | `getByTestId('shopping-cart-badge')` |
| Add backpack | `getByTestId('add-to-cart-sauce-labs-backpack')` |
| Add bike light | `getByTestId('add-to-cart-sauce-labs-bike-light')` |
| Remove backpack | `getByTestId('remove-sauce-labs-backpack')` |
| Item name | `getByTestId('inventory-item-name')` |
| Item description | `getByTestId('inventory-item-desc')` |
| Item price | `getByTestId('inventory-item-price')` |
| Item quantity | `getByTestId('item-quantity')` |
| Continue shopping | `getByTestId('continue-shopping')` |
| Checkout button | `getByTestId('checkout')` |
| First name | `getByTestId('firstName')` |
| Last name | `getByTestId('lastName')` |
| Postal code | `getByTestId('postalCode')` |
| Continue (info form) | `getByTestId('continue')` |
| Cancel | `getByTestId('cancel')` |
| Error container | `getByTestId('error')` |
| Subtotal label | `getByTestId('subtotal-label')` |
| Tax label | `getByTestId('tax-label')` |
| Total label | `getByTestId('total-label')` |
| Finish button | `getByTestId('finish')` |
| Payment info | `getByTestId('payment-info-label')` |
| Shipping info | `getByTestId('shipping-info-label')` |
| Confirmation header | `getByTestId('complete-header')` |
| Confirmation text | `getByTestId('complete-text')` |
| Back to products | `getByTestId('back-to-products')` |
| Page title | `getByTestId('title')` |
| Cart list | `getByTestId('cart-list')` |
| Inventory container | `getByTestId('inventory-container')` |
| Burger menu | `getByRole('button', { name: 'Open Menu' })` |
| Logout link | `getByTestId('logout-sidebar-link')` |

> **Note:** `testIdAttribute` must be `'data-test'` in playwright.config.ts. Saucedemo uses `data-test`, not `data-testid`.
