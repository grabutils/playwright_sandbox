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
