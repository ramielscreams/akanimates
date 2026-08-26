import { expect, test } from "@playwright/test";

import {
  clickRolodexNav,
  desktopViewports,
  expectNoConsoleFailures,
  expectNoHorizontalOverflow,
  expectRolodexContentCentered,
  expectRolodexHeadingFont,
  waitForRolodexIdle,
} from "./helpers";

test.describe("homepage Rolodex", () => {
  test("renders the three top-level destinations with readable nav and logo", async ({
    page,
  }) => {
    const assertNoFailures = await expectNoConsoleFailures(page);

    await page.goto("/");
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(page.locator('img[src="/logo.svg"]')).toBeVisible();

    const nav = page.locator(".rolodex-nav-item");
    await expect(nav).toHaveCount(3);
    await expect(nav.nth(0)).toContainText("01 / about");
    await expect(nav.nth(1)).toContainText("02 / stills");
    await expect(nav.nth(2)).toContainText("03 / cgi");
    await expect(page.locator(".rolodex-nav")).not.toContainText(/design|contact|photography/i);

    const inactiveColor = await nav.nth(1).evaluate((element) => getComputedStyle(element).color);
    const activeColor = await nav.nth(0).evaluate((element) => getComputedStyle(element).color);

    expect(inactiveColor).toBe("rgb(194, 189, 197)");
    expect(activeColor).toBe("rgb(255, 255, 255)");
    const activeMarker = await nav.nth(0).evaluate((element) => {
      const marker = getComputedStyle(element, "::before");

      return {
        background: marker.backgroundColor,
        content: marker.content,
        height: marker.height,
        width: marker.width,
      };
    });

    expect(activeMarker.content).not.toBe("none");
    expect(activeMarker.background).toBe("rgb(209, 45, 76)");
    expect(Number.parseFloat(activeMarker.width)).toBeGreaterThan(0);
    expect(Number.parseFloat(activeMarker.height)).toBeGreaterThan(0);

    await expectNoHorizontalOverflow(page);
    await assertNoFailures();
  });

  for (const viewport of desktopViewports) {
    test(`keeps focused content on the usable-area axis at ${viewport.width}x${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await waitForRolodexIdle(page, "About");
      await expectRolodexContentCentered(page);
      await expectRolodexHeadingFont(page);
      await expectNoHorizontalOverflow(page);

      await clickRolodexNav(page, "stills");
      await waitForRolodexIdle(page, "Stills");
      await expectRolodexContentCentered(page);
      await expectRolodexHeadingFont(page);
      await expectNoHorizontalOverflow(page);

      await clickRolodexNav(page, "cgi");
      await waitForRolodexIdle(page, "CGI");
      await expectRolodexContentCentered(page);
      await expectRolodexHeadingFont(page);
      await expectNoHorizontalOverflow(page);
    });
  }

  test("uses one wheel gesture for one panel and settles repeatedly", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForRolodexIdle(page, "About");

    await page.mouse.wheel(0, 900);
    await waitForRolodexIdle(page, "Stills");

    await page.mouse.wheel(0, 1200);
    await waitForRolodexIdle(page, "CGI");

    await page.mouse.wheel(0, 1200);
    await waitForRolodexIdle(page, "About");

    const expected = ["Stills", "CGI", "About", "Stills", "CGI"];
    for (const title of expected) {
      await page.mouse.wheel(0, 700);
      await waitForRolodexIdle(page, title);
      await expectRolodexContentCentered(page);
    }
  });

  test("direct navigation wraps forward without exposing Design as a destination", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForRolodexIdle(page, "About");

    await clickRolodexNav(page, "cgi");
    await expect(page.locator('.rolodex-nav-item[data-pending="true"]')).toContainText(
      "03 / cgi",
    );
    await waitForRolodexIdle(page, "CGI");

    await clickRolodexNav(page, "stills");
    await waitForRolodexIdle(page, "Stills");
  });

  test("reveals purple mechanical space only during movement", async ({ page }) => {
    await page.goto("/");
    await waitForRolodexIdle(page, "About");

    const atRest = await page.locator(".rolodex-atmosphere").evaluate((element) => {
      const computed = getComputedStyle(element);

      return {
        background: computed.backgroundImage,
        opacity: Number.parseFloat(computed.opacity),
      };
    });

    expect(atRest.opacity).toBeLessThan(0.02);
    expect(atRest.background).toContain("36, 5, 63");
    expect(atRest.background).toContain("142, 105, 174");

    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(180);

    const duringMotion = await page.locator(".rolodex-atmosphere").evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).opacity),
    );
    const activePanelBg = await page
      .locator(".rolodex-panel")
      .first()
      .evaluate((element) => getComputedStyle(element).backgroundColor);

    expect(duringMotion).toBeGreaterThan(0.08);
    expect(activePanelBg).toBe("rgb(5, 3, 7)");
    await waitForRolodexIdle(page, "Stills");
  });

  test("logo resets the homepage to About", async ({ page }) => {
    await page.goto("/");
    await clickRolodexNav(page, "cgi");
    await waitForRolodexIdle(page, "CGI");

    await page.getByRole("link", { name: "Home" }).click();
    await page.waitForLoadState("networkidle");
    await waitForRolodexIdle(page, "About");
  });
});
