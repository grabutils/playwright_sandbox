# SCRUM-101 — Checkout Workflow QA Report (POC Run #4)

**Date:** 2026-05-30  
**Branch:** `feat/SCRUM-101-checkout-tests`  
**Environment:** https://www.saucedemo.com | Chromium only  
**Credentials:** `standard_user` / `secret_sauce`

---

## 1. Executive Summary

| Metric | Value |
|---|---|
| Planned test cases | 21 |
| Executed | 21 |
| Passed | 21 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 0 |
| Duration | 11.2s |
| Healing rounds | 1 (TC-004; `getByRole heading` → `getByTestId('title')`) |
| Healing attempts used | 1 / 2 max |

All 21 tests pass on Chromium. No defects required more than 1 healing attempt. Suite is `fullyParallel: true` and CI-friendly.

---

## 2. Defects / Flagged Issues Log

No test-blocking defects. The following application-level issues were discovered during exploration (Phase 1) and are intentionally documented as non-fatal observations in the tests:

| ID | Severity | Title | Repro | Expected | Actual | Evidence |
|---|---|---|---|---|---|---|
| FI-001 / FLAG-002 | Medium | Empty cart checkout not blocked | Login → cart (empty) → click Checkout | Checkout button disabled or warning shown | Navigates to `/checkout-step-one.html` with 0 items | TC-017 console log; `navigation.spec.ts:55` |
| FI-002 / FLAG-001 | Medium | Cancel on Step 2 returns to Inventory, not Cart | Proceed to step 2 → click Cancel | Returns to `/cart.html` | Returns to `/inventory.html` | TC-013 assertion; `navigation.spec.ts:27` |
| FI-003 / FLAG-003 | Low | Whitespace-only fields bypass validation | Fill all 3 fields with spaces → Continue | Validation error "is required" | Proceeds to step 2 | TC-018 console log; `checkout-info.spec.ts:44` |
| FI-004 / FLAG-004 | Low | No order reference number on confirmation page | Complete checkout → view `/checkout-complete.html` | Unique order/reference ID displayed | Static text only; no order ID | Observed during exploration |

---

## 3. Acceptance-Criteria Coverage Map

| AC | Description | Covered by | Status |
|---|---|---|---|
| AC1 | User can add items to cart and proceed to checkout | TC-001, TC-002, TC-003, TC-004, TC-005, TC-015, TC-017, TC-020, TC-021 | ✅ Covered |
| AC2 | Valid first name, last name, postal code required | TC-009, TC-010, TC-011, TC-018, TC-019 | ✅ Covered |
| AC3 | Checkout overview shows correct items, pricing, totals | TC-016, TC-021 | ✅ Covered |
| AC4 | User can complete order and see confirmation | TC-005, TC-006 | ✅ Covered |
| AC5 | Cancel/back returns to appropriate prior page | TC-012, TC-013, TC-014 | ✅ Covered (FLAG-001 noted for step 2 cancel) |
| AC6 | Form validation blocks empty/whitespace fields | TC-009, TC-010, TC-011, TC-018 | ✅ Covered (FLAG-003 noted for whitespace) |

**No AC gaps.** All 6 acceptance criteria are covered by at least one test.

---

## 4. Risk Areas and Next Steps

### Risk Areas
1. **Empty-cart checkout flow (FI-001):** An order could theoretically be placed with no items. In production this must be addressed server-side regardless of front-end state.
2. **Whitespace-only field inputs (FI-003):** Whitespace passes front-end validation, which could result in orders with blank-looking customer names. Trim + validate server-side.
3. **Cancel navigation inconsistency (FI-002):** Step 1 cancel → cart; Step 2 cancel → inventory. This is a UX inconsistency that may confuse users. Align to return to cart from both steps.

### Next Steps
- Raise FI-001 and FI-002 as bugs in the project tracker (Medium severity).
- Add server-side validation for FI-003 (Low priority).
- Extend suite to cover locked/error users (`locked_out_user`, `error_user`) in future sprints.
- Add cross-browser matrix (Firefox, WebKit) when moving from POC to full regression suite.

---

## 5. Report Links

| Report | Path |
|---|---|
| Extent-style HTML dashboard | [extent-report/index.html](../extent-report/index.html) |
| Playwright built-in HTML (traces) | [playwright-report/index.html](../playwright-report/index.html) |
| Test plan | [specs/checkout-plan.md](../specs/checkout-plan.md) |

---

## 6. Spec File Index

| File | Tests | Priority | Notes |
|---|---|---|---|
| `tests/saucedemo-checkout/login.spec.ts` | TC-001, TC-007, TC-008 | P0/P1 | Login happy path + failure cases |
| `tests/saucedemo-checkout/cart-review.spec.ts` | TC-002, TC-003, TC-004, TC-015 | P0/P1 | Cart add/remove/navigate |
| `tests/saucedemo-checkout/happy-path.spec.ts` | TC-005, TC-006 | P0 | Full checkout + post-order navigation |
| `tests/saucedemo-checkout/checkout-info.spec.ts` | TC-009–TC-011, TC-018, TC-019 | P1/P2 | Form validation, whitespace, special chars |
| `tests/saucedemo-checkout/checkout-complete.spec.ts` | TC-016, TC-021 | P1/P2 | Order summary accuracy, multi-item totals |
| `tests/saucedemo-checkout/navigation.spec.ts` | TC-012–TC-014, TC-017 | P1/P2 | Cancel flows, continue shopping, empty cart |
| `tests/saucedemo-checkout/edge-cases.spec.ts` | TC-020 | P2 | Cart badge accuracy across add/remove cycles |
