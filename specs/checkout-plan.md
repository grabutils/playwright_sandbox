# SCRUM-101 Checkout Test Plan

## App Summary

- **URL:** https://www.saucedemo.com
- **Credentials:** username=`standard_user`, password=`secret_sauce`
- **Key Flows:** Login → Add to Cart → Cart Review → Checkout Info → Order Overview → Order Complete
- **Notes:** Single-page app; all checkout pages accessible only when authenticated; `data-test` attributes are the primary stable locators throughout; cancel from info page returns to cart (`/cart.html`), cancel from overview returns to inventory (`/inventory.html`)

---

## Test Cases

### TC-001: Happy Path — Complete Checkout End-to-End
- **Priority:** P0
- **AC:** AC1, AC2, AC3, AC4
- **Steps:**
  1. Navigate to `https://www.saucedemo.com` → Expected: Login page shown | Locator: `getByTestId('username')`
  2. Fill `standard_user` / `secret_sauce` and click Login → Expected: Redirected to `/inventory.html` | Locator: `getByTestId('login-button')`
  3. Click "Add to cart" for Sauce Labs Backpack → Expected: Badge shows `1` | Locator: `getByTestId('add-to-cart-sauce-labs-backpack')`
  4. Click the cart icon → Expected: Cart page at `/cart.html` | Locator: `getByTestId('shopping-cart-link')`
  5. Verify item name, description, price `$29.99`, quantity `1` are visible | Locator: `getByTestId('inventory-item-name')`, `getByTestId('inventory-item-price')`, `getByTestId('item-quantity')`
  6. Click "Checkout" → Expected: `/checkout-step-one.html` | Locator: `getByTestId('checkout')`
  7. Fill First Name `John`, Last Name `Doe`, Zip `12345` | Locator: `getByTestId('firstName')`, `getByTestId('lastName')`, `getByTestId('postalCode')`
  8. Click "Continue" → Expected: `/checkout-step-two.html` | Locator: `getByTestId('continue')`
  9. Verify subtotal, tax, total labels are visible | Locator: `getByTestId('subtotal-label')`, `getByTestId('tax-label')`, `getByTestId('total-label')`
  10. Click "Finish" → Expected: `/checkout-complete.html` | Locator: `getByTestId('finish')`
  11. Verify header "Thank you for your order!" visible | Locator: `getByTestId('complete-header')`
  12. Verify Pony Express image and complete text visible | Locator: `getByRole('img', { name: /pony express/i })`, `getByTestId('complete-text')`
  13. Click "Back Home" → Expected: `/inventory.html`, cart badge absent | Locator: `getByTestId('back-to-products')`
- **Test Data:** First Name: `John`, Last Name: `Doe`, Zip: `12345`

---

### TC-002: Cart Review — Item Details Displayed Correctly
- **Priority:** P0
- **AC:** AC1
- **Steps:**
  1. Login and add "Sauce Labs Bolt T-Shirt" → Expected: Badge shows `1` | Locator: `getByTestId('add-to-cart-sauce-labs-bolt-t-shirt')`
  2. Navigate to cart → Expected: Cart page shown | Locator: `getByTestId('shopping-cart-link')`
  3. Verify item name "Sauce Labs Bolt T-Shirt" | Locator: `getByTestId('inventory-item-name')`
  4. Verify description is non-empty | Locator: `getByTestId('inventory-item-desc')`
  5. Verify price contains `$` | Locator: `getByTestId('inventory-item-price')`
  6. Verify quantity shows `1` | Locator: `getByTestId('item-quantity')`
  7. Verify "QTY" and "DESCRIPTION" column headers visible | Locator: `getByTestId('cart-quantity-label')`, `getByTestId('cart-desc-label')`
- **Test Data:** Item: Sauce Labs Bolt T-Shirt

---

### TC-003: Cart Review — Continue Shopping Navigation
- **Priority:** P1
- **AC:** AC1
- **Steps:**
  1. Login and add one item → Expected: Badge shows `1`
  2. Navigate to cart → Expected: `/cart.html`
  3. Click "Continue Shopping" → Expected: `/inventory.html` | Locator: `getByTestId('continue-shopping')`
  4. Verify cart badge still shows `1` → Expected: Item not removed | Locator: `getByTestId('shopping-cart-badge')`
- **Test Data:** Any product

---

### TC-004: Cart Review — Remove Item from Cart
- **Priority:** P1
- **AC:** AC1
- **Steps:**
  1. Login, add Sauce Labs Backpack, navigate to cart | Locator: `getByTestId('shopping-cart-link')`
  2. Click "Remove" next to Sauce Labs Backpack → Expected: Item removed | Locator: `getByTestId('remove-sauce-labs-backpack')`
  3. Verify cart item list is empty → Expected: No cart-item elements visible
  4. Verify cart badge is absent → Expected: Badge not visible | Locator: `getByTestId('shopping-cart-badge')`
- **Test Data:** Item: Sauce Labs Backpack

---

### TC-005: Cart Review — Checkout and Continue Shopping Buttons Present
- **Priority:** P0
- **AC:** AC1
- **Steps:**
  1. Login, add one item, navigate to cart
  2. Verify "Checkout" button is visible | Locator: `getByTestId('checkout')`
  3. Verify "Continue Shopping" button is visible | Locator: `getByTestId('continue-shopping')`
- **Test Data:** Any product

---

### TC-006: Checkout Info — Empty Form Validation
- **Priority:** P0
- **AC:** AC2, AC5
- **Steps:**
  1. Login, add item, navigate to checkout info page via cart
  2. Leave all fields empty, click "Continue" → Expected: Error shown, page does not advance | Locator: `getByTestId('continue')`
  3. Verify error message contains "First Name is required" | Locator: `getByTestId('error')`
  4. Verify error close button is visible | Locator: `getByTestId('error-button')`
- **Test Data:** All fields blank

---

### TC-007: Checkout Info — Missing Last Name Validation
- **Priority:** P1
- **AC:** AC2, AC5
- **Steps:**
  1. On checkout info page, fill First Name `John` and Zip `12345`, leave Last Name empty
  2. Click "Continue" → Expected: Error referencing Last Name | Locator: `getByTestId('error')`
- **Test Data:** First Name: `John`, Last Name: (empty), Zip: `12345`

---

### TC-008: Checkout Info — Missing Zip Code Validation
- **Priority:** P1
- **AC:** AC2, AC5
- **Steps:**
  1. On checkout info page, fill First Name `John` and Last Name `Doe`, leave Zip empty
  2. Click "Continue" → Expected: Error referencing Postal Code | Locator: `getByTestId('error')`
- **Test Data:** First Name: `John`, Last Name: `Doe`, Zip: (empty)

---

### TC-009: Checkout Info — Missing First Name Validation
- **Priority:** P1
- **AC:** AC2, AC5
- **Steps:**
  1. On checkout info page, fill Last Name `Doe` and Zip `12345`, leave First Name empty
  2. Click "Continue" → Expected: Error referencing First Name | Locator: `getByTestId('error')`
- **Test Data:** First Name: (empty), Last Name: `Doe`, Zip: `12345`

---

### TC-010: Checkout Info — Error Banner Dismissal
- **Priority:** P1
- **AC:** AC2, AC5
- **Steps:**
  1. On checkout info page, click "Continue" with empty fields → Expected: Error shown
  2. Click error dismiss (X) button → Expected: Error banner hidden | Locator: `getByTestId('error-button')`
  3. Verify form fields still editable → Expected: First Name field remains visible
- **Test Data:** All fields blank

---

### TC-011: Checkout Info — Cancel Returns to Cart
- **Priority:** P1
- **AC:** AC2
- **Steps:**
  1. On checkout info page, optionally type partial data
  2. Click "Cancel" → Expected: `/cart.html` | Locator: `getByTestId('cancel')`
  3. Verify item still in cart → Expected: Item row visible
- **Test Data:** Partial: First Name `John`

---

### TC-012: Order Overview — Summary Details Displayed
- **Priority:** P0
- **AC:** AC3
- **Steps:**
  1. Complete checkout info (login → add Sauce Labs Backpack → info form → continue) → reach overview
  2. Verify item name "Sauce Labs Backpack" | Locator: `getByTestId('inventory-item-name')`
  3. Verify price `$29.99` | Locator: `getByTestId('inventory-item-price')`
  4. Verify payment info label + value visible | Locator: `getByTestId('payment-info-label')`, `getByTestId('payment-info-value')`
  5. Verify shipping info label + value visible | Locator: `getByTestId('shipping-info-label')`, `getByTestId('shipping-info-value')`
  6. Verify `subtotal-label` contains `$29.99` | Locator: `getByTestId('subtotal-label')`
  7. Verify tax and total labels visible | Locator: `getByTestId('tax-label')`, `getByTestId('total-label')`
  8. Verify Cancel and Finish buttons present | Locator: `getByTestId('cancel')`, `getByTestId('finish')`
- **Test Data:** First Name: `Jane`, Last Name: `Smith`, Zip: `90210`

---

### TC-013: Order Overview — Cancel Returns to Inventory
- **Priority:** P1
- **AC:** AC3
- **Steps:**
  1. On checkout overview, click "Cancel" → Expected: `/inventory.html` | Locator: `getByTestId('cancel')`
  2. Verify "Products" heading visible | Locator: `getByTestId('title')`
  3. Verify cart badge still reflects items added
- **Test Data:** Any product

---

### TC-014: Order Overview — Multiple Items Summary
- **Priority:** P1
- **AC:** AC3
- **Steps:**
  1. Login, add Sauce Labs Backpack ($29.99) + Sauce Labs Bike Light ($9.99)
  2. Complete checkout info and reach overview
  3. Verify both items listed → Expected: Two item rows visible
  4. Verify subtotal is `$39.98` (sum of both) | Locator: `getByTestId('subtotal-label')`
  5. Verify total includes tax | Locator: `getByTestId('total-label')`
- **Test Data:** Items: Backpack + Bike Light; First Name: `John`, Last Name: `Doe`, Zip: `12345`

---

### TC-015: Order Completion — Success Page Elements
- **Priority:** P0
- **AC:** AC4
- **Steps:**
  1. Complete full checkout, click "Finish" → Expected: `/checkout-complete.html`
  2. Verify header "Thank you for your order!" | Locator: `getByTestId('complete-header')`
  3. Verify sub-text (dispatch confirmation) | Locator: `getByTestId('complete-text')`
  4. Verify Pony Express image | Locator: `getByRole('img', { name: /pony express/i })`
  5. Verify "Back Home" button visible | Locator: `getByTestId('back-to-products')`
- **Test Data:** First Name: `John`, Last Name: `Doe`, Zip: `12345`

---

### TC-016: Order Completion — Back Home Button Navigation
- **Priority:** P0
- **AC:** AC4
- **Steps:**
  1. On completion page, click "Back Home" → Expected: `/inventory.html` | Locator: `getByTestId('back-to-products')`
  2. Verify "Products" heading | Locator: `getByTestId('title')`
  3. Verify cart badge absent (cart cleared after order) | Locator: `getByTestId('shopping-cart-badge')`
- **Test Data:** Complete end-to-end flow

---

### TC-017: Edge Case — Checkout Button Accessible with Empty Cart
- **Priority:** P2
- **AC:** AC1, AC5
- **Steps:**
  1. Login without adding any items
  2. Navigate to cart via cart icon → Expected: Cart page with no items | Locator: `getByTestId('shopping-cart-link')`
  3. Verify cart is empty (no cart-item rows)
  4. Verify "Checkout" button is still present | Locator: `getByTestId('checkout')`
  5. Click "Checkout" → Record actual behavior (may navigate to checkout info page)
- **Test Data:** No items added

---

### TC-018: Checkout Info — Form Field Placeholders
- **Priority:** P2
- **AC:** AC2
- **Steps:**
  1. On checkout info page, verify placeholders present:
     - "First Name" | Locator: `getByPlaceholder('First Name')`
     - "Last Name" | Locator: `getByPlaceholder('Last Name')`
     - "Zip/Postal Code" | Locator: `getByPlaceholder('Zip/Postal Code')`
- **Test Data:** None required

---

### TC-019: Checkout Info — Alphanumeric Zip Accepted
- **Priority:** P2
- **AC:** AC2
- **Steps:**
  1. On checkout info page, fill First Name `John`, Last Name `Doe`, Zip `A1B 2C3`
  2. Click "Continue" → Expected: Accepts and navigates to `/checkout-step-two.html`
- **Test Data:** Zip: `A1B 2C3`

---

### TC-020: Multi-Item Cart — Badge Count Accuracy
- **Priority:** P2
- **AC:** AC1
- **Steps:**
  1. Login, add Sauce Labs Backpack → badge `1` | Locator: `getByTestId('add-to-cart-sauce-labs-backpack')`
  2. Add Sauce Labs Fleece Jacket → badge `2` | Locator: `getByTestId('add-to-cart-sauce-labs-fleece-jacket')`
  3. Add Sauce Labs Onesie → badge `3` | Locator: `getByTestId('add-to-cart-sauce-labs-onesie')`
  4. Navigate to cart, verify 3 item rows | Locator: `getByTestId('shopping-cart-link')`
  5. Verify badge count equals row count | Locator: `getByTestId('shopping-cart-badge')`
- **Test Data:** Items: Backpack, Fleece Jacket, Onesie

---

### TC-021: Order Overview — Price Calculation Accuracy
- **Priority:** P1
- **AC:** AC3
- **Steps:**
  1. Add Sauce Labs Backpack only, complete checkout info, reach overview
  2. Read subtotal → Expected: `$29.99` | Locator: `getByTestId('subtotal-label')`
  3. Read tax → Expected: > 0 | Locator: `getByTestId('tax-label')`
  4. Read total → Expected: subtotal + tax | Locator: `getByTestId('total-label')`
  5. Verify total equals subtotal + tax (floating point close-to)
- **Test Data:** First Name: `Test`, Last Name: `User`, Zip: `99999`

---

## Flagged Issues

- **FI-01 — Empty Cart Checkout Not Blocked:** The "Checkout" button is accessible even when the cart is empty. Clicking it proceeds to the checkout info form. This may allow zero-item orders; confirm if intended or a defect.
- **FI-02 — Cancel from Overview Goes to Inventory, Not Cart:** Cancel on `/checkout-step-two.html` sends the user to `/inventory.html` instead of `/cart.html`. Items remain in cart. Navigation behavior may surprise users expecting to return to their cart.
- **FI-03 — Static Quantity in Cart:** Cart shows quantity as a non-editable label (`1`). No quantity control — users can only remove items entirely. Confirm as intended limitation.
