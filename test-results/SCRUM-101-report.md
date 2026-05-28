# SCRUM-101 Test Execution Report — POC

**Story:** SCRUM-101 — E-commerce Checkout Process  
**App:** https://www.saucedemo.com  
**Browser:** Chromium only  
**Run date:** 2026-05-29  
**Suite:** 21 tests across 6 spec files, `fullyParallel: true`

---

## 1. Executive Summary

| Metric        | Count |
| ------------- | ----- |
| Planned       | 21    |
| Executed      | 21    |
| Passed        | 21    |
| Failed        | 0     |
| Blocked       | 0     |
| Pass rate     | 100%  |
| Duration      | ~15 s |

All 5 acceptance criteria are covered. No blocking defects found. Three flagged issues (FI-01 through FI-03) are informational — they reflect ambiguous or potentially unintended app behaviour and require product clarification, not immediate test fixes.

---

## 2. Defects Log

No test failures were recorded in the final run.

### Flagged Issues (product-level, not test failures)

| ID    | Severity | Title                                              | Repro | Expected | Actual | Evidence |
| ----- | -------- | -------------------------------------------------- | ----- | -------- | ------ | -------- |
| FI-01 | Low      | Checkout button accessible from empty cart         | Login → go to cart (no items added) → click Checkout | App should block or warn | App navigates to checkout info form | TC-017 passes documenting this behaviour |
| FI-02 | Low      | Cancel on overview navigates to inventory, not cart | Login → add item → checkout info → overview → Cancel | Return to cart (`/cart.html`) | Returns to inventory (`/inventory.html`); items remain in cart | TC-013 documents actual navigation |
| FI-03 | Info     | Cart quantity is a static label, not editable      | Add item → go to cart → observe quantity column | Editable quantity control | Non-editable label "1" only; no increment/decrement | Observed during exploration |

### Healing Log (test infrastructure — 1 attempt, within 2-attempt cap)

| Test   | Original Assertion                        | Fixed Assertion                                    | Root Cause |
| ------ | ----------------------------------------- | -------------------------------------------------- | ---------- |
| TC-020 | `[data-test="cart-item"].toHaveCount(3)` | `getByTestId('inventory-item-name').toHaveCount(3)` | `cart-item` locator resolved to 0 in parallel runs; `inventory-item-name` is stable |
| TC-014 | `[data-test="cart-item"].toHaveCount(2)` | `getByTestId('inventory-item-name').toHaveCount(2)` | Same; `storageState: undefined` also applied to prevent potential addInitScript interference on multi-item navigation |

---

## 3. Acceptance-Criteria Coverage Map

| AC    | Description                                  | Covered by                                                        | Status  |
| ----- | -------------------------------------------- | ----------------------------------------------------------------- | ------- |
| AC1   | Cart review — items, totals, nav buttons     | TC-001, TC-002, TC-003, TC-004, TC-005, TC-017, TC-020           | COVERED |
| AC2   | Checkout info — form fields, mandatory       | TC-006, TC-007, TC-008, TC-009, TC-010, TC-011, TC-018, TC-019   | COVERED |
| AC3   | Order overview — summary, totals, Cancel/Finish | TC-012, TC-013, TC-014, TC-021                                 | COVERED |
| AC4   | Order completion — success message, Back Home | TC-001, TC-015, TC-016                                           | COVERED |
| AC5   | Error handling — validation messages         | TC-006, TC-007, TC-008, TC-009, TC-010                           | COVERED |

No gaps.

---

## 4. Risk Areas & Next Steps

**Risk areas:**
- Empty-cart checkout (FI-01): If this is unintended, a back-end guard or UI disable on the Checkout button is needed.
- Cancel-from-overview navigation (FI-02): Users expecting to return to cart after reviewing will be confused. Low severity but may impact UX.
- Quantity immutability (FI-03): No way to update quantity except remove + re-add. Usability risk.

**Next steps:**
1. Product owner to triage FI-01, FI-02, FI-03 and clarify expected behaviour.
2. Enable `retries: 1` in non-CI runs if network flakiness is observed on the live app.
3. If checkout expands (promo codes, multiple addresses, payment methods), add P1 test cases.
4. Run on CI with `--shard` for faster feedback on larger pipelines.

---

## 5. Report Links

| Report               | Path                                 |
| -------------------- | ------------------------------------ |
| Extent-style HTML    | [extent-report/index.html](../extent-report/index.html) |
| Playwright HTML      | [playwright-report/index.html](../playwright-report/index.html) |
| Test Plan            | [specs/checkout-plan.md](../specs/checkout-plan.md) |
