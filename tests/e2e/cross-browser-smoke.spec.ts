import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";
test("core routes and local Work mode remain coherent", async ({ page }) => {
  for (const route of ["/", "/about", "/work?mode=stills", "/work?mode=cgi", "/work/stills/2024/goodwood", "/cgi/project-five"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expectNoHorizontalOverflow(page);
    await expect(page.getByRole("link", {name: "Home", exact: true})).toBeVisible();
  }
  await page.evaluate(() => window.sessionStorage.clear());
  await page.goto("/work");
  const stills = page.getByRole("radio", {name:"STILLS",exact:true});
  await stills.focus();
  await stills.press("ArrowRight");
  await expect(page.getByRole("radio", {name:"CGI",exact:true})).toBeChecked();
  await page.goBack();
  await expect(stills).toBeChecked();
});
