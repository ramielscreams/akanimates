import { expect, test } from "@playwright/test";

import {
  clickRolodexNav,
  desktopViewports,
  expectNoConsoleFailures,
  expectNoHorizontalOverflow,
  expectRolodexFocusedContainment,
  expectRolodexHeadingFont,
  waitForRolodexIdle,
} from "./helpers";

test.describe("homepage Rolodex", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Detailed Rolodex motion audit runs in Chromium.");

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
    await expect(nav.nth(1)).toContainText("02 / photography");
    await expect(nav.nth(2)).toContainText("03 / visualization");
    await expect(page.locator(".rolodex-nav")).not.toContainText(/stills|cgi|design|contact/i);

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
      await expectRolodexFocusedContainment(page);
      await expectRolodexHeadingFont(page);
      await expectNoHorizontalOverflow(page);

      await clickRolodexNav(page, "photography");
      await waitForRolodexIdle(page, "Photography");
      await expectRolodexFocusedContainment(page);
      await expectRolodexHeadingFont(page);
      await expectNoHorizontalOverflow(page);

      await clickRolodexNav(page, "visualization");
      await waitForRolodexIdle(page, "Visualization");
      await expectRolodexFocusedContainment(page);
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
    await waitForRolodexIdle(page, "Photography");

    await page.mouse.wheel(0, 1200);
    await waitForRolodexIdle(page, "Visualization");

    await page.mouse.wheel(0, 1200);
    await waitForRolodexIdle(page, "About");

    const expected = [
      "Photography",
      "Visualization",
      "About",
      "Photography",
      "Visualization",
    ];
    for (const title of expected) {
      await page.mouse.wheel(0, 700);
      await waitForRolodexIdle(page, title);
      await expectRolodexFocusedContainment(page);
    }
  });

  test("supports one-panel touch swipes on mobile", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Synthetic touch audit uses Chromium input APIs.");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await waitForRolodexIdle(page, "About");

    const client = await page.context().newCDPSession(page);
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 220, y: 640 }],
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 220, y: 540 }],
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await waitForRolodexIdle(page, "Photography");

    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 220, y: 540 }],
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 220, y: 680 }],
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await waitForRolodexIdle(page, "About");
  });

  test("keeps homepage controls keyboard reachable", async ({ page }) => {
    await page.goto("/");
    await waitForRolodexIdle(page, "About");

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Home" })).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: /01 \/ about/i })).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: /02 \/ photography/i }),
    ).toBeFocused();

    await page.keyboard.press("Enter");
    await waitForRolodexIdle(page, "Photography");

    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: /03 \/ visualization/i }),
    ).toBeFocused();
  });

  test("direct navigation wraps forward without exposing Design as a destination", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForRolodexIdle(page, "About");

    await clickRolodexNav(page, "visualization");
    await expect(page.locator('.rolodex-nav-item[data-pending="true"]')).toContainText(
      "03 / visualization",
    );
    await waitForRolodexIdle(page, "Visualization");

    await clickRolodexNav(page, "photography");
    await waitForRolodexIdle(page, "Photography");
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
    await waitForRolodexIdle(page, "Photography");
  });

  test("logo resets the homepage to About", async ({ page }) => {
    await page.goto("/");
    await clickRolodexNav(page, "visualization");
    await waitForRolodexIdle(page, "Visualization");

    await page.getByRole("link", { name: "Home" }).click();
    await page.waitForLoadState("networkidle");
    await waitForRolodexIdle(page, "About");
  });
});
