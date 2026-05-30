# SCRUM-101 — Test Execution Report (Run #5)

**Date:** 2026-05-30  
**Branch:** feat/SCRUM-101-checkout-tests  
**App:** https://www.saucedemo.com  
**Browser:** Chromium (Desktop Chrome)  
**Executor:** AgenticAI QA Workflow — POC Run #5

---

## 1. Executive Summary

| Metric | Count |
|--------|-------|
| Planned | 23 |
| Executed | 23 |
| Passed | 23 |
| Failed | 0 |
| Blocked | 0 |
| Healing rounds | 0 |
| Duration | 22.5s |

All 23 tests passed on first execution. No healing was required.  
Four known application-level defects (FI-001 to FI-004) are documented below — these are pre-existing app behaviors, not test failures.

---

## 2. Defects Log

| ID | Severity | Title | Status |
|----|----------|-------|--------|
| FI-001 | Medium | Empty cart checkout not blocked | Open — App navigates to `/checkout-step-one.html` instead of blocking with an error |
| FI-002 | Medium | Cancel on overview returns to inventory not cart | Open — Cancel on `/checkout-step-two.html` navigates to `/inventory.html`, violating BR5 |
| FI-003 | Low | Whitespace-only first name bypasses validation | Open — Form submits with spaces-only in First Name; expected trim-and-reject |
| FI-004 | Low | No order reference number on confirmation page | Open — Confirmation page shows no order ID or reference number |

### FI-001 — Empty cart checkout not blocked
- **Repro:** Log in → do not add any items → go to cart → click Checkout
- **Expected:** Error message "Your cart is empty" or Checkout button disabled
- **Actual:** Navigates to `/checkout-step-one.html` with no items
- **Evidence:** TC-008 assertion on URL `/checkout-step-one.html` (documents actual behavior)
- **Environment:** https://www.saucedemo.com, Chromium

### FI-002 — Cancel on overview returns to inventory not cart
- **Repro:** Add item → checkout → fill info → proceed to overview → click Cancel
- **Expected:** Returns to `/cart.html` (BR5: cancel at any step returns to cart)
- **Actual:** Navigates to `/inventory.html`
- **Evidence:** TC-013 assertion on URL `/inventory.html` (documents actual behavior)
- **Environment:** https://www.saucedemo.com, Chromium

### FI-003 — Whitespace-only first name bypasses validation
- **Repro:** Add item → checkout → fill First Name with spaces only → fill Last Name + Postal Code → Continue
- **Expected:** Validation error "First Name is required" (trim + reject)
- **Actual:** Form submits; navigates to `/checkout-step-two.html`
- **Evidence:** TC-017 assertion on URL `/checkout-step-two.html` (documents actual behavior)
- **Environment:** https://www.saucedemo.com, Chromium

### FI-004 — No order reference number on confirmation page
- **Repro:** Complete a full checkout → view confirmation page
- **Expected:** Unique alphanumeric order reference number visible
- **Actual:** No order ID shown in `complete-header` or `complete-text`
- **Evidence:** TC-023 regex match on confirmation text (documents actual behavior)
- **Environment:** https://www.saucedemo.com, Chromium

---

## 3. Acceptance Criteria Coverage Map

| AC / BR | Description | Status | Covered By |
|---------|-------------|--------|------------|
| AC1 | Cart shows items with name/desc/price/qty, subtotal, action buttons | Covered | TC-002, TC-005, TC-016, TC-022 |
| AC2 | Finish → confirmation with success message and Back Home | Covered | TC-003, TC-004, TC-006 |
| BR1 | All checkout form fields mandatory | Covered | TC-009, TC-010, TC-011 |
| BR2 | User must be logged in | Covered | TC-001, TC-007, TC-014 |
| BR3 | Cart cannot be empty (checkout blocked) | Covered (defect) | TC-008 — defect FI-001 logged |
| BR4 | Confirmation clears cart | Covered | TC-020 |
| BR5 | Cancel at any step returns to cart | Covered (defect) | TC-012 (step 1, passes), TC-013 (step 2, defect FI-002) |

All ACs and BRs are covered. Two BRs (BR3, BR5-step2) have known defects logged.

---

## 4. Risk Areas & Next Steps

**Risk areas:**
- Empty-cart checkout path (FI-001): A user could accidentally complete an empty checkout; back-end likely guards against actual order placement but the UX is broken.
- Cancel flow on step 2 (FI-002): Users expecting to return to cart after reviewing their order summary will instead land on inventory, losing their cart context awareness.
- Input sanitization (FI-003): Whitespace-only values accepted; downstream processes or display may behave unexpectedly with blank-looking data.

**Recommended next steps:**
1. File FI-001 and FI-002 as P1 bugs with the development team (UX/BR violations).
2. File FI-003 as P2 (input sanitization gap).
3. File FI-004 as P2 (missing order tracking feature).
4. Add cross-browser coverage (Firefox, Safari) in a follow-up sprint.
5. Consider adding API-level tests for order confirmation once back-end endpoints are exposed.

---

## 5. Report Links

- **Extent-style HTML report:** [extent-report/index.html](../extent-report/index.html)
- **Playwright built-in HTML report (traces):** [playwright-report/index.html](../playwright-report/index.html)
- **Test plan:** [specs/checkout-plan.md](../specs/checkout-plan.md)
