# SCRUM-101 Checkout Test Plan

## Summary

- **Application URL:** https://www.saucedemo.com
- **Credentials:** username=`standard_user`, password=`secret_sauce`
- **Scope:** Full checkout flow — Login → Inventory → Cart → Checkout Step 1 (Info) → Checkout Step 2 (Overview) → Order Complete → Back to Products
- **Acceptance Criteria (AC):**
  - AC1: User can add items to cart and proceed to checkout
  - AC2: User must provide valid first name, last name, and postal code to continue
  - AC3: Checkout overview displays correct item list, pricing, and totals
  - AC4: User can complete an order and see confirmation page
  - AC5: Cancel/back navigation returns user to the appropriate prior page
  - AC6: Form validation blocks empty or whitespace-only fields
- **Total Test Cases:** 21
- **Priority Breakdown:** P0 (6), P1 (9), P2 (6)

---

## Test Cases

### TC-001 — Successful Login with Valid Credentials
- **Priority:** P0
- **AC:** AC1
- **Preconditions:** Browser opened to https://www.saucedemo.com; no prior session
- **Steps:**
  1. Navigate to https://www.saucedemo.com → Login page displayed with username and password fields | Locator: `getByTestId('username')`, `getByTestId('password')`
  2. Fill username field with `standard_user` | Locator: `getByTestId('username')`
  3. Fill password field with `secret_sauce` | Locator: `getByTestId('password')`
  4. Click the Login button → User is redirected to `/inventory.html` | Locator: `getByTestId('login-button')`
- **Expected Result:** Page URL becomes `https://www.saucedemo.com/inventory.html`; product grid is visible with at least 6 items
- **Test data:** username=`standard_user`, password=`secret_sauce`

---

### TC-002 — Add Single Item to Cart from Inventory Page
- **Priority:** P0
- **AC:** AC1
- **Preconditions:** Logged in as `standard_user`; on `/inventory.html`
- **Steps:**
  1. Locate the "Sauce Labs Backpack" product card | Locator: `getByTestId('inventory-item')`
  2. Click "Add to cart" button for Sauce Labs Backpack → Button label changes to "Remove" | Locator: `getByTestId('add-to-cart-sauce-labs-backpack')`
  3. Observe the cart icon badge in the top-right header → Badge displays "1" | Locator: `getByTestId('shopping-cart-badge')`
- **Expected Result:** Cart badge shows "1"; button for Sauce Labs Backpack reads "Remove"
- **Test data:** Item: Sauce Labs Backpack ($29.99)

---

### TC-003 — Add Multiple Items to Cart
- **Priority:** P0
- **AC:** AC1
- **Preconditions:** Logged in as `standard_user`; on `/inventory.html`; cart is empty
- **Steps:**
  1. Click "Add to cart" for Sauce Labs Backpack → Badge shows "1" | Locator: `getByTestId('add-to-cart-sauce-labs-backpack')`
  2. Click "Add to cart" for Sauce Labs Bike Light → Badge shows "2" | Locator: `getByTestId('add-to-cart-sauce-labs-bike-light')`
  3. Click the shopping cart icon → Navigates to `/cart.html` | Locator: `getByTestId('shopping-cart-link')`
  4. Verify both items are listed in the cart | Locator: `getByTestId('cart-item')`
- **Expected Result:** Cart page shows 2 items: Sauce Labs Backpack and Sauce Labs Bike Light with correct names and prices
- **Test data:** Items: Sauce Labs Backpack ($29.99), Sauce Labs Bike Light ($9.99)

---

### TC-004 — Navigate to Cart via Cart Icon
- **Priority:** P0
- **AC:** AC1
- **Preconditions:** Logged in; at least 1 item in cart; on any page
- **Steps:**
  1. Click the shopping cart icon in the header | Locator: `getByTestId('shopping-cart-link')`
  2. Verify URL changes to `/cart.html` → Cart page is displayed
  3. Confirm "Your Cart" heading is visible | Locator: `getByRole('heading', { name: 'Your Cart' })`
  4. Confirm cart list container is present | Locator: `getByTestId('cart-list')`
- **Expected Result:** URL is `/cart.html`; cart contents are displayed; "Checkout" and "Continue Shopping" buttons are visible

---

### TC-005 — Happy Path: Full Checkout Flow End-to-End
- **Priority:** P0
- **AC:** AC1, AC2, AC3, AC4
- **Preconditions:** Logged in as `standard_user`; cart is empty
- **Steps:**
  1. On `/inventory.html`, click "Add to cart" for Sauce Labs Backpack | Locator: `getByTestId('add-to-cart-sauce-labs-backpack')`
  2. Click cart icon → Navigate to `/cart.html` | Locator: `getByTestId('shopping-cart-link')`
  3. Click "Checkout" button → Navigate to `/checkout-step-one.html` | Locator: `getByTestId('checkout')`
  4. Fill "First Name" field with `John` | Locator: `getByTestId('firstName')`
  5. Fill "Last Name" field with `Doe` | Locator: `getByTestId('lastName')`
  6. Fill "Zip/Postal Code" field with `12345` | Locator: `getByTestId('postalCode')`
  7. Click "Continue" button → Navigate to `/checkout-step-two.html` | Locator: `getByTestId('continue')`
  8. Verify order summary shows Sauce Labs Backpack at $29.99
  9. Verify "Item total", "Tax", and "Total" values are displayed | Locator: `getByTestId('subtotal-label')`, `getByTestId('tax-label')`, `getByTestId('total-label')`
  10. Click "Finish" button → Navigate to `/checkout-complete.html` | Locator: `getByTestId('finish')`
  11. Verify confirmation heading reads "Thank you for your order!" | Locator: `getByTestId('complete-header')`
  12. Verify confirmation text is present | Locator: `getByTestId('complete-text')`
- **Expected Result:** User reaches `/checkout-complete.html` with "Thank you for your order!" message; order is placed successfully
- **Test data:** First Name=`John`, Last Name=`Doe`, Postal Code=`12345`

---

### TC-006 — Return to Inventory After Order Completion
- **Priority:** P0
- **AC:** AC4, AC5
- **Preconditions:** User has just completed checkout; on `/checkout-complete.html`
- **Steps:**
  1. Verify "Back Home" button is present | Locator: `getByTestId('back-to-products')`
  2. Click "Back Home" button → Navigate to `/inventory.html` | Locator: `getByTestId('back-to-products')`
  3. Verify inventory page is displayed with product grid
  4. Verify cart badge is absent (cart cleared after order)
- **Expected Result:** User is on `/inventory.html`; cart is empty; all "Add to cart" buttons are in default state

---

### TC-007 — Login Failure: Invalid Username
- **Priority:** P1
- **AC:** AC1
- **Preconditions:** Browser on https://www.saucedemo.com; no active session
- **Steps:**
  1. Fill username with `invalid_user` | Locator: `getByTestId('username')`
  2. Fill password with `secret_sauce` | Locator: `getByTestId('password')`
  3. Click "Login" button | Locator: `getByTestId('login-button')`
  4. Verify error message is displayed | Locator: `getByTestId('error')`
- **Expected Result:** Error message reads "Epic sadface: Username and password do not match any user in this service"; user remains on login page
- **Test data:** username=`invalid_user`, password=`secret_sauce`

---

### TC-008 — Login Failure: Empty Credentials
- **Priority:** P1
- **AC:** AC1
- **Preconditions:** Browser on https://www.saucedemo.com
- **Steps:**
  1. Leave username and password fields empty
  2. Click "Login" button | Locator: `getByTestId('login-button')`
  3. Verify error message is shown | Locator: `getByTestId('error')`
- **Expected Result:** Error message reads "Epic sadface: Username is required"; user stays on login page

---

### TC-009 — Checkout Step 1: Submit With All Fields Empty
- **Priority:** P1
- **AC:** AC2
- **Preconditions:** Logged in; 1+ items in cart; on `/checkout-step-one.html`
- **Steps:**
  1. Leave First Name, Last Name, and Postal Code fields empty
  2. Click "Continue" button | Locator: `getByTestId('continue')`
  3. Verify error message is displayed | Locator: `getByTestId('error')`
- **Expected Result:** Error message reads "Error: First Name is required"; user remains on `/checkout-step-one.html`
- **Test data:** All fields blank

---

### TC-010 — Checkout Step 1: Submit With Missing Last Name
- **Priority:** P1
- **AC:** AC2
- **Preconditions:** Logged in; 1+ items in cart; on `/checkout-step-one.html`
- **Steps:**
  1. Fill "First Name" with `John` | Locator: `getByTestId('firstName')`
  2. Leave "Last Name" empty
  3. Leave "Postal Code" empty
  4. Click "Continue" | Locator: `getByTestId('continue')`
  5. Verify error message appears | Locator: `getByTestId('error')`
- **Expected Result:** Error message reads "Error: Last Name is required"; user remains on step 1
- **Test data:** First Name=`John`

---

### TC-011 — Checkout Step 1: Submit With Missing Postal Code
- **Priority:** P1
- **AC:** AC2
- **Preconditions:** Logged in; 1+ items in cart; on `/checkout-step-one.html`
- **Steps:**
  1. Fill "First Name" with `John` | Locator: `getByTestId('firstName')`
  2. Fill "Last Name" with `Doe` | Locator: `getByTestId('lastName')`
  3. Leave "Postal Code" empty
  4. Click "Continue" | Locator: `getByTestId('continue')`
  5. Verify error message appears | Locator: `getByTestId('error')`
- **Expected Result:** Error message reads "Error: Postal Code is required"; user remains on step 1
- **Test data:** First Name=`John`, Last Name=`Doe`

---

### TC-012 — Cancel Checkout from Step 1 Returns to Cart
- **Priority:** P1
- **AC:** AC5
- **Preconditions:** Logged in; 1+ items in cart; on `/checkout-step-one.html`
- **Steps:**
  1. Optionally fill in some form data (partial entry)
  2. Click "Cancel" button | Locator: `getByTestId('cancel')`
  3. Verify URL changes to `/cart.html`
  4. Verify cart still contains the previously added items
- **Expected Result:** User is returned to `/cart.html`; cart contents are unchanged

---

### TC-013 — Cancel Checkout from Step 2 Returns to Inventory
- **Priority:** P1
- **AC:** AC5
- **Preconditions:** Logged in; 1+ items in cart; on `/checkout-step-two.html`
- **Steps:**
  1. Navigate through checkout to `/checkout-step-two.html`
  2. Click "Cancel" button | Locator: `getByTestId('cancel')`
  3. Verify URL changes to `/inventory.html`
  4. Verify inventory page with product grid is displayed
- **Expected Result:** User is redirected to `/inventory.html`; cart badge still shows item count
- **Note (FLAG-001):** Cancel on step 2 returns to inventory, not cart — flagged as UX inconsistency

---

### TC-014 — Continue Shopping from Cart Returns to Inventory
- **Priority:** P1
- **AC:** AC5
- **Preconditions:** Logged in; on `/cart.html`
- **Steps:**
  1. Click "Continue Shopping" button | Locator: `getByTestId('continue-shopping')`
  2. Verify URL changes to `/inventory.html`
  3. Verify product grid is visible
  4. Verify cart badge still reflects previously added items
- **Expected Result:** User is on `/inventory.html`; items in cart are preserved

---

### TC-015 — Remove Item from Cart
- **Priority:** P1
- **AC:** AC1
- **Preconditions:** Logged in; 2 items in cart (Backpack + Bike Light); on `/cart.html`
- **Steps:**
  1. Note the number of items displayed (2)
  2. Click the "Remove" button for Sauce Labs Backpack | Locator: `getByTestId('remove-sauce-labs-backpack')`
  3. Verify that item is no longer listed in the cart
  4. Verify cart badge decrements to "1" | Locator: `getByTestId('shopping-cart-badge')`
- **Expected Result:** Removed item disappears from cart; badge count decreases; Sauce Labs Bike Light still shown

---

### TC-016 — Checkout Step 2 Displays Correct Order Summary
- **Priority:** P1
- **AC:** AC3
- **Preconditions:** Logged in; Sauce Labs Backpack ($29.99) in cart; completing checkout step 1
- **Steps:**
  1. Complete checkout step 1 with valid info
  2. On step 2, verify item name "Sauce Labs Backpack" is listed | Locator: `getByTestId('inventory-item-name')`
  3. Verify item price is `$29.99` | Locator: `getByTestId('inventory-item-price')`
  4. Verify "Item total: $29.99" label is shown | Locator: `getByTestId('subtotal-label')`
  5. Verify "Tax:" label is shown | Locator: `getByTestId('tax-label')`
  6. Verify "Total:" label with dollar amount is shown | Locator: `getByTestId('total-label')`
- **Expected Result:** All pricing, item details, and order meta-information are accurately displayed
- **Test data:** Item: Sauce Labs Backpack, $29.99; First Name=`John`, Last Name=`Doe`, Postal Code=`12345`

---

### TC-017 — Checkout with Empty Cart (Direct Navigation)
- **Priority:** P2
- **AC:** AC1
- **Preconditions:** Logged in as `standard_user`; cart is empty
- **Steps:**
  1. Navigate directly to `/cart.html` (no items added)
  2. Verify cart shows no items
  3. Click "Checkout" button | Locator: `getByTestId('checkout')`
  4. Observe behavior — whether app allows proceeding or shows a warning
- **Expected Result (FLAG-002):** App should block or warn, but currently allows navigating to step 1 with empty cart
- **Test data:** Empty cart

---

### TC-018 — Checkout Step 1: Whitespace-Only Field Values
- **Priority:** P2
- **AC:** AC2, AC6
- **Preconditions:** Logged in; 1+ items in cart; on `/checkout-step-one.html`
- **Steps:**
  1. Fill "First Name" with `   ` (spaces only) | Locator: `getByTestId('firstName')`
  2. Fill "Last Name" with `   ` (spaces only) | Locator: `getByTestId('lastName')`
  3. Fill "Postal Code" with `   ` (spaces only) | Locator: `getByTestId('postalCode')`
  4. Click "Continue" | Locator: `getByTestId('continue')`
  5. Observe whether form validates or allows proceeding
- **Expected Result (FLAG-003):** Whitespace-only fields should fail validation; currently app may proceed to step 2

---

### TC-019 — Checkout Step 1: Special Characters in Name Fields
- **Priority:** P2
- **AC:** AC2
- **Preconditions:** Logged in; 1+ items in cart; on `/checkout-step-one.html`
- **Steps:**
  1. Fill "First Name" with `O'Brien` | Locator: `getByTestId('firstName')`
  2. Fill "Last Name" with `Smith-Jones` | Locator: `getByTestId('lastName')`
  3. Fill "Postal Code" with `AB1 2CD` | Locator: `getByTestId('postalCode')`
  4. Click "Continue" | Locator: `getByTestId('continue')`
  5. Verify navigation to step 2 succeeds and values display correctly
- **Expected Result:** App accepts valid special characters (apostrophe, hyphen, space in postal code); navigates to overview correctly

---

### TC-020 — Cart Badge Count Accuracy with Multiple Add/Remove
- **Priority:** P2
- **AC:** AC1
- **Preconditions:** Logged in; on `/inventory.html`; cart is empty
- **Steps:**
  1. Add Sauce Labs Backpack → Badge shows "1" | Locator: `getByTestId('add-to-cart-sauce-labs-backpack')`
  2. Add Sauce Labs Bike Light → Badge shows "2" | Locator: `getByTestId('add-to-cart-sauce-labs-bike-light')`
  3. Add Sauce Labs Bolt T-Shirt → Badge shows "3" | Locator: `getByTestId('add-to-cart-sauce-labs-bolt-t-shirt')`
  4. Navigate to cart and remove Sauce Labs Bike Light | Locator: `getByTestId('remove-sauce-labs-bike-light')`
  5. Navigate back to inventory → Badge shows "2"
  6. Remove Sauce Labs Backpack from inventory | Locator: `getByTestId('remove-sauce-labs-backpack')`
  7. Badge shows "1"
- **Expected Result:** Cart badge always accurately reflects the current number of items

---

### TC-021 — Multiple Items Checkout: Total Price Calculation Accuracy
- **Priority:** P2
- **AC:** AC1, AC3
- **Preconditions:** Logged in; cart is empty; on `/inventory.html`
- **Steps:**
  1. Add Sauce Labs Backpack ($29.99) | Locator: `getByTestId('add-to-cart-sauce-labs-backpack')`
  2. Add Sauce Labs Bike Light ($9.99) | Locator: `getByTestId('add-to-cart-sauce-labs-bike-light')`
  3. Navigate to cart; verify both items listed
  4. Proceed through checkout step 1 with valid info (First=`Jane`, Last=`Smith`, Postal=`90210`)
  5. On step 2, verify both items are listed in the summary
  6. Verify "Item total: $39.98" is shown | Locator: `getByTestId('subtotal-label')`
  7. Verify "Total:" includes tax on top of $39.98 | Locator: `getByTestId('total-label')`
- **Expected Result:** Item total = $39.98; Total = $39.98 + tax; all values mathematically correct

---

## Flagged Issues

### FLAG-001 — Cancel on Step 2 Redirects to Inventory Instead of Cart
- **Severity:** Medium
- **Location:** `/checkout-step-two.html` → Cancel button (`getByTestId('cancel')`)
- **Observed:** Clicking Cancel on overview navigates to `/inventory.html` not `/cart.html`
- **Expected:** Should return to `/cart.html` so user can modify cart before retrying

### FLAG-002 — Empty Cart Does Not Block Checkout Initiation
- **Severity:** Medium
- **Location:** `/cart.html` → Checkout button (`getByTestId('checkout')`)
- **Observed:** Checkout button is active on empty cart; proceeds to step 1 with no items
- **Expected:** Button should be disabled or warn when cart is empty

### FLAG-003 — Whitespace-Only Input May Pass Front-End Validation
- **Severity:** Low
- **Location:** `/checkout-step-one.html` — firstName, lastName, postalCode fields
- **Observed:** Form may accept whitespace-only values as non-empty
- **Expected:** Fields with only whitespace should trigger "is required" errors

### FLAG-004 — No Order Reference Number on Confirmation Page
- **Severity:** Low
- **Location:** `/checkout-complete.html`
- **Observed:** No order number or reference ID shown after purchase
- **Expected:** Unique reference ID for order tracking
