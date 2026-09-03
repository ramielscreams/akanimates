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
  test.skip(
    testInfo.project.name !== "chromium",
    "Screenshot audit runs in Chromium.",
  );

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await waitForRolodexIdle(page, "About");
  await attachScreenshot(testInfo, "homepage-about-desktop", page);

  await clickRolodexNav(page, "photography");
  await waitForRolodexIdle(page, "Photography");
  await attachScreenshot(testInfo, "homepage-photography-desktop", page);

  await clickRolodexNav(page, "visualization");
  await waitForRolodexIdle(page, "Visualization");
  await attachScreenshot(testInfo, "homepage-visualization-desktop", page);

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
  await page.getByRole("button", { name: /get in touch/i }).first().click();
  await attachScreenshot(testInfo, "about-contact-desktop", page);

  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/about");
  await page.getByRole("button", { name: /get in touch/i }).first().click();
  await attachScreenshot(testInfo, "about-contact-tablet", page);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  await attachScreenshot(testInfo, "about-mobile", page);
  await page.getByRole("button", { name: /get in touch/i }).first().click();
  await attachScreenshot(testInfo, "about-contact-mobile", page);

  await page.goto("/photography");
  await attachScreenshot(testInfo, "photography-mobile", page);

  await page.getByRole("button", { name: /open navigation menu/i }).click();
  await attachScreenshot(testInfo, "interior-menu-mobile", page);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/visualization");
  await attachScreenshot(testInfo, "visualization-cgi-desktop", page);

  await page.goto("/visualization?mode=design");
  await attachScreenshot(testInfo, "visualization-design-desktop", page);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/visualization");
  await attachScreenshot(testInfo, "visualization-mobile-cgi", page);

  await page.goto("/visualization?mode=design");
  await attachScreenshot(testInfo, "visualization-mobile-design", page);

  await page.goto("/cgi/project-one");
  await attachScreenshot(testInfo, "project-case-study-mobile", page);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/definitely-not-a-real-route");
  await attachScreenshot(testInfo, "not-found-desktop", page);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/definitely-not-a-real-route");
  await attachScreenshot(testInfo, "not-found-mobile", page);
});
