import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SCREENSHOT_BASE || "http://127.0.0.1:3000";
const OUT = path.resolve(process.env.SCREENSHOT_OUT || "docs/screenshots");

const PAGES = [
  { path: "/", name: "01-home" },
  { path: "/attractions", name: "02-attractions" },
  { path: "/attractions/shapotou", name: "03-attraction-detail" },
  { path: "/foods", name: "04-foods" },
  { path: "/foods/shouzhua-yangrou", name: "05-food-detail" },
  { path: "/routes", name: "06-routes" },
  { path: "/routes/plan", name: "07-route-plan" },
  { path: "/dialect", name: "08-dialect" },
  { path: "/ask", name: "09-ask" },
  { path: "/about", name: "10-about" },
];

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({ channel: "msedge" });
  const failures = [];
  const consoleErrors = [];

  for (const viewport of [
    { label: "desktop", size: DESKTOP, fullPage: true },
    { label: "mobile", size: MOBILE, fullPage: true },
  ]) {
    const context = await browser.newContext({
      viewport: viewport.size,
      deviceScaleFactor: 1,
      locale: "zh-CN",
    });
    const page = await context.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
    });
    page.on("pageerror", (err) => consoleErrors.push(`[pageerror] ${err.message}`));

    for (const target of PAGES) {
      const url = `${BASE}${target.path}`;
      const res = await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
      if (!res || !res.ok()) {
        failures.push(`${url} -> HTTP ${res?.status() ?? "no response"}`);
        continue;
      }
      const h1 = await page.locator("h1").first().textContent().catch(() => null);
      if (!h1) failures.push(`${url} -> 缺少 h1`);

      if (viewport.label === "mobile") {
        const overflow = await page.evaluate(() => {
          const el = document.documentElement;
          return el.scrollWidth - el.clientWidth;
        });
        if (overflow > 1) failures.push(`${url} -> 移动端横向溢出 ${overflow}px`);
      }

      const file = path.join(OUT, `${target.name}-${viewport.label}.png`);
      // 先完整滚动一遍触发入场编排（IntersectionObserver 只播一次，之后元素保持显示），
      // 再回到顶部做整页截图，否则视口外的 reveal 元素在截图里会是空白。
      await page.evaluate(async () => {
        // 必须用 instant 跳滚：全局 scroll-behavior: smooth 会让 scrollTo 的动画
        // 跟不上循环节奏，视口外元素的 IntersectionObserver 永远不会触发
        const step = window.innerHeight * 0.6;
        const total = document.documentElement.scrollHeight;
        for (let y = 0; y <= total; y += step) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 160));
        }
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: file, fullPage: viewport.fullPage });
      console.log(`ok ${viewport.label} ${target.path} -> ${path.basename(file)} | h1: ${h1?.trim().slice(0, 30)}`);

      // 对交互页补一张「操作后」截图，验证功能真的能跑
      if (viewport.label === "desktop" && target.path === "/routes/plan") {
        try {
          await page.getByRole("button", { name: "生成行程" }).click();
          await page.waitForSelector("text=已按当前条件生成", { timeout: 8000 });
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(150);
          await page.screenshot({ path: path.join(OUT, "07b-route-plan-result-desktop.png"), fullPage: true });
          console.log("ok desktop /routes/plan -> 07b-route-plan-result-desktop.png（已生成行程）");
        } catch (err) {
          failures.push(`规划器交互失败：${err.message}`);
        }
      }

      if (viewport.label === "desktop" && target.path === "/ask") {
        try {
          await page.getByRole("button", { name: "沙坡头怎么玩？门票多少？" }).click();
          await page.waitForSelector("text=引用来源", { timeout: 8000 });
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(150);
          await page.screenshot({ path: path.join(OUT, "09b-ask-answer-desktop.png"), fullPage: true });
          console.log("ok desktop /ask -> 09b-ask-answer-desktop.png（已返回答案）");
        } catch (err) {
          failures.push(`问答交互失败：${err.message}`);
        }
      }
    }
    await context.close();
  }

  await browser.close();

  if (consoleErrors.length) {
    console.error("\n控制台错误：");
    for (const e of consoleErrors) console.error("  " + e);
  }
  if (failures.length) {
    console.error("\n失败项：");
    for (const f of failures) console.error("  " + f);
    process.exit(1);
  }
  if (consoleErrors.length) process.exit(1);
  console.log("\n全部页面截图完成。");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
