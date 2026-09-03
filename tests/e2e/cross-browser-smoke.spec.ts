import { expect, test } from "@playwright/test";

import {
  expectElementInsideViewport,
  expectNoConsoleFailures,
  expectNoHorizontalOverflow,
  waitForRolodexIdle,
} from "./helpers";

test.describe("cross-browser smoke", () => {
  test("loads core routes without overflow, broken icons, or mode-state drift", async ({
    page,
    request,
  }) => {
    const assertNoFailures = await expectNoConsoleFailures(page);

    await page.goto("/");
    await waitForRolodexIdle(page, "About");
    await expect(page.locator(".rolodex-nav-item")).toHaveCount(3);
    await expect(page.locator(".rolodex-nav")).toContainText("03 / visualization");
    await expectElementInsideViewport(
      page.locator('.rolodex-panel[data-state="active"] .rolodex-heading'),
      "homepage heading",
    );
    await expectNoHorizontalOverflow(page);

    await page.goto("/photography");
    await expect(page.getByRole("heading", { name: /^Photography$/i })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.goto("/visualization");
    const modeControl = page.locator(".visualization-mode-control");
    await expect(modeControl).toBeVisible();
    await expect(modeControl.locator('button[aria-checked="true"]')).toHaveText("CGI");
    await expect(page.locator(".visualization-content #selected-cgi-work")).toBeVisible();
    await expect(page.locator(".visualization-content #selected-design-work")).toHaveCount(0);
    await expectNoHorizontalOverflow(page);

    await modeControl.getByRole("radio", { name: "Design" }).click();
    await expect(page).toHaveURL(/\/visualization\?mode=design$/);
    await expect(modeControl.locator('button[aria-checked="true"]')).toHaveText("Design");
    await expect(page.locator(".visualization-content #selected-design-work")).toBeVisible();
    await expect(page.locator(".visualization-content #selected-cgi-work")).toHaveCount(0);
    await expectNoHorizontalOverflow(page);

    await page.goto("/cgi/project-one");
    await expect(page.getByRole("link", { name: /back to cgi/i })).toHaveAttribute(
      "href",
      "/visualization?mode=cgi",
    );
    await expectNoHorizontalOverflow(page);

    await page.goto("/design/project-one");
    await expect(page.getByRole("link", { name: /back to design/i })).toHaveAttribute(
      "href",
      "/visualization?mode=design",
    );
    await expectNoHorizontalOverflow(page);

    const iconResponse = await request.get("/icon.svg");
    expect(iconResponse.ok()).toBe(true);

    await assertNoFailures();

    await page.goto("/definitely-not-a-real-route");
    await expectElementInsideViewport(
      page.getByRole("link", { name: /return home/i }),
      "404 return button",
    );
    await expectNoHorizontalOverflow(page);
  });

  test("supports keyboard interaction for menu and Visualization mode selector", async ({
    browserName,
    page,
  }) => {
    await page.goto("/visualization");

    const menuButton = page.getByRole("button", { name: /open navigation menu/i });
    await expect(menuButton).toHaveAttribute("data-ready", "true");
    if (browserName === "webkit") {
      await menuButton.focus();
    } else {
      await page.keyboard.press("Tab");
      await expect(page.getByRole("link", { name: "Home", exact: true })).toBeFocused();
      await page.keyboard.press("Tab");
    }
    await expect(menuButton).toBeFocused();
    await menuButton.press("Enter");

    const dialog = page.getByRole("dialog", { name: /site navigation/i });
    await expect(dialog).toBeVisible();
    await expect(page.locator(":focus")).toContainText(/about/i);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(menuButton).toBeFocused();

    const cgiOption = page.getByRole("radio", { name: /^CGI$/ });
    if (browserName === "webkit") {
      await cgiOption.focus();
    } else {
      await page.keyboard.press("Tab");
    }
    await expect(cgiOption).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/\/visualization\?mode=design$/);
    await expect(page.locator(".visualization-content #selected-design-work")).toBeVisible();
    await expect(page.locator(".visualization-content #selected-cgi-work")).toHaveCount(0);
  });
});
