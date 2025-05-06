import { chromium, devices } from "@playwright/test";
import { readFile, writeFile } from "fs/promises";
import { handleItem } from "./procedure.js";

const iPhone = devices["iPhone 14 Pro"];
const browser = await chromium.launch({ headless: false });

// 1️⃣ 获取 cookie
let cookies = await readFile("./cookie.json", "utf-8")
  .then((value) => JSON.parse(value))
  .catch(() => null);

const loginContext = await browser.newContext();

if (cookies) {
  await loginContext.addCookies(cookies);
}

const loginPage = await loginContext.newPage();
await loginPage.goto("https://www.bilibili.com/");

const avatar = loginPage.locator(".header-avatar-wrap--container .v-img");

try {
  await avatar.waitFor({ timeout: 3000 });
} catch {
  await loginPage.locator(".header-login-entry").click();
  await avatar.waitFor();

  cookies = await loginContext.cookies();
  writeFile("./cookie.json", JSON.stringify(cookies, null, 2), "utf-8");
}

await loginContext.close();

// 2️⃣ 创建移动端上下文
let scrollTimer = null;
let reloadTimer = null;

const context = await browser.newContext({
  ...iPhone,
});
await context.addCookies(cookies);

const page = await context.newPage();

async function onClose() {
  clearInterval(scrollTimer);
  clearInterval(reloadTimer);
  context.close();
  browser.close();
}

page.on("close", async () => {
  onClose();
});

// 3️⃣ 拦截并分析请求响应
page.on("response", async (response) => {
  const url = response.url();
  if (url.includes("/list")) {
    try {
      const data = (await response.json())?.data?.data;
      for (const item of data) {
        handleItem(item);
      }
    } catch (e) {
      console.error(e);
      onClose();
    }
  }
});

// 4️⃣ 访问目标网站
await page.goto(
  "https://mall.bilibili.com/neul-next/index.html?page=magic-market_index"
);

try {
  const skip = page.locator(".bind-card__skip");
  await skip.waitFor({ timeout: 3000 });
  await skip.click();
} catch {}

// 5️⃣ 模拟下滑行为加载新内容
const viewport = page.viewportSize();
const centerX = viewport.width / 2;
const centerY = viewport.height / 2;
await page.mouse.move(centerX, centerY);

scrollTimer = setInterval(async () => {
  try {
    await page.mouse.wheel(0, 2);
  } catch {}
}, 1000 / 120);

reloadTimer = setInterval(async () => {
  try {
    await page.reload();
  } catch {}
}, 1000 * 60);
