# SCRUM-101 — Verified Result (QA Post-Back)

**Story ID:** US001 / SCRUM-101  
**Run Timestamp:** 2026-06-04  
**EXEC_MODE:** local  
**Browser:** Chromium  
**Overall Verdict:** PARTIAL PASS

---

## 1. Header

| Field          | Value                         |
|----------------|-------------------------------|
| Story ID       | US001 / SCRUM-101             |
| Run Date       | 2026-06-04                    |
| Run #          | 6                             |
| EXEC_MODE      | local                         |
| Browser        | Chromium                      |
| Verdict        | **PARTIAL PASS**              |
| Reason         | 22/23 — TC-021 regression (FI-005) |

---

## 2. Result Counts

| Metric     | Count |
|------------|-------|
| Planned    | 23    |
| Executed   | 23    |
| Passed     | 22    |
| Failed     | 1     |
| Blocked    | 0     |
| **Pass %** | **95.7%** |

---

## 3. Per-AC Verdict Table

| AC / BR | Status  | Verdict    | Covering Test(s)                              |
|---------|---------|------------|-----------------------------------------------|
| AC1     | COVERED | **PASS**   | TC-002, TC-005, TC-015, TC-016, TC-022        |
| AC2     | COVERED | **PASS**   | TC-006, TC-020, TC-023                        |
| BR1     | COVERED | **PASS**   | TC-009, TC-010, TC-011, TC-017                |
| BR2     | COVERED | **PASS**   | TC-001, TC-007, TC-008                        |
| BR3     | COVERED | **PARTIAL** | TC-008 — app bug FI-001 (does not block empty cart) |
| BR4     | COVERED | **PASS**   | TC-020                                        |
| BR5     | COVERED | **PARTIAL** | TC-012 ✓; TC-013 — app bug FI-002 (step 2 cancel goes to /inventory) |

---

## 4. Open Defects

| ID     | Severity | Title                                                        | Evidence |
|--------|----------|--------------------------------------------------------------|----------|
| FI-005 | Medium   | Escape key does not close burger menu (TC-021 regression)    | `test-results/saucedemo-checkout-navigat-5b085--opens-and-closes-correctly-chromium/test-failed-1.png` |
| FI-001 | Medium   | Empty cart checkout not blocked — app navigates to step 1    | TC-008 (pass — test documents behavior) |
| FI-002 | Medium   | Cancel on checkout step 2 goes to /inventory.html not /cart  | TC-013 (pass — test documents behavior) |
| FI-003 | Low      | Whitespace-only first name accepted without validation       | TC-017 (pass — test documents behavior) |
| FI-004 | Low      | No order reference number on confirmation page               | TC-023 (pass — test documents behavior) |

---

## 5. Artifact Links

| Artifact           | Path                                                  |
|--------------------|-------------------------------------------------------|
| Story              | `../user-stories/SCRUM-101-ecommerce-checkout.md`     |
| Plan               | `../specs/checkout-plan.md`                           |
| Execution Report   | `../test-results/SCRUM-101-report.md`                 |
| Extent-style HTML  | `../extent-report/index.html`                         |
| Playwright HTML    | `../playwright-report/index.html`                     |

---

Resolves US001
