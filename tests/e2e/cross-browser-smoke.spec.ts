import { expect, test } from "@playwright/test";
import { cgiProjects } from "../../src/data/work-projects";
import { expectNoHorizontalOverflow, modeRadioNames } from "./helpers";
test("core routes and local Work mode remain coherent", async ({ page }) => {
  const firstCgiProject = cgiProjects[0];
  for (const route of ["/", "/about", "/work?mode=stills", "/work?mode=cgi", "/work/stills/2024/goodwood", `/work?mode=cgi&project=${firstCgiProject.slug}`]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expectNoHorizontalOverflow(page);
    await expect(page.getByRole("link", {name: "Home", exact: true})).toBeVisible();
  }
  await page.evaluate(() => window.sessionStorage.clear());
  await page.goto("/work");
  const stills = page.getByRole("radio", {name: modeRadioNames.stills, exact:true});
  await stills.focus();
  await stills.press("ArrowRight");
  await expect(page.getByRole("radio", {name: modeRadioNames.cgi, exact:true})).toBeChecked();
  await page.goBack();
  await expect(stills).toBeChecked();
});
