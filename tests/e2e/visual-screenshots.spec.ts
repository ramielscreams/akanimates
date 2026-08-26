import { test, type Page, type TestInfo } from "@playwright/test";

import { clickRolodexNav, waitForRolodexIdle } from "./helpers";

async function attachScreenshot(
  testInfo: TestInfo,
  name: string,
  page: Page,
) {
  await testInfo.attach(name, {
    body: await page.screenshot({ fullPage: false }),
    contentType: "image/png",
  });
}

test("captures the deliberate visual audit set", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await waitForRolodexIdle(page, "About");
  await attachScreenshot(testInfo, "homepage-about-desktop", page);

  await clickRolodexNav(page, "stills");
  await waitForRolodexIdle(page, "Stills");
  await attachScreenshot(testInfo, "homepage-stills-desktop", page);

  await clickRolodexNav(page, "cgi");
  await waitForRolodexIdle(page, "CGI");
  await attachScreenshot(testInfo, "homepage-cgi-desktop", page);

  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(180);
  await attachScreenshot(testInfo, "homepage-rolodex-mid-transition", page);
  await waitForRolodexIdle(page, "About");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await waitForRolodexIdle(page, "About");
  await attachScreenshot(testInfo, "homepage-mobile", page);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/photography");
  await page.getByRole("button", { name: /open navigation menu/i }).click();
  await attachScreenshot(testInfo, "interior-menu", page);

  await page.goto("/about");
  await attachScreenshot(testInfo, "about-page", page);

  await page.goto("/cgi");
  await attachScreenshot(testInfo, "cgi-chapter", page);

  await page.goto("/cgi#design");
  await attachScreenshot(testInfo, "design-chapter", page);

  await page.goto("/definitely-not-a-real-route");
  await attachScreenshot(testInfo, "not-found", page);
});
