# Checkout Test Plan — SCRUM-101
**App**: https://www.saucedemo.com  
**Credentials**: standard_user / secret_sauce  
**Story**: SCRUM-101 — E-commerce Checkout Process  
**Selector map**: `specs/selector-map.json`

---

## Acceptance Criteria Summary

| ID  | Summary |
|-----|---------|
| AC1 | Cart Review — items with name/description/price/qty; Continue Shopping + Checkout buttons |
| AC2 | Checkout Info — First Name, Last Name, Zip fields; all mandatory; errors on empty submit |
| AC3 | Order Overview — item summary, payment/shipping info, subtotal/tax/total, Cancel/Finish |
| AC4 | Order Completion — confirmation page, success message, Back Home button |
| AC5 | Error Handling — validation errors for invalid/incomplete data; cannot proceed until valid |

---

## Test Cases

### TC-001 | P0 | Complete checkout happy path

**AC**: AC1, AC2, AC3, AC4  
**Test data**: standard_user / secret_sauce; product: Sauce Labs Backpack ($29.99)  
**Group file**: `happy-path.spec.ts`

**Steps**:
1. Navigate to `https://www.saucedemo.com/`
2. Fill `[data-test='username']` with `standard_user`
3. Fill `[data-test='password']` with `secret_sauce`
4. Click `[data-test='login-button']`
5. **Expected**: URL is `/inventory.html`; page heading "Products" is visible
6. Click `[data-test='add-to-cart-sauce-labs-backpack']`
7. **Expected**: Cart badge shows `1`; button changes to "Remove"
8. Click `[data-test='shopping-cart-link']`
9. **Expected**: URL is `/cart.html`; heading "Your Cart" is visible
10. Verify `[data-test='cart-item']` count is 1; item name contains "Sauce Labs Backpack"; price is "$29.99"; quantity is "1"
11. Click `[data-test='checkout']`
12. **Expected**: URL is `/checkout-step-one.html`; heading "Checkout: Your Information"
13. Fill `[data-test='firstName']` with `Jane`
14. Fill `[data-test='lastName']` with `Doe`
15. Fill `[data-test='postalCode']` with `12345`
16. Click `[data-test='continue']`
17. **Expected**: URL is `/checkout-step-two.html`; heading "Checkout: Overview"
18. Verify `[data-test='cart-item']` shows Sauce Labs Backpack; quantity "1"; price "$29.99"
19. Verify `[data-test='payment-info-value']` contains "SauceCard #31337"
20. Verify `[data-test='shipping-info-value']` contains "Free Pony Express Delivery!"
21. Verify `[data-test='subtotal-label']` contains "$29.99"
22. Verify `[data-test='tax-label']` contains "$2.40"
23. Verify `[data-test='total-label']` contains "$32.39"
24. Click `[data-test='finish']`
25. **Expected**: URL is `/checkout-complete.html`; heading "Checkout: Complete!"
26. Verify `h3` text is "Thank you for your order!"
27. Verify `[data-test='back-to-products']` is visible

---

### TC-002 | P0 | Cart displays item details correctly

**AC**: AC1  
**Test data**: Sauce Labs Backpack added to cart  
**Group file**: `cart-review.spec.ts`

**Steps**:
1. Log in as standard_user; add Sauce Labs Backpack to cart
2. Navigate to `/cart.html`
3. **Expected**: Heading "Your Cart" visible
4. Verify `[data-test='cart-item']` is visible and count is 1
5. Verify item name text is "Sauce Labs Backpack"
6. Verify `[data-test='inventory-item-desc']` is visible and non-empty
7. Verify `[data-test='inventory-item-price']` text is "$29.99"
8. Verify `[data-test='item-quantity']` text is "1"
9. Verify `[data-test='continue-shopping']` is visible
10. Verify `[data-test='checkout']` is visible

---

### TC-003 | P0 | Checkout form shows errors on empty submit

**AC**: AC2, AC5  
**Test data**: Sauce Labs Backpack in cart; submit with all fields empty  
**Group file**: `checkout-info.spec.ts`

**Steps**:
1. Log in; add Sauce Labs Backpack; navigate to `/checkout-step-one.html`
2. Leave all fields blank
3. Click `[data-test='continue']`
4. **Expected**: `[data-test='error']` is visible; text contains "First Name is required"
5. Fill `[data-test='firstName']` with `John`; click `[data-test='continue']`
6. **Expected**: `[data-test='error']` is visible; text contains "Last Name is required"
7. Fill `[data-test='lastName']` with `Smith`; click `[data-test='continue']`
8. **Expected**: `[data-test='error']` is visible; text contains "Postal Code is required"
9. Fill `[data-test='postalCode']` with `90210`; click `[data-test='continue']`
10. **Expected**: URL is `/checkout-step-two.html` (no error; form accepted)

---

### TC-004 | P0 | Order overview shows complete summary

**AC**: AC3  
**Test data**: Sauce Labs Backpack ($29.99)  
**Group file**: `checkout-overview.spec.ts`

**Steps**:
1. Log in; add Sauce Labs Backpack; go through checkout info (Jane / Doe / 12345)
2. **Expected**: URL is `/checkout-step-two.html`; heading "Checkout: Overview" visible
3. Verify `[data-test='cart-item']` shows Sauce Labs Backpack at $29.99 qty 1
4. Verify `[data-test='payment-info-label']` is visible
5. Verify `[data-test='payment-info-value']` contains "SauceCard #31337"
6. Verify `[data-test='shipping-info-label']` is visible
7. Verify `[data-test='shipping-info-value']` contains "Free Pony Express Delivery!"
8. Verify `[data-test='subtotal-label']` contains "29.99"
9. Verify `[data-test='tax-label']` is visible and non-empty
10. Verify `[data-test='total-label']` contains "32.39"
11. Verify `[data-test='cancel']` is visible
12. Verify `[data-test='finish']` is visible

---

### TC-005 | P0 | Order completion page confirms order

**AC**: AC4  
**Test data**: Full flow with Sauce Labs Backpack  
**Group file**: `checkout-complete.spec.ts`

**Steps**:
1. Complete full checkout flow (login → add item → cart → info → overview → finish)
2. Click `[data-test='finish']`
3. **Expected**: URL is `/checkout-complete.html`
4. Verify heading "Checkout: Complete!" is visible
5. Verify `h3` text is "Thank you for your order!"
6. Verify `[data-test='checkout-complete-container']` is visible
7. Verify `[data-test='back-to-products']` is visible
8. Click `[data-test='back-to-products']`
9. **Expected**: URL is `/inventory.html`; cart badge is NOT visible (cart cleared)

---

### TC-006 | P1 | Missing first name field shows error

**AC**: AC2  
**Test data**: Only last name + postal code filled  
**Group file**: `checkout-info.spec.ts`

**Steps**:
1. Log in; add item; navigate to `/checkout-step-one.html`
2. Leave `[data-test='firstName']` blank
3. Fill `[data-test='lastName']` with `Smith`; fill `[data-test='postalCode']` with `12345`
4. Click `[data-test='continue']`
5. **Expected**: `[data-test='error']` visible; text contains "First Name is required"
6. **Expected**: URL remains `/checkout-step-one.html`

---

### TC-007 | P1 | Cancel from overview navigates to inventory

**AC**: AC3  
**Test data**: Full flow up to overview  
**Group file**: `checkout-overview.spec.ts`

**Steps**:
1. Log in; add item; fill checkout info; reach `/checkout-step-two.html`
2. Click `[data-test='cancel']`
3. **Expected**: URL is `/inventory.html`
4. Verify `[data-test='inventory-list']` is visible

---

### TC-008 | P1 | Continue Shopping from cart returns to inventory

**AC**: AC1  
**Test data**: Sauce Labs Backpack in cart  
**Group file**: `cart-review.spec.ts`

**Steps**:
1. Log in; add item; navigate to `/cart.html`
2. Click `[data-test='continue-shopping']`
3. **Expected**: URL is `/inventory.html`
4. Verify `[data-test='inventory-list']` is visible
5. Verify cart badge still shows `1`

---

### TC-009 | P1 | Missing last name field shows error

**AC**: AC2, AC5  
**Test data**: Only first name + postal code filled  
**Group file**: `checkout-info.spec.ts`

**Steps**:
1. Log in; add item; navigate to `/checkout-step-one.html`
2. Fill `[data-test='firstName']` with `Jane`
3. Leave `[data-test='lastName']` blank
4. Fill `[data-test='postalCode']` with `12345`
5. Click `[data-test='continue']`
6. **Expected**: `[data-test='error']` visible; text contains "Last Name is required"
7. **Expected**: URL remains `/checkout-step-one.html`

---

### TC-010 | P1 | Missing postal code field shows error

**AC**: AC5  
**Test data**: First and last name filled; postal code blank  
**Group file**: `checkout-info.spec.ts`

**Steps**:
1. Log in; add item; navigate to `/checkout-step-one.html`
2. Fill `[data-test='firstName']` with `Jane`; fill `[data-test='lastName']` with `Doe`
3. Leave `[data-test='postalCode']` blank
4. Click `[data-test='continue']`
5. **Expected**: `[data-test='error']` visible; text contains "Postal Code is required"
6. **Expected**: URL remains `/checkout-step-one.html`

---

### TC-011 | P1 | Error message dismisses on close button click

**AC**: AC5  
**Test data**: Empty form submit  
**Group file**: `error-handling.spec.ts`

**Steps**:
1. Log in; add item; navigate to `/checkout-step-one.html`
2. Click `[data-test='continue']` with all fields blank
3. Verify `[data-test='error']` is visible
4. Click `[data-test='error'] button` (close button, aria-label="Close")
5. **Expected**: `[data-test='error']` is NOT visible
6. **Expected**: URL remains `/checkout-step-one.html`; form fields still empty

---

### TC-012 | P1 | Removing item from cart updates badge count

**AC**: AC1, AC3  
**Test data**: Two items added; one removed  
**Group file**: `cart-review.spec.ts`

**Steps**:
1. Log in; add Sauce Labs Backpack; add Sauce Labs Bike Light
2. Verify cart badge shows `2`
3. Navigate to `/cart.html`
4. Verify `[data-test='cart-item']` count is 2
5. Click `[data-test='remove-sauce-labs-backpack']`
6. **Expected**: `[data-test='cart-item']` count is 1
7. **Expected**: Cart badge shows `1`
8. Verify remaining item is Sauce Labs Bike Light ($9.99)

---

### TC-013 | P2 | Postal code accepts alphanumeric input

**AC**: AC2, AC5  
**Test data**: Postal code with letters + numbers  
**Group file**: `error-handling.spec.ts`  
**Note**: FLAG-005 — no format validation observed

**Steps**:
1. Log in; add item; navigate to `/checkout-step-one.html`
2. Fill first name `Jane`; last name `Doe`; postal code `AB123`
3. Click `[data-test='continue']`
4. **Expected**: Proceeds to `/checkout-step-two.html` (no validation error for alphanumeric)
5. **Note**: Document whether format validation exists or not

---

### TC-014 | P2 | Cart badge reflects multiple product additions

**AC**: AC1  
**Test data**: Three separate products added  
**Group file**: `cart-review.spec.ts`

**Steps**:
1. Log in; navigate to `/inventory.html`
2. Click `[data-test='add-to-cart-sauce-labs-backpack']`
3. Verify badge shows `1`
4. Click `[data-test='add-to-cart-sauce-labs-bike-light']`
5. Verify badge shows `2`
6. Click `[data-test='add-to-cart-sauce-labs-bolt-t-shirt']`
7. Verify badge shows `3`

---

### TC-015 | P2 | Cancel from checkout info returns to cart

**AC**: AC1, AC2  
**Test data**: Sauce Labs Backpack in cart  
**Group file**: `checkout-info.spec.ts`

**Steps**:
1. Log in; add Sauce Labs Backpack; navigate to `/checkout-step-one.html`
2. Click `[data-test='cancel']`
3. **Expected**: URL is `/cart.html`
4. Verify `[data-test='cart-item']` still shows Sauce Labs Backpack

---

## Coverage Map

| AC  | P0 Tests | P1 Tests | P2 Tests |
|-----|----------|----------|----------|
| AC1 | TC-001, TC-002 | TC-008, TC-012 | TC-014, TC-015 |
| AC2 | TC-001, TC-003 | TC-006, TC-009 | TC-013, TC-015 |
| AC3 | TC-001, TC-004 | TC-007, TC-012 | — |
| AC4 | TC-001, TC-005 | — | — |
| AC5 | TC-003 | TC-009, TC-010, TC-011 | TC-013 |

---

## Flagged Issues

| ID       | Severity | Title | Description |
|----------|----------|-------|-------------|
| FLAG-001 | Low | Fleece Jacket price rendering | DOM contains "$29.99 $49.99" as single text; likely broken strikethrough for a sale price |
| FLAG-002 | High | Checkout enabled on empty cart | `[data-test='checkout']` is active when cart is empty; allows submitting an empty order |
| FLAG-003 | Medium | Overview Cancel goes to inventory | Cancel on `/checkout-step-two.html` navigates to `/inventory.html`, not back to `/cart.html` |
| FLAG-004 | Medium | No cart subtotal on cart page | AC1 says "total price calculation" visible on cart; totals only appear on overview page |
| FLAG-005 | Low | Postal code accepts any string | No format validation; single letters, special chars accepted without error |
