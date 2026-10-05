import { test, expect } from "@playwright/test";
import { waitForRolodexIdle } from "./helpers";

test("Stills direct year navigation wraps forward and uses Barlow typography", async ({ page }) => {
  await page.goto("/work?mode=stills");
  await waitForRolodexIdle(page, "2026");
  await page.getByRole("button", { name: "03 / 2024" }).click();
  await waitForRolodexIdle(page, "2024");
  await page.getByRole("button", { name: "01 / 2026" }).click();
  await expect(page.locator(".rolodex-track")).toHaveAttribute("data-direction", "next");
  await waitForRolodexIdle(page, "2026");
  await expect(page.locator('.rolodex-panel[data-state="active"] h2')).toHaveCSS("font-weight", "900");
  expect(await page.locator('.rolodex-panel[data-state="active"] h2').evaluate(el => getComputedStyle(el).fontFamily)).toContain("Barlow");
});

test("mobile year navigation commits one forward year", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Uses Chromium mobile viewport coverage.");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/work");
  await waitForRolodexIdle(page, "2026");
  await page.getByRole("button", { name: "02 / 2025" }).click();
  await waitForRolodexIdle(page, "2025");
});

test("Stills year navigation keeps hidden panels inert and reveals the mechanical stage", async ({ page }) => {
  await page.goto("/work?mode=stills");
  await waitForRolodexIdle(page, "2026");
  await page.getByRole("button", { name: "02 / 2025" }).click();
  await waitForRolodexIdle(page, "2025");
  await expect(page.locator('.rolodex-panel:not([inert])')).toHaveCount(1);
  await expect(page.locator('.rolodex-panel[data-state="stack"]').first()).toBeHidden();
});
