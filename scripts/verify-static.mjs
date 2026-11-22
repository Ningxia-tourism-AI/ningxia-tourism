import { chromium } from "playwright";

const base = (process.env.VERIFY_BASE ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const pages = [
  "/",
  "/attractions",
  "/attractions/shapotou",
  "/foods",
  "/routes",
  "/routes/plan",
  "/dialect",
  "/ask",
  "/about",
];

const browser = await chromium.launch({ channel: "msedge" });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  locale: "zh-CN",
});
const page = await context.newPage();
const errors = [];

page.on("console", (message) => {
  if (message.type() === "error") errors.push(`console: ${message.text()}`);
});
page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
page.on("response", (response) => {
  if (response.status() >= 400) {
    errors.push(`HTTP ${response.status()}: ${response.url()}`);
  }
});

for (const pathname of pages) {
  const response = await page.goto(`${base}${pathname}`, {
    waitUntil: "networkidle",
    timeout: 45_000,
  });
  if (!response?.ok()) {
    errors.push(`page: ${pathname} -> ${response?.status() ?? "no response"}`);
    continue;
  }
  if (!(await page.locator("h1").first().count())) {
    errors.push(`heading: ${pathname} has no h1`);
  }
}

await page.goto(`${base}/routes/plan/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "生成行程" }).click();
await page.getByText("已按当前条件生成").waitFor({ timeout: 10_000 });

await page.goto(`${base}/ask/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "沙坡头怎么玩？门票多少？" }).click();
await page.getByText("引用来源").waitFor({ timeout: 10_000 });
if (!(await page.getByText("本地检索").count())) {
  errors.push("ask: local retrieval mode was not rendered");
}

await page.goto(`${base}/dialect/`, { waitUntil: "networkidle" });
await page.getByLabel("普通话", { exact: true }).fill("吃饭了吗？");
await page.getByText("译文").waitFor();

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  locale: "zh-CN",
});
const mobilePage = await mobile.newPage();
await mobilePage.goto(`${base}/`, { waitUntil: "networkidle" });
const overflow = await mobilePage.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
);
if (overflow > 1) errors.push(`mobile: horizontal overflow ${overflow}px`);

await mobile.close();
await context.close();
await browser.close();

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Static verification passed: ${pages.length} pages and 3 interactions.`);
