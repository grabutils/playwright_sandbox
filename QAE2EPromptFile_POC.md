# End-to-End QA Workflow — POC Template (Chromium-only, Direct Specs)

> **Lightweight POC runbook.** Fill the **Run Configuration** block once, then paste the
> **Kickoff Prompt** (bottom) to execute. This is the _POC_ variant: **no framework
> scaffolding** (no Page Object Model, no fixtures, no helpers, no separate selector map).
> Tests are written **directly in spec files**, exactly like the Playwright starter sample.
> **Scope:** Chromium only. No cross-browser matrix. No video. **Reporting via a custom
> Extent-style HTML reporter** (plus Playwright's built-in HTML for traces).

---

## 0. Run Configuration (edit this block only)

| Key                 | Value                                                 | Notes                                                            |
| ------------------- | ----------------------------------------------------- | ---------------------------------------------------------------- |
| `STORY_ID`          | `US001`                                               | Ticket / tracking ID                                             |
| `STORY_PATH`        | `user-stories/SCRUM-101-ecommerce-checkout.md`        | Source of truth for AC                                           |
| `APP_URL`           | `<from story>`                                        | Single base URL; read creds from story, never hard-code          |
| `PLAN_PATH`         | `specs/checkout-plan.md`                              | Single human-readable plan (no separate selector-map.json)       |
| `TEST_DIR`          | `tests/`                                              | Direct `*.spec.ts` files, one per scenario group                 |
| `REPORT_PATH`       | `test-results/SCRUM-101-report.md`                    | Concise markdown summary (committed)                             |
| `EXTENT_REPORT_DIR` | `extent-report/`                                      | Custom Extent-style HTML output (gitignored)                     |
| `BROWSER`           | `chromium`                                            | Only engine used — exploration, generation, healing, final run   |
| `VIDEO`             | `off`                                                 | No video. Switch to `retain-on-failure` only if explicitly asked |
| `TRACE`             | `on-first-retry`                                      | Lightweight debugging evidence without video overhead            |
| `MAX_HEAL_ATTEMPTS` | `2`                                                   | Per failure. Then defect + stop. Non-negotiable.                 |
| `WORKERS`           | `auto` (CI: shard)                                    | `fullyParallel: true`                                            |
| `REPO_URL`          | `https://github.com/grabutils/playwright_sandbox.git` |                                                                  |
| `BRANCH`            | `feature/SCRUM-101-checkout-tests`                    |                                                                  |
| `BASE_BRANCH`       | `main`                                                | PR base                                                          |

---

## Global Operating Rules (bind all phases)

POC-tuned. Treat as hard constraints.

1. **Explore exactly once.** Only the planner touches the live app (Phase 1). The
   generator and healer do **not** re-open the app to "check" a selector — they work from
   the plan. A missing/wrong selector is a **plan defect**, fixed in the plan.
2. **Direct specs, like the sample.** Tests are self-contained `*.spec.ts` files using
   inline web-first locators (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId`).
   **No Page Object Model, no fixtures, no helpers, no `locators.ts`, no `selector-map.json`.**
   Keep it as flat and readable as the Playwright starter example.
3. **Login simply.** Default: a `beforeEach` (or `test.beforeAll`) inside the spec performs
   login directly. _(Optional speed-up: a single `storageState` is allowed but NOT required
   for the POC — don't add framework plumbing for it.)_
4. **Deterministic waits only.** Web-first assertions and event-based waits
   (`expect(locator).toBeVisible()`, `waitForURL`, `waitForResponse`). **Never**
   `waitForTimeout`/sleep.
5. **Chromium only.** No Firefox/WebKit, no device matrix. One project, one engine.
6. **No video.** `video: 'off'`. Use `trace` for debugging evidence instead.
7. **Parallel by default.** `fullyParallel: true`; in CI use `--shard`. Stabilization
   runs incrementally (`--last-failed` after the first pass), not full re-runs.
8. **Bounded healing.** Healing is scoped to `--last-failed`, capped at
   `MAX_HEAL_ATTEMPTS`. Unresolved → log defect → **stop looping** (no third attempt).
9. **Extent-style reporting.** A custom Playwright reporter (`reporters/extent-style-reporter.ts`,
   provided in Phase 2) emits a standalone HTML dashboard to `EXTENT_REPORT_DIR`. Built-in
   `html` reporter is also kept for trace viewing. Do not hand-roll separate report HTML
   elsewhere.
10. **Idempotent & CI-friendly.** Re-running any phase is safe. No interactive prompts, no
    machine-specific paths, secrets via env only.
11. **Stop conditions.** Blocked AC, auth failure, or unreachable `APP_URL` → record as
    blocker and stop the affected branch of work; do not retry endlessly.

---

## ⚙️ PHASE 1 — Read Story → Explore Once → Plan

```
Read the user story at {STORY_PATH}. Summarize, in ≤8 lines:
acceptance criteria (numbered), {APP_URL}, and test credentials.

Use the playwright-test-planner agent to explore {APP_URL} EXACTLY ONCE
(cap exploration; do not crawl the whole site). Produce ONE artifact:

{PLAN_PATH} — per scenario:
   - Priority tag: P0 (happy path / core AC) | P1 (validation/negative) | P2 (edge)
   - Test case title  (must match generated test names later)
   - Step-by-step instructions + expected result per step
   - Inline locator hint per step, preferred order:
       1. getByRole(...) / ARIA   2. getByLabel / getByPlaceholder
       3. getByTestId (data-test*) 4. stable #id   (avoid raw CSS/XPath)
     (Record these inline in the plan — there is NO separate selector-map.json.)
   - Test data requirements
   - AC reference(s) it covers   ← enables coverage map in Phase 3

Coverage: happy path, validation/negative, edge & boundary, navigation, UI element checks.
FLAG (don't fix) any bug, UI inconsistency, or missing validation as a candidate defect
in {PLAN_PATH} under "## Flagged Issues".
```

**Exit gate:** `{PLAN_PATH}` exists; every AC maps to ≥1 P0/P1 case; each step has an inline locator hint.

---

## ⚙️ PHASE 2 — Minimal Setup → Generate Direct Specs → Stabilize (Chromium)

```
Use the playwright-test-generator agent. Consume {PLAN_PATH} ONLY — do NOT re-open the app.

Minimal setup (NO framework scaffolding — no POM, fixtures, or helpers):

- playwright.config.ts:
    import { defineConfig, devices } from '@playwright/test';
    export default defineConfig({
      testDir: '{TEST_DIR}',
      fullyParallel: true,
      retries: process.env.CI ? 2 : 0,
      reporter: [
        ['list'],
        ['html', { open: 'never' }],                 // for trace viewing
        ['./reporters/extent-style-reporter.ts',      // Extent-style dashboard
          { outputFile: '{EXTENT_REPORT_DIR}index.html' }],
      ],
      use: {
        baseURL: process.env.APP_URL,
        trace: '{TRACE}',
        video: '{VIDEO}',                             // 'off'
        screenshot: 'only-on-failure',
      },
      projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      ],
    });

- reporters/extent-style-reporter.ts: the custom reporter below (copy as-is).
- Credentials come from env (process.env.*), never hard-coded.

Then generate direct specs into {TEST_DIR}, one file per scenario group, written exactly
like the Playwright starter sample (self-contained, inline locators):

  import { test, expect } from '@playwright/test';

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // simple inline login per Rule 3 (no POM/fixtures)
  });

  test('P0 - <plan title>', async ({ page }) => {
    // steps from the plan, inline getByRole/getByLabel locators,
    // web-first expect() assertions, deterministic waits only
  });

Rules: names match plan titles exactly; one clear behavior per test; no waitForTimeout;
comments only on non-obvious steps.

Run INCREMENTALLY on {BROWSER} as you generate; self-correct obvious issues.
On failure: invoke playwright-test-healer scoped to --last-failed, MAX {MAX_HEAL_ATTEMPTS}
attempts. Not healed in {MAX_HEAL_ATTEMPTS} → record a defect (ID, repro, expected/actual,
trace path) and STOP looping on that test.
```

### Custom Extent-style reporter — `reporters/extent-style-reporter.ts` (copy as-is)

```ts
import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from "@playwright/test/reporter";
import * as fs from "fs";
import * as path from "path";

type Row = {
  title: string;
  status: string;
  durationMs: number;
  startTime: string;
  error?: string;
  steps: { title: string; durationMs: number }[];
  screenshots: string[];
};

const stripAnsi = (s = "") => s.replace(/\x1B\[[0-9;]*m/g, "");
const esc = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default class ExtentStyleReporter implements Reporter {
  private rows: Row[] = [];
  private started = Date.now();
  private outputFile: string;

  constructor(options: { outputFile?: string } = {}) {
    this.outputFile = options.outputFile || "extent-report/index.html";
  }

  onBegin(_config: FullConfig, _suite: Suite) {
    this.started = Date.now();
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.rows.push({
      title: test.titlePath().filter(Boolean).join(" › "),
      status: result.status,
      durationMs: result.duration,
      startTime: new Date(result.startTime).toLocaleString(),
      error: result.error?.message
        ? stripAnsi(result.error.message)
        : undefined,
      steps: result.steps.map((s) => ({
        title: s.title,
        durationMs: s.duration,
      })),
      screenshots: result.attachments
        .filter((a) => a.contentType?.startsWith("image/") && a.path)
        .map((a) => a.path as string),
    });
  }

  async onEnd(result: FullResult) {
    const total = this.rows.length;
    const by = (s: string) => this.rows.filter((r) => r.status === s).length;
    const passed = by("passed");
    const failed = by("failed") + by("timedOut");
    const skipped = by("skipped");
    const totalMs = Date.now() - this.started;
    const pct = total ? Math.round((passed / total) * 100) : 0;

    const cards = [
      ["Total", total, "#475569"],
      ["Passed", passed, "#16a34a"],
      ["Failed", failed, "#dc2626"],
      ["Skipped", skipped, "#d97706"],
      ["Pass %", `${pct}%`, "#2563eb"],
      ["Duration", `${(totalMs / 1000).toFixed(1)}s`, "#475569"],
    ]
      .map(
        ([l, v, c]) =>
          `<div class="card" style="border-top:4px solid ${c}">
         <div class="num">${v}</div><div class="lbl">${l}</div></div>`,
      )
      .join("");

    const rowsHtml = this.rows
      .map((r, i) => {
        const color =
          r.status === "passed"
            ? "#16a34a"
            : r.status === "skipped"
              ? "#d97706"
              : "#dc2626";
        const steps = r.steps
          .map(
            (s) =>
              `<li>${esc(s.title)} <span class="ms">${s.durationMs}ms</span></li>`,
          )
          .join("");
        const shots = r.screenshots
          .map(
            (p) =>
              `<div><img src="${path.relative(path.dirname(this.outputFile), p)}" /></div>`,
          )
          .join("");
        return `
      <div class="test">
        <div class="th" onclick="document.getElementById('b${i}').classList.toggle('open')">
          <span class="dot" style="background:${color}"></span>
          <span class="tt">${esc(r.title)}</span>
          <span class="meta">${r.status.toUpperCase()} · ${r.durationMs}ms · ${esc(r.startTime)}</span>
        </div>
        <div class="tb" id="b${i}">
          ${steps ? `<ul class="steps">${steps}</ul>` : ""}
          ${r.error ? `<pre class="err">${esc(r.error)}</pre>` : ""}
          ${shots ? `<div class="shots">${shots}</div>` : ""}
        </div>
      </div>`;
      })
      .join("");

    const html = `<!doctype html><html><head><meta charset="utf-8">
    <title>Extent-style Report</title><style>
    body{font-family:system-ui,Segoe UI,Roboto,sans-serif;margin:0;background:#f1f5f9;color:#0f172a}
    header{background:#0f172a;color:#fff;padding:18px 24px}
    header h1{margin:0;font-size:18px}.sub{opacity:.7;font-size:12px;margin-top:4px}
    .cards{display:flex;gap:12px;flex-wrap:wrap;padding:20px 24px}
    .card{background:#fff;border-radius:10px;padding:16px 20px;min-width:110px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
    .num{font-size:26px;font-weight:700}.lbl{font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.05em}
    .tests{padding:0 24px 32px}
    .test{background:#fff;border-radius:8px;margin-bottom:8px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.06)}
    .th{display:flex;align-items:center;gap:10px;padding:12px 16px;cursor:pointer}
    .dot{width:10px;height:10px;border-radius:50%}.tt{font-weight:600}
    .meta{margin-left:auto;font-size:12px;color:#64748b}
    .tb{display:none;padding:0 16px 14px 36px}.tb.open{display:block}
    .steps{margin:8px 0;padding-left:18px;font-size:13px;color:#334155}
    .ms{color:#94a3b8;font-size:11px}
    .err{background:#fef2f2;color:#991b1b;padding:10px;border-radius:6px;white-space:pre-wrap;font-size:12px;overflow:auto}
    .shots img{max-width:420px;border:1px solid #e2e8f0;border-radius:6px;margin-top:8px}
    </style></head><body>
    <header><h1>Test Execution Report</h1>
      <div class="sub">${new Date().toLocaleString()} · ${result.status.toUpperCase()}</div></header>
    <div class="cards">${cards}</div>
    <div class="tests">${rowsHtml}</div></body></html>`;

    fs.mkdirSync(path.dirname(this.outputFile), { recursive: true });
    fs.writeFileSync(this.outputFile, html, "utf-8");
    console.log(`\nExtent-style report: ${this.outputFile}\n`);
  }
}
```

> **Swap-in alternatives** (one-line change in the `reporter` array, if you prefer
> off-the-shelf): `['monocart-reporter', { name: 'Report', outputFile: 'monocart/index.html' }]`
> (richest standalone HTML, no server) or `['allure-playwright']` (needs the Allure CLI to
> render). The custom reporter above is the default because true Extent Reports is Java-only.

**Exit gate:** suite passes on `{BROWSER}` (excluding logged defects); no `waitForTimeout`;
specs are self-contained (no POM/fixtures); Extent-style HTML generated; video off.

---

## 🚀 PHASE 3 — Execute → Concise Report

```
1. Run the stable suite ONCE on {BROWSER} (sharded in CI). No other browsers.
2. Keep the custom Extent-style HTML AND Playwright's built-in HTML AS-IS.
   Do NOT recreate their content.

Write a SHORT summary to {REPORT_PATH} — only:
  1. Executive summary — planned / executed / pass / fail / blocked
  2. Defects log — per failure/flagged bug: ID, severity, title, repro steps,
     expected vs actual, evidence (trace/screenshot path), environment
  3. Acceptance-criteria coverage map — AC → covered (test name) / gap
  4. Risk areas + next steps
  5. Links (relative paths) to the Extent-style report and the built-in HTML report
     — do not duplicate their tables
```

**Exit gate:** report written; every AC marked covered or gap; defects carry evidence paths;
both HTML reports linked.

---

## 🔀 PHASE 4 — Commit → Push → Pull Request (GitHub MCP)

```
Use the GitHub MCP server:

1. Init repo if needed; create/checkout {BRANCH}.
2. Stage all new/modified workspace files. Add a .gitignore for:
   node_modules/, test-results/, playwright-report/, {EXTENT_REPORT_DIR}, .auth/
   — but DO commit {REPORT_PATH}, the specs, playwright.config.ts, and
   reporters/extent-style-reporter.ts.
3. Commit (conventional commit):

   feat(tests): add POC end-to-end test suite for {STORY_ID} checkout workflow

   - Add explored test plan with inline locator hints
   - Add direct, self-contained Playwright specs (no POM/fixtures)
   - Add custom Extent-style HTML reporter
   - Add concise execution + coverage report

   Resolves {STORY_ID}

4. Push {BRANCH} to origin.
5. Open a PR via GitHub MCP:
   - Base: {BASE_BRANCH}   Head: {BRANCH}
   - Title: "feat(tests): {STORY_ID} checkout workflow test suite (POC)"
   - Body: scope summary, link to {REPORT_PATH}, pass/fail/blocked counts,
     open defects list, and "Resolves {STORY_ID}"
6. Return the PR URL and number.
```

**Exit gate:** PR open against `{BASE_BRANCH}`; report linked; counts + defects in body.

---

## Definition of Done (quality gate — all must hold)

- App explored once; generator/healer never re-explored.
- Tests are direct, self-contained specs (no POM, fixtures, helpers, or selector map).
- Login handled simply inside specs (storageState optional, not required).
- Zero fixed sleeps; web-first/event waits only.
- Chromium only; no video recording.
- Custom Extent-style HTML report generated; built-in HTML kept for traces.
- Healing capped at `{MAX_HEAL_ATTEMPTS}`; unresolved items are logged defects, not loops.
- Every AC is covered or explicitly logged as a gap.
- Suite is parallel-safe and runs unattended in CI.
- PR open with report + defects + traceability to `{STORY_ID}`.

---
