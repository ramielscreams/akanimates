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

test("Stills Rolodex keeps its stage aligned during live viewport resizing", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Detailed live viewport geometry runs in Chromium.");

  const viewports = [
    { width: 900, height: 700 },
    { width: 1920, height: 1080 },
    { width: 900, height: 700 },
    { width: 1280, height: 720 },
    { width: 1440, height: 900 },
    { width: 768, height: 1024 },
    { width: 2560, height: 1440 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
  ] as const;

  await page.setViewportSize(viewports[0]);
  await page.goto("/work?mode=stills");
  await page.locator(".rolodex-shell").scrollIntoViewIfNeeded();
  await waitForRolodexIdle(page, "2026");

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.waitForFunction(() => {
      const track = document.querySelector<HTMLElement>(".rolodex-track");
      const active = document.querySelector<HTMLElement>(
        '.rolodex-scene-wrap[data-state="active"]',
      );

      return Boolean(
        track &&
          active &&
          track.getBoundingClientRect().width > 0 &&
          track.getBoundingClientRect().height > 0 &&
          active.getBoundingClientRect().width > 0,
      );
    });

    const geometry = await page.evaluate(() => {
      const track = document.querySelector<HTMLElement>(".rolodex-track");
      const active = document.querySelector<HTMLElement>(
        '.rolodex-scene-wrap[data-state="active"]',
      );
      const trackRect = track!.getBoundingClientRect();
      const activeRect = active!.getBoundingClientRect();

      return {
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        track: {
          width: trackRect.width,
          height: trackRect.height,
        },
        active: {
          width: activeRect.width,
          height: activeRect.height,
        },
        aligned:
          Math.abs(trackRect.width - activeRect.width) <= 2 &&
          Math.abs(trackRect.height - activeRect.height) <= 2,
      };
    });

    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.viewportWidth + 2);
    expect(geometry.aligned, `${viewport.width}x${viewport.height} stage alignment`).toBe(true);
    expect(geometry.track.width).toBeGreaterThan(0);
    expect(geometry.track.height).toBeGreaterThan(0);
  }

});
