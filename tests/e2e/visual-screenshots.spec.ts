import { test } from "@playwright/test";
test("captures the portfolio visual audit", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Visual audit in Chromium.");
  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    for (const [label, route] of [["home","/"],["stills","/work?mode=stills"],["cgi","/work?mode=cgi"],["about","/about"],["project","/photography/project-one"]]) {
      await page.goto(route);
      await page.screenshot({path:testInfo.outputPath(`${label}-${viewport.width}.png`)});
    }
  }
});
