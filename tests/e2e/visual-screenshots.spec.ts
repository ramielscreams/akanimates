import { test } from "@playwright/test";
test("captures the portfolio visual audit", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Visual audit in Chromium.");
  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    for (const [label, route] of [["home","/"],["stills","/work?mode=stills"],["cgi","/work?mode=cgi"],["cgi-expanded","/work?mode=cgi&project=project-one"],["about","/about"],["project","/work/stills/2024/goodwood"]]) {
      await page.goto(route);
      if (label === "cgi-expanded") {
        await page.locator(".cgi-expanded-player").scrollIntoViewIfNeeded();
      }
      await page.screenshot({path:testInfo.outputPath(`${label}-${viewport.width}.png`)});
    }
  }
});
