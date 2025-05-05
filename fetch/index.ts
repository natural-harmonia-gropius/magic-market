import { chromium, devices } from "@playwright/test";
import { handleItem } from "./item.js";
import { getCookies } from "./login.js";

const browser = await chromium.launch();
const context = await browser.newContext({
  ...devices["iPhone 14 Pro"],
});

async function onClose() {
  clearInterval(scrollTimer);
  clearInterval(reloadTimer);
  context.close();
  browser.close();
}

await context.addCookies(await getCookies());
const page = await context.newPage();

page.on("close", async () => {
  onClose();
});

page.on("response", async (response) => {
  const url = response.url();
  if (url.includes("/list")) {
    try {
      const data = (await response.json())?.data?.data;
      for (const item of data) {
        console.count();
        handleItem(item);
      }
    } catch (e) {
      console.error(e);
      onClose();
    }
  }
});

await page.goto(
  "https://mall.bilibili.com/neul-next/index.html?page=magic-market_index"
);

try {
  const skip = page.locator(".bind-card__skip");
  await skip.waitFor({ timeout: 3000 });
  await skip.click();
} catch {}

const container = page.locator(".scroll-view-container");

let scrollTimer: NodeJS.Timeout | undefined = undefined;

function startScrolling() {
  scrollTimer = setInterval(async () => {
    try {
      await container.evaluate((el) => {
        el.scrollBy({ top: Math.random() * 2 + 2 });
      });
    } catch {}
  }, 1000 / 120);
}

const reloadTimer = setInterval(async () => {
  try {
    if (scrollTimer) {
      clearInterval(scrollTimer);
      scrollTimer = undefined;
    }
    await page.reload();
    await page.waitForLoadState("networkidle");
    startScrolling();
  } catch {}
}, 1000 * 60);

startScrolling();
