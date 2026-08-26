import { expect, type Locator, test } from "@playwright/test";

import {
  buttonBox,
  expectNoConsoleFailures,
  expectNoHorizontalOverflow,
} from "./helpers";

async function expectDisplayFont(locator: Locator) {
  const style = await locator.evaluate((element) => {
    const computed = getComputedStyle(element);

    return {
      family: computed.fontFamily,
      textTransform: computed.textTransform,
      weight: computed.fontWeight,
    };
  });

  expect(style.family).toContain("Barlow");
  expect(Number(style.weight)).toBe(900);
}

test.describe("interior wayfinding and typography", () => {
  test("normalizes major interior display headings to Barlow Condensed", async ({
    page,
  }) => {
    const checks = [
      { path: "/about", selector: "h1" },
      { path: "/about#contact", selector: "#contact-heading" },
      { path: "/photography", selector: "h1" },
      { path: "/cgi", selector: "h1" },
      { path: "/cgi#design", selector: "#design h1" },
      { path: "/photography/project-one", selector: "h1" },
      { path: "/cgi/project-one", selector: "h1" },
      { path: "/design/project-one", selector: "h1" },
      { path: "/missing-route-for-404", selector: "h1" },
    ];

    for (const check of checks) {
      await page.goto(check.path);
      await expect(page.locator(check.selector).first()).toBeVisible();
      await expectDisplayFont(page.locator(check.selector).first());
      await expectNoHorizontalOverflow(page);
    }
  });

  test("keeps About and Contact in one destination and redirects /contact", async ({
    page,
  }) => {
    await page.goto("/about");
    await expect(page.locator("#contact")).toBeVisible();
    await expect(page.getByRole("heading", { name: /have a project in mind/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /email/i })).toBeVisible();

    const response = await page.goto("/contact");
    expect(response?.status()).toBe(200);
    expect(page.url()).toContain("/about#contact");
    await expect(page.locator("#contact")).toBeVisible();
  });

  test("uses the CGI / Design mode selector as local wayfinding", async ({
    page,
  }) => {
    await page.goto("/cgi");

    const desktopControl = page.locator(".cgi-mode-control-shell--desktop .cgi-mode-control");
    await expect(desktopControl).toBeVisible();
    await expect(page.getByRole("heading", { name: /^CGI$/ })).toBeVisible();
    await expect(page.locator("#design")).toBeVisible();

    await expect(
      page.locator('.cgi-mode-control-shell--desktop button[aria-pressed="true"]'),
    ).toHaveText("CGI");

    await page
      .locator(".cgi-mode-control-shell--desktop")
      .getByRole("button", { name: "Design" })
      .click();
    await expect(page).toHaveURL(/\/cgi#design$/);
    await expect(
      page.locator('.cgi-mode-control-shell--desktop button[aria-pressed="true"]'),
    ).toHaveText("Design");

    await page
      .locator(".cgi-mode-control-shell--desktop")
      .getByRole("button", { name: /^CGI$/ })
      .press("Enter");
    await expect(page).toHaveURL(/\/cgi$/);
    await expect(
      page.locator('.cgi-mode-control-shell--desktop button[aria-pressed="true"]'),
    ).toHaveText("CGI");

    await page.evaluate(() => document.getElementById("design")?.scrollIntoView());
    await expect(
      page.locator('.cgi-mode-control-shell--desktop button[aria-pressed="true"]'),
    ).toHaveText("Design", { timeout: 2_000 });

    await page.evaluate(() => document.getElementById("cgi")?.scrollIntoView());
    await expect(
      page.locator('.cgi-mode-control-shell--desktop button[aria-pressed="true"]'),
    ).toHaveText("CGI", { timeout: 2_000 });
  });

  test("keeps Design index compatibility while project routes remain independent", async ({
    page,
  }) => {
    await page.goto("/design");
    await expect(page).toHaveURL(/\/cgi#design$/);

    await page.goto("/design/project-one");
    await expect(page).toHaveURL(/\/design\/project-one$/);
    await expect(page.locator("article .site-technical-label").first()).toContainText(
      /cgi \/ design/i,
    );

    await page.getByRole("link", { name: /back to design/i }).click();
    await expect(page).toHaveURL(/\/cgi#design$/);
  });

  test("opens an opaque interior menu with keyboard focus management", async ({
    page,
  }) => {
    await page.goto("/photography");
    const menuButton = page.getByRole("button", { name: /open navigation menu/i });

    await menuButton.focus();
    await expect(menuButton).toBeFocused();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: /site navigation/i });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCSS("background-color", "rgb(5, 3, 7)");
    await expect(page.getByRole("link", { name: "Home", exact: true })).toBeVisible();
    await expect(dialog).not.toContainText(/design|contact|photography/i);
    await expect(dialog).toContainText(/about/i);
    await expect(dialog).toContainText(/cgi/i);

    const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
    expect(bodyOverflow).toBe("hidden");

    await expect(page.locator(":focus")).toContainText(/about/i);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(menuButton).toBeFocused();

    const restoredOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
    expect(restoredOverflow).not.toBe("hidden");
  });

  test("renders a usable custom 404", async ({ page }) => {
    await page.goto("/definitely-not-a-real-route");
    await expect(page.getByText(/error \/ 404/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /off route/i })).toBeVisible();

    const button = await buttonBox(page, /return home/i);
    expect(button.height).toBeGreaterThanOrEqual(56);
    await page.getByRole("link", { name: /return home/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("has no console failures on primary interior routes", async ({ page }) => {
    const assertNoFailures = await expectNoConsoleFailures(page);

    for (const path of [
      "/about",
      "/photography",
      "/cgi",
      "/cgi#design",
      "/photography/project-one",
      "/cgi/project-one",
      "/design/project-one",
    ]) {
      await page.goto(path);
      await expectNoHorizontalOverflow(page);
    }

    await assertNoFailures();
  });
});
