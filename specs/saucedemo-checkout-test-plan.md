# Test Plan: SCRUM-101 — Saucedemo E-commerce Checkout Process

**Application URL**: https://www.saucedemo.com  
**Test Credentials**: username: `standard_user` | password: `secret_sauce`  
**Seed File**: `tests/seed.spec.ts`  
**Test Scripts Directory**: `tests/saucedemo-checkout/`  
**Browsers**: Chromium, Firefox, WebKit (Safari)  
**Created**: 2026-05-28  

---

## Application Overview (Exploratory Findings)

SauceDemo is a demo e-commerce site with the following page flow:

| Page | URL | Purpose |
|------|-----|---------|
| Login | `/` | User authentication |
| Products | `/inventory.html` | Product catalog |
| Cart | `/cart.html` | Shopping cart review |
| Checkout Step 1 | `/checkout-step-one.html` | Customer info entry |
| Checkout Step 2 | `/checkout-step-two.html` | Order overview |
| Checkout Complete | `/checkout-complete.html` | Order confirmation |

### Key Element Selectors (Discovered During Exploration)

| Element | Selector |
|---------|----------|
| Username field | `#user-name` |
| Password field | `#password` |
| Login button | `#login-button` |
| Login error | `[data-test="error"]` |
| Add to cart (backpack) | `[data-test="add-to-cart-sauce-labs-backpack"]` |
| Cart link | `.shopping_cart_link` |
| Cart badge | `.shopping_cart_badge` |
| Cart items | `.cart_item` |
| Continue Shopping | `#continue-shopping` |
| Checkout button | `#checkout` |
| First name field | `#first-name` |
| Last name field | `#last-name` |
| Postal code field | `#postal-code` |
| Continue button | `#continue` |
| Cancel button | `#cancel` |
| Checkout error | `[data-test="error"]` |
| Subtotal | `.summary_subtotal_label` |
| Tax | `.summary_tax_label` |
| Total | `.summary_total_label` |
| Finish button | `#finish` |
| Order confirmation header | `.complete-header` |
| Back to products | `#back-to-products` |

---

## Test Scenarios

---

### 1. Cart Review (AC1)

**Seed**: Login as `standard_user`, add at least one item to cart

#### 1.1 should display product details (name, description, price, quantity)

**Steps**:
1. Navigate to `https://www.saucedemo.com`
2. Login with `standard_user` / `secret_sauce`
3. Click "Add to cart" on "Sauce Labs Backpack"
4. Click cart icon (`.shopping_cart_link`)
5. Verify the cart page is shown (`/cart.html`)
6. Verify item name is visible (`.inventory_item_name`)
7. Verify item description is visible (`.inventory_item_desc`)
8. Verify item price is visible (`.inventory_item_price`)
9. Verify quantity shows `1` (`.cart_quantity`)

**Expected**: All item details are shown correctly with quantity 1

---

#### 1.2 should show Continue Shopping button

**Steps**:
1. Navigate to cart (after login + add item)
2. Verify `#continue-shopping` button is visible and enabled

**Expected**: "Continue Shopping" button is visible

---

#### 1.3 should show Proceed to Checkout button

**Steps**:
1. Navigate to cart (after login + add item)
2. Verify `#checkout` button is visible and enabled

**Expected**: "Checkout" button is visible

---

#### 1.4 should navigate back to products when Continue Shopping is clicked

**Steps**:
1. Navigate to cart page
2. Click `#continue-shopping`
3. Verify URL contains `/inventory.html`
4. Verify "Products" heading is visible

**Expected**: User is returned to the products page

---

#### 1.5 should proceed to checkout information when Checkout is clicked

**Steps**:
1. Navigate to cart page with items
2. Click `#checkout`
3. Verify URL contains `/checkout-step-one.html`

**Expected**: User is redirected to checkout information page

---

#### 1.6 should show cart badge with correct item count

**Steps**:
1. Login and navigate to products
2. Click "Add to cart" on one item
3. Verify `.shopping_cart_badge` shows `1`
4. Add another item
5. Verify badge shows `2`

**Expected**: Badge accurately reflects item count

---

#### 1.7 should show multiple items in cart

**Steps**:
1. Login and navigate to products
2. Add "Sauce Labs Backpack" and "Sauce Labs Bike Light"
3. Navigate to cart
4. Verify `.cart_item` count is 2

**Expected**: Both items appear in the cart

---

#### 1.8 should remove item when delete icon is clicked

**Steps**:
1. Navigate to cart with one item
2. Click `[data-test="remove-sauce-labs-backpack"]`
3. Verify `.cart_item` count is 0
4. Verify `.shopping_cart_badge` is not visible

**Expected**: Item removed, cart is empty, badge disappears

---

### 2. Checkout Information (AC2)

**Seed**: Login, add item to cart, click Checkout

#### 2.1 should display form fields for First Name, Last Name, and Zip Code

**Steps**:
1. Login, add item, go to cart, click Checkout
2. Verify `#first-name` field is visible
3. Verify `#last-name` field is visible
4. Verify `#postal-code` field is visible
5. Verify `#continue` button is visible
6. Verify `#cancel` button is visible

**Expected**: All form fields and buttons are displayed

---

#### 2.2 should proceed to order overview when all fields are filled

**Steps**:
1. On checkout info page, fill `#first-name` with "John"
2. Fill `#last-name` with "Doe"
3. Fill `#postal-code` with "12345"
4. Click `#continue`
5. Verify URL contains `/checkout-step-two.html`

**Expected**: User is redirected to order overview page

---

#### 2.3 should show error when First Name is empty

**Steps**:
1. On checkout info page, leave `#first-name` empty
2. Fill `#last-name` with "Doe"
3. Fill `#postal-code` with "12345"
4. Click `#continue`
5. Verify `[data-test="error"]` is visible and contains "First Name is required"

**Expected**: Error message displayed for missing first name

---

#### 2.4 should show error when Last Name is empty

**Steps**:
1. On checkout info page, fill `#first-name` with "John"
2. Leave `#last-name` empty
3. Fill `#postal-code` with "12345"
4. Click `#continue`
5. Verify error contains "Last Name is required"

**Expected**: Error message displayed for missing last name

---

#### 2.5 should show error when Zip Code is empty

**Steps**:
1. On checkout info page, fill `#first-name` with "John"
2. Fill `#last-name` with "Doe"
3. Leave `#postal-code` empty
4. Click `#continue`
5. Verify error contains "Postal Code is required"

**Expected**: Error message displayed for missing postal code

---

#### 2.6 should show error when all fields are empty

**Steps**:
1. On checkout info page, leave all fields empty
2. Click `#continue`
3. Verify `[data-test="error"]` is visible

**Expected**: Validation error is displayed

---

#### 2.7 should cancel checkout and return to cart

**Steps**:
1. On checkout info page
2. Click `#cancel`
3. Verify URL contains `/cart.html`

**Expected**: User is returned to the cart page

---

#### 2.8 should dismiss error message when X is clicked

**Steps**:
1. Trigger an error (click Continue with empty fields)
2. Click the `.error-button` (X icon on error message)
3. Verify error message is no longer visible

**Expected**: Error message is dismissed

---

### 3. Order Overview (AC3)

**Seed**: Login, add item, checkout, fill info and continue

#### 3.1 should show summary of all ordered items

**Steps**:
1. Complete checkout info, arrive at `/checkout-step-two.html`
2. Verify `.cart_item` is visible with item name and price
3. Verify each ordered item is listed

**Expected**: All cart items are shown in the overview

---

#### 3.2 should display payment information

**Steps**:
1. On checkout overview page
2. Verify "Payment Information:" label is visible
3. Verify payment details are shown

**Expected**: Payment information section is visible

---

#### 3.3 should display shipping information

**Steps**:
1. On checkout overview page
2. Verify "Shipping Information:" label is visible

**Expected**: Shipping information section is visible

---

#### 3.4 should show subtotal, tax, and total amounts

**Steps**:
1. On checkout overview page
2. Verify `.summary_subtotal_label` is visible and contains a dollar amount
3. Verify `.summary_tax_label` is visible and contains a dollar amount
4. Verify `.summary_total_label` is visible and contains a dollar amount

**Expected**: All price breakdowns are displayed

---

#### 3.5 should have Cancel and Finish buttons

**Steps**:
1. On checkout overview page
2. Verify `#finish` button is visible
3. Verify `#cancel` button is visible

**Expected**: Both action buttons are present

---

#### 3.6 should navigate to products when Cancel is clicked

**Steps**:
1. On checkout overview page, click `#cancel`
2. Verify URL contains `/inventory.html`

**Expected**: User is returned to the products page (SauceDemo behavior)

---

#### 3.7 should have correct total (subtotal + tax)

**Steps**:
1. On checkout overview page
2. Read subtotal value from `.summary_subtotal_label`
3. Read tax value from `.summary_tax_label`
4. Read total value from `.summary_total_label`
5. Verify: total = subtotal + tax (within rounding tolerance)

**Expected**: Total amount is accurate sum of subtotal and tax

---

### 4. Order Completion (AC4)

**Seed**: Complete entire checkout flow including clicking Finish

#### 4.1 should redirect to confirmation page after clicking Finish

**Steps**:
1. On checkout overview, click `#finish`
2. Verify URL contains `/checkout-complete.html`

**Expected**: User lands on order confirmation page

---

#### 4.2 should show success message "Thank you for your order!"

**Steps**:
1. On order confirmation page
2. Verify `.complete-header` contains "Thank you for your order!"

**Expected**: Success header is displayed

---

#### 4.3 should show order confirmation descriptive text

**Steps**:
1. On order confirmation page
2. Verify `.complete-text` is visible with meaningful text

**Expected**: Descriptive confirmation text is visible

---

#### 4.4 should show Back Home button

**Steps**:
1. On order confirmation page
2. Verify `#back-to-products` button is visible

**Expected**: "Back Home" button is displayed

---

#### 4.5 should navigate to products when Back Home is clicked

**Steps**:
1. On order confirmation page, click `#back-to-products`
2. Verify URL contains `/inventory.html`
3. Verify "Products" heading is visible

**Expected**: User returns to the products page

---

#### 4.6 cart should be empty after order completion

**Steps**:
1. After clicking "Back Home" from order confirmation
2. Verify `.shopping_cart_badge` is not visible (cart is empty)

**Expected**: Cart is cleared after successful order

---

### 5. Error Handling (AC5)

#### 5.1 should show error for empty login credentials

**Steps**:
1. Navigate to `https://www.saucedemo.com`
2. Leave username and password empty
3. Click `#login-button`
4. Verify `[data-test="error"]` is visible with message about required username

**Expected**: Login error is displayed

---

#### 5.2 should show error for incorrect password

**Steps**:
1. Navigate to login page
2. Enter `standard_user` as username
3. Enter `wrong_password` as password
4. Click `#login-button`
5. Verify error message is visible

**Expected**: Authentication error is displayed

---

#### 5.3 should show error for locked out user

**Steps**:
1. Navigate to login page
2. Enter `locked_out_user` as username
3. Enter `secret_sauce` as password
4. Click `#login-button`
5. Verify error contains "Sorry, this user has been locked out."

**Expected**: Locked-out user error message is shown

---

#### 5.4 should not allow proceeding with empty cart

**Steps**:
1. Login as `standard_user`
2. Navigate directly to `/cart.html`
3. Verify the checkout button is visible but cart is empty
4. Verify no items in `.cart_item`

**Expected**: Empty cart is reflected in cart view

---

#### 5.5 should handle special characters in checkout fields

**Steps**:
1. Login, add item, go to cart, click Checkout
2. Fill `#first-name` with "John@#$"
3. Fill `#last-name` with "Doe!%^"
4. Fill `#postal-code` with "!@#45"
5. Click `#continue`
6. Verify behavior (SauceDemo accepts all input — note this observation)

**Expected**: Form accepts input; any validation is documented

---

### 6. Happy Path — Complete End-to-End Checkout

**Seed**: Fresh browser session

#### 6.1 Complete checkout flow from login to order confirmation

**Steps**:
1. Navigate to `https://www.saucedemo.com`
2. Enter `standard_user` and `secret_sauce`, click Login
3. Verify "Products" page loads
4. Click "Add to cart" on "Sauce Labs Backpack"
5. Verify cart badge shows `1`
6. Click cart icon
7. Verify cart page with item visible
8. Click `#checkout`
9. Fill First Name: "John", Last Name: "Doe", Postal Code: "10001"
10. Click `#continue`
11. Verify order overview page with item and pricing
12. Verify total = subtotal + tax
13. Click `#finish`
14. Verify "Thank you for your order!" is displayed
15. Click `#back-to-products`
16. Verify products page and empty cart

**Expected**: Full checkout flow completes successfully without errors

---

## Test Coverage Matrix

| Acceptance Criteria | Test Cases | Coverage |
|--------------------|-----------|---------|
| AC1: Cart Review | TC1.1 – TC1.8 | ✅ Full |
| AC2: Checkout Information | TC2.1 – TC2.8 | ✅ Full |
| AC3: Order Overview | TC3.1 – TC3.7 | ✅ Full |
| AC4: Order Completion | TC4.1 – TC4.6 | ✅ Full |
| AC5: Error Handling | TC5.1 – TC5.5 | ✅ Full |
| Happy Path E2E | TC6.1 | ✅ Full |

**Total Test Cases: 39**  
**Test Files: 6** (cart-review, checkout-info, checkout-overview, checkout-complete, error-handling, happy-path)
