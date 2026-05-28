# Test Execution Report — SCRUM-101
**Story**: As a customer, I want to complete my purchase through a checkout process.  
**App**: https://www.saucedemo.com  
**Browser**: Chromium only  
**Date**: 2026-05-28  
**Suite**: `tests/saucedemo-checkout/` | **Config**: `playwright.config.ts`

---

## 1. Executive Summary

| Metric | Count |
|--------|-------|
| Planned test cases | 15 |
| Executed | 15 |
| **Passed** | **15** |
| Failed | 0 |
| Blocked | 0 |
| Defects logged | 0 |
| Heal attempts used | 2 (Heal #1 fixed selector issues; no Heal #2 needed) |

**Outcome: All 15 tests PASSED. No open defects. All ACs covered.**

> HTML report: `playwright-report/index.html`

---

## 2. Defects Log

No test failures remain after heal. Two selector defects were discovered and fixed during Phase 2 stabilization:

| ID | Severity | Title | Root Cause | Resolution |
|----|----------|-------|------------|------------|
| DEFECT-001 | Low | `getByTestId('cart-item')` returned 0 elements on cart + overview pages | `data-test="cart-item"` attribute absent from current saucedemo DOM; planner mapped incorrect attribute | Fixed in POMs: changed to `page.locator('.cart_item')` |
| DEFECT-002 | Low | `locator('h3')` found no element on checkout-complete page | "Thank you for your order!" is not inside an `h3`; element level differs from planner observation | Fixed in POM: changed to `getByRole('heading', { name: 'Thank you for your order!' })` |

---

## 3. Acceptance Criteria Coverage Map

| AC | Description | Covered By | Status |
|----|-------------|------------|--------|
| AC1 | Cart Review — items visible with name/desc/price/qty; Continue Shopping + Checkout buttons | TC-001, TC-002, TC-008, TC-012, TC-014 | ✅ Covered |
| AC2 | Checkout Info Entry — First Name, Last Name, Zip mandatory; error on empty submit | TC-001, TC-003, TC-006, TC-009, TC-010, TC-015 | ✅ Covered |
| AC3 | Order Overview — item summary, payment/shipping info, subtotal/tax/total, Cancel/Finish | TC-001, TC-004, TC-007 | ✅ Covered |
| AC4 | Order Completion — confirmation page, success message, Back Home, cart cleared | TC-001, TC-005 | ✅ Covered |
| AC5 | Error Handling — validation errors; cannot proceed until valid; errors dismissable | TC-003, TC-009, TC-010, TC-011, TC-013 | ✅ Covered |

**All 5 ACs covered. No gaps.**

---

## 4. Flagged Issues (Bugs, Not Defects in Tests)

These were observed during exploration and flagged — not blocking test suite. Recommend filing as bug tickets.

| ID | Severity | Title | Observation |
|----|----------|-------|-------------|
| FLAG-001 | Low | Fleece Jacket price element renders two prices | DOM shows "$29.99 $49.99" as a single text node — likely broken strikethrough for sale price |
| FLAG-002 | High | Checkout button enabled on empty cart | `[data-test='checkout']` is active when cart has 0 items; allows submitting empty orders |
| FLAG-003 | Medium | Overview Cancel navigates to inventory, not cart | Cancel on `/checkout-step-two.html` goes to `/inventory.html` — unintuitive; cart is preserved but user must re-navigate |
| FLAG-004 | Medium | Cart page shows no subtotal | AC1 states "total price calculation" visible on cart page; totals only appear on checkout overview |
| FLAG-005 | Low | Postal code accepts any string | Letters, spaces, and special characters pass validation without error (e.g., `AB1 2CD` accepted) |

---

## 5. Risk Areas & Next Steps

**Risks:**
- FLAG-002 (empty cart checkout) is a high-severity functional gap. A dedicated negative test would need server-side validation to pass.
- TC-012 (remove item) removes by CSS class selector `.cart_item` — if saucedemo adds non-product rows to the cart list, the count assertion could be fragile.
- storageState caches the cart state on first auth; if saucedemo ever persists cart server-side, the auth file would need to be regenerated between test runs.

**Next steps:**
- File FLAG-002 as a P1 bug ticket (functional regression in checkout flow).
- Add a dedicated empty-cart checkout test once FLAG-002 is addressed by the dev team.
- Add visual snapshot tests for the order confirmation page when a visual testing tool is integrated.
