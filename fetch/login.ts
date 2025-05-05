import { chromium, Cookie } from "@playwright/test";
import { readFile, writeFile } from "fs/promises";

const cookiesPath = "./cookie.json";

export async function getCookies(): Promise<Cookie[]> {
  let cookies: Cookie[];

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  cookies = await readFile(cookiesPath, "utf-8")
    .then((value) => JSON.parse(value))
    .catch(() => null);

  if (cookies) {
    await context.addCookies(cookies);
  }

  const page = await context.newPage();
  await page.goto("https://www.bilibili.com");

  const avatar = page.locator(".header-avatar-wrap--container .v-img");

  try {
    await avatar.waitFor({ timeout: 3000 });
  } catch {
    await page.locator(".header-login-entry").click();
    await avatar.waitFor();
    await writeFile(cookiesPath, JSON.stringify(cookies, null, 2));
  }

  cookies = await context.cookies();

  await context.close();
  await browser.close();

  return cookies;
}
