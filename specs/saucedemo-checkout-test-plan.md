# Saucedemo Checkout Workflow — Test Plan
**SCRUM-101 | Checkout Flow QA**

---

## Overview

**Application Under Test:** https://www.saucedemo.com
**Feature:** End-to-end checkout workflow
**Test Credentials:** username: `standard_user` | password: `secret_sauce`
**Date Created:** 2026-05-28
**Coverage:** AC1 (Cart Review), AC2 (Checkout Info), AC3 (Order Overview), AC4 (Order Completion), AC5 (Error Handling)

---

## URLs and Selectors Reference

| Page | URL |
|------|-----|
| Login | `https://www.saucedemo.com/` |
| Products / Inventory | `https://www.saucedemo.com/inventory.html` |
| Cart | `https://www.saucedemo.com/cart.html` |
| Checkout Step 1 (Info) | `https://www.saucedemo.com/checkout-step-one.html` |
| Checkout Step 2 (Overview) | `https://www.saucedemo.com/checkout-step-two.html` |
| Order Complete | `https://www.saucedemo.com/checkout-complete.html` |

| Element | Selector / data-test ID |
|---------|------------------------|
| Username input | `#user-name` |
| Password input | `#password` |
| Login button | `#login-button` |
| Add to cart (Backpack) | `#add-to-cart-sauce-labs-backpack` |
| Add to cart (Bike Light) | `#add-to-cart-sauce-labs-bike-light` |
| Cart icon | `#shopping_cart_container` |
| Cart badge | `.shopping_cart_badge` |
| Continue Shopping | `#continue-shopping` |
| Checkout button | `#checkout` |
| First Name input | `#first-name` |
| Last Name input | `#last-name` |
| Zip/Postal Code input | `#postal-code` |
| Continue button | `#continue` |
| Cancel button | `#cancel` |
| Error message container | `[data-test="error"]` |
| Finish button | `#finish` |
| Back Home button | `#back-to-products` |
| Item name in cart | `.inventory_item_name` |
| Item description | `.inventory_item_desc` |
| Item price | `.inventory_item_price` |
| Item quantity | `.cart_quantity` |
| Subtotal label | `.summary_subtotal_label` |
| Tax label | `.summary_tax_label` |
| Total label | `.summary_total_label` |
| Payment info | `.summary_value_label` (first) |
| Shipping info | `.summary_value_label` (second) |
| Complete header | `.complete-header` |
| Complete text | `.complete-text` |

---

## Test Cases

---

### TC-001 — Happy Path: Single Item Checkout End-to-End

**Acceptance Criteria:** AC1, AC2, AC3, AC4
**Priority:** Critical

**Preconditions:**
- Browser is open with a fresh/blank session (no prior login, no cookies)
- Application is accessible at https://www.saucedemo.com

**Test Data:**
- Username: `standard_user`
- Password: `secret_sauce`
- First Name: `John`
- Last Name: `Doe`
- Zip/Postal Code: `12345`
- Product: Sauce Labs Backpack ($29.99)

**Steps:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `https://www.saucedemo.com` | Login page is displayed with username field, password field, and login button |
| 2 | Enter `standard_user` in the Username field | Text is entered in the field |
| 3 | Enter `secret_sauce` in the Password field | Password is masked/hidden |
| 4 | Click the Login button | User is redirected to `https://www.saucedemo.com/inventory.html`; product catalog is displayed |
| 5 | Click "Add to cart" next to "Sauce Labs Backpack" | Button changes to "Remove"; cart badge in top-right shows `1` |
| 6 | Click the cart icon in the top-right corner | User is redirected to `https://www.saucedemo.com/cart.html` |
| 7 | Verify cart contents | Sauce Labs Backpack is listed with: correct name, description, price ($29.99), quantity (1) |
| 8 | Click the "Checkout" button | User is redirected to `https://www.saucedemo.com/checkout-step-one.html`; form with First Name, Last Name, Zip/Postal Code fields is displayed |
| 9 | Enter `John` in First Name field | Text appears in field |
| 10 | Enter `Doe` in Last Name field | Text appears in field |
| 11 | Enter `12345` in Zip/Postal Code field | Text appears in field |
| 12 | Click "Continue" | User is redirected to `https://www.saucedemo.com/checkout-step-two.html`; order overview is displayed |
| 13 | Verify overview shows: item name, item price, payment info, shipping info, subtotal, tax, total | All items and totals are visible; subtotal = $29.99; total = subtotal + tax |
| 14 | Click the "Finish" button | User is redirected to `https://www.saucedemo.com/checkout-complete.html` |
| 15 | Verify success message | Header reads "Thank you for your order!"; confirmation text is displayed |
| 16 | Verify "Back Home" button is visible | Button labeled "Back Home" is present on the page |

---

### TC-002 — Cart Review: Multiple Items Display

**Acceptance Criteria:** AC1
**Priority:** High

**Preconditions:**
- Fresh browser session

**Test Data:**
- Username: `standard_user`, Password: `secret_sauce`
- Products: Sauce Labs Backpack ($29.99), Sauce Labs Bike Light ($9.99)

**Steps:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in with `standard_user` / `secret_sauce` | User is on the inventory page |
| 2 | Click "Add to cart" next to "Sauce Labs Backpack" | Cart badge shows `1` |
| 3 | Click "Add to cart" next to "Sauce Labs Bike Light" | Cart badge shows `2` |
| 4 | Click the cart icon | User is on `https://www.saucedemo.com/cart.html` |
| 5 | Verify both items are listed with name, description, price, quantity | Both items display correctly |
| 6 | Verify "Continue Shopping" and "Checkout" buttons are present | Both buttons visible |
| 7 | Click "Continue Shopping" | User returns to `/inventory.html`; cart badge still shows `2` |

---

### TC-003 — Checkout Form Validation: Empty First Name

**Acceptance Criteria:** AC2, AC5
**Priority:** High

**Test Data:** Leave First Name empty; Last Name = `Doe`; Zip = `12345`

**Steps:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in, add Sauce Labs Backpack to cart, navigate to checkout info | On `/checkout-step-one.html` |
| 2 | Leave First Name empty; enter `Doe` / `12345` | Only Last Name and Zip filled |
| 3 | Click "Continue" | Error message: "Error: First Name is required"; URL unchanged |

---

### TC-004 — Checkout Form Validation: Empty Last Name

**Acceptance Criteria:** AC2, AC5
**Priority:** High

**Test Data:** First Name = `John`; leave Last Name empty; Zip = `12345`

**Steps:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in, add item, navigate to checkout info | On `/checkout-step-one.html` |
| 2 | Enter `John`, leave Last Name empty, enter `12345` | Only First Name and Zip filled |
| 3 | Click "Continue" | Error message: "Error: Last Name is required"; URL unchanged |

---

### TC-005 — Checkout Form Validation: Empty Zip/Postal Code

**Acceptance Criteria:** AC2, AC5
**Priority:** High

**Test Data:** First Name = `John`; Last Name = `Doe`; leave Zip empty

**Steps:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in, add item, navigate to checkout info | On `/checkout-step-one.html` |
| 2 | Enter `John` / `Doe`; leave Zip empty | Only First Name and Last Name filled |
| 3 | Click "Continue" | Error message: "Error: Postal Code is required"; URL unchanged |

---

### TC-006 — Checkout Form Validation: All Fields Empty

**Acceptance Criteria:** AC2, AC5
**Priority:** High

**Steps:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in, add item, navigate to checkout info | On `/checkout-step-one.html` |
| 2 | Leave all fields empty | All fields blank |
| 3 | Click "Continue" | Validation error shown; URL unchanged |

---

### TC-007 — Order Overview: Verify All Details

**Acceptance Criteria:** AC3
**Priority:** High

**Test Data:** Both Backpack ($29.99) and Bike Light ($9.99); First Name = `John`, Last Name = `Doe`, Zip = `12345`

**Steps:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in, add both products, navigate to checkout overview | On `/checkout-step-two.html` |
| 2 | Verify both items listed with prices | Backpack $29.99, Bike Light $9.99 shown |
| 3 | Verify payment and shipping info sections | Both sections present |
| 4 | Verify subtotal = `Item total: $39.98` | Correct sum |
| 5 | Verify tax is shown | Tax value displayed |
| 6 | Verify total = `Total: $43.18` | Subtotal + tax |
| 7 | Verify Cancel and Finish buttons are present | Both visible |

---

### TC-008 — Cancel Checkout from Overview Page

**Acceptance Criteria:** AC3
**Priority:** Medium

**Steps:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Reach checkout overview page with one item | On `/checkout-step-two.html` |
| 2 | Click "Cancel" | Redirected to `/inventory.html` |
| 3 | Verify cart still has the item | Cart badge shows `1` |

---

### TC-009 — Order Completion Confirmation

**Acceptance Criteria:** AC4
**Priority:** Critical

**Steps:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Complete checkout through overview page | On `/checkout-step-two.html` |
| 2 | Click "Finish" | Redirected to `/checkout-complete.html` |
| 3 | Verify heading "Thank you for your order!" | Success heading present |
| 4 | Verify confirmation text and image | Dispatch confirmation text visible |
| 5 | Verify "Back Home" button is present | Button visible |

---

### TC-010 — Back Home Button Navigation After Order Completion

**Acceptance Criteria:** AC4
**Priority:** High

**Steps:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Complete full checkout, land on `/checkout-complete.html` | Success page shown |
| 2 | Click "Back Home" | Redirected to `/inventory.html` |
| 3 | Verify cart is empty | Cart badge not displayed |

---

### TC-011 — Checkout with Special Characters in Form Fields

**Acceptance Criteria:** AC2, AC5
**Priority:** Medium

**Test Data:** First Name = `José`, Last Name = `O'Brien`, Zip = `SW1A 1AA`

**Steps:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in, add item, navigate to checkout info | On `/checkout-step-one.html` |
| 2 | Enter special character data in all fields | Characters accepted and displayed |
| 3 | Click "Continue" | Redirected to overview without errors |
| 4 | Click "Finish" | Order completes successfully |

---

### TC-012 — URL Verification at Each Checkout Step

**Acceptance Criteria:** AC1, AC2, AC3, AC4
**Priority:** Medium

**Steps:**

| Step | Action | Expected URL |
|------|--------|-------------|
| 1 | Navigate to app | `/` |
| 2 | Log in | `/inventory.html` |
| 3 | Click cart icon | `/cart.html` |
| 4 | Click Checkout | `/checkout-step-one.html` |
| 5 | Fill form and click Continue | `/checkout-step-two.html` |
| 6 | Click Finish | `/checkout-complete.html` |
| 7 | Click Back Home | `/inventory.html` |

---

### TC-013 — Cancel Checkout from Info Form Page

**Acceptance Criteria:** AC2
**Priority:** Medium

**Steps:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to checkout info page with item in cart | On `/checkout-step-one.html` |
| 2 | Click "Cancel" | Redirected to `/cart.html`; item still in cart |

---

### TC-014 — Remove Item from Cart Before Checkout

**Acceptance Criteria:** AC1
**Priority:** Medium

**Steps:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in, add Backpack and Bike Light to cart | Badge shows `2` |
| 2 | On cart page, click "Remove" next to Bike Light | Only Backpack remains; badge shows `1` |
| 3 | Complete checkout | Overview shows only Backpack; subtotal = $29.99 |

---

### TC-015 — Happy Path: Multiple Items Checkout End-to-End

**Acceptance Criteria:** AC1, AC2, AC3, AC4
**Priority:** Critical

**Test Data:** Both Backpack ($29.99) and Bike Light ($9.99); subtotal = $39.98; tax = $3.20; total = $43.18

**Steps:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in, add both items | Badge shows `2` |
| 2 | Cart shows both items correctly | Names, prices, quantities correct |
| 3 | Complete checkout form and navigate to overview | Overview shows both items with correct totals |
| 4 | Click Finish | Confirmation page shown |
| 5 | Click Back Home | Returns to inventory; cart empty |

---

## Test Coverage Matrix

| Test Case | AC1 Cart Review | AC2 Checkout Info | AC3 Order Overview | AC4 Order Complete | AC5 Error Handling |
|-----------|:--------------:|:-----------------:|:------------------:|:------------------:|:-----------------:|
| TC-001 Happy Path Single Item | X | X | X | X | |
| TC-002 Cart Review Multiple Items | X | | | | |
| TC-003 Validation Empty First Name | | X | | | X |
| TC-004 Validation Empty Last Name | | X | | | X |
| TC-005 Validation Empty Zip Code | | X | | | X |
| TC-006 Validation All Fields Empty | | X | | | X |
| TC-007 Order Overview Details | | | X | | |
| TC-008 Cancel from Overview | | | X | | |
| TC-009 Order Completion Confirmation | | | | X | |
| TC-010 Back Home Navigation | | | | X | |
| TC-011 Special Characters in Form | | X | | | X |
| TC-012 URL Verification Each Step | X | X | X | X | |
| TC-013 Cancel from Info Form | | X | | | |
| TC-014 Remove Item from Cart | X | | X | | |
| TC-015 Happy Path Multiple Items | X | X | X | X | |

---

## Assumptions

1. Application is available at `https://www.saucedemo.com` during test execution.
2. Credentials `standard_user` / `secret_sauce` provide fully functional access.
3. Each test starts from a fresh browser state (no cookies, local storage, or session data).
4. Tax rate is fixed at ~8% (observed: $39.98 subtotal → $3.20 tax).
5. Product prices: Sauce Labs Backpack = $29.99, Sauce Labs Bike Light = $9.99.
6. Cancel on checkout info page → returns to cart; Cancel on overview page → returns to inventory.
