import { test, expect } from "@playwright/test";
import { waitForRolodexIdle } from "./helpers";

test("direct project navigation wraps forward and uses Barlow typography", async ({ page }) => {
  await page.goto("/work?mode=cgi");
  await waitForRolodexIdle(page, "Project One");
  await page.getByRole("button", { name: "05 / Project Five" }).click();
  await waitForRolodexIdle(page, "Project Five");
  await page.getByRole("button", { name: "01 / Project One" }).click();
  await expect(page.locator(".rolodex-track")).toHaveAttribute("data-direction", "next");
  await waitForRolodexIdle(page, "Project One");
  await expect(page.locator('.rolodex-panel[data-state="active"] h2')).toHaveCSS("font-weight", "900");
  expect(await page.locator('.rolodex-panel[data-state="active"] h2').evaluate(el => getComputedStyle(el).fontFamily)).toContain("Barlow");
});

test("touch swipes commit one forward project", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Uses Chromium touch emulation.");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/work");
  await waitForRolodexIdle(page, "2024");
  const session = await page.context().newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", {type:"touchStart", touchPoints:[{x:195,y:450}]});
  await session.send("Input.dispatchTouchEvent", {type:"touchMove", touchPoints:[{x:195,y:350}]});
  await session.send("Input.dispatchTouchEvent", {type:"touchMove", touchPoints:[{x:195,y:300}]});
  await session.send("Input.dispatchTouchEvent", {type:"touchEnd", touchPoints:[]});
  await waitForRolodexIdle(page, "2025");
});

test("burst input keeps hidden panels inert and reveals the mechanical stage", async ({ page }) => {
  await page.goto("/work?mode=cgi");
  await waitForRolodexIdle(page, "Project One");
  await page.locator(".rolodex-track").evaluate(el => {
    for (const deltaY of [1, 2, 8, 20, 15, 7]) el.dispatchEvent(new WheelEvent("wheel", {deltaY, bubbles:true, cancelable:true}));
  });
  await expect(page.locator(".rolodex-track")).toHaveAttribute("data-phase", "motion");
  await expect(page.locator('.rolodex-panel:not([inert])')).toHaveCount(0);
  await waitForRolodexIdle(page, "Project Two");
  await expect(page.locator('.rolodex-panel:not([inert])')).toHaveCount(1);
  await expect(page.locator('.rolodex-panel[data-state="stack"]').first()).toBeHidden();
});
