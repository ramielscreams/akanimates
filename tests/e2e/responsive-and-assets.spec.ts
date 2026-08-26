import { expect, test } from "@playwright/test";

import {
  buttonBox,
  expectNoHorizontalOverflow,
  responsiveViewports,
} from "./helpers";

const primaryRoutes = [
  "/",
  "/about",
  "/photography",
  "/cgi",
  "/photography/project-one",
  "/cgi/project-one",
  "/design/project-one",
  "/definitely-not-a-real-route",
] as const;

test.describe("responsive layout, assets, and controls", () => {
  for (const viewport of responsiveViewports) {
    test(`has no unintended horizontal overflow at ${viewport.width}x${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);

      for (const route of primaryRoutes) {
        await page.goto(route);
        await expectNoHorizontalOverflow(page);
      }
    });
  }

  test("serves the transparent SVG icon through the App Router icon route", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const icons = await page.locator('link[rel~="icon"]').evaluateAll((links) =>
      links.map((link) => ({
        href: (link as HTMLLinkElement).href,
        rel: (link as HTMLLinkElement).rel,
      })),
    );

    expect(icons.length).toBeGreaterThan(0);
    expect(icons.some((icon) => icon.href.includes("/icon"))).toBe(true);

    const response = await request.get("/icon.svg");
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");

    const svg = await response.text();
    expect(svg).toContain("<svg");
    expect(svg).toContain("viewBox");
    expect(svg).not.toMatch(/<rect[^>]+(width=["']100%|fill=["']#050307|fill=["']black)/i);
  });

  test("keeps major CTA buttons substantial and pointer-reactive", async ({
    page,
  }) => {
    await page.goto("/");
    const explore = page.getByRole("link", { name: /explore profile/i });
    await expect(explore).toBeVisible();
    const exploreBox = await explore.boundingBox();

    expect(exploreBox?.height ?? 0).toBeGreaterThanOrEqual(56);
    expect(exploreBox?.width ?? 0).toBeGreaterThan(130);

    const beforeTransform = await explore.evaluate((element) => getComputedStyle(element).transform);
    const beforeMove = await explore.evaluate((element) =>
      getComputedStyle(element).getPropertyValue("--mouse-x"),
    );
    const box = await explore.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move((box?.x ?? 0) + 18, (box?.y ?? 0) + 18);
    await page.waitForTimeout(50);
    const afterMove = await explore.evaluate((element) =>
      getComputedStyle(element).getPropertyValue("--mouse-x"),
    );
    const transform = await explore.evaluate((element) => getComputedStyle(element).transform);

    expect(afterMove.trim()).not.toBe(beforeMove.trim());
    expect(transform).toBe(beforeTransform);

    await page.goto("/cgi");
    const returnHome = await buttonBox(page, /return home/i);
    expect(returnHome.height).toBeGreaterThanOrEqual(56);

    await page.goto("/about");
    const contact = await buttonBox(page, /get in touch/i);
    expect(contact.height).toBeGreaterThanOrEqual(56);
  });

  test("keeps the CGI / Design selector usable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/cgi");

    const mobileControl = page.locator(".cgi-mode-control-shell--mobile .cgi-mode-control");
    await expect(mobileControl).toBeVisible();
    await expect(page.locator(".cgi-mode-control-shell--desktop")).toBeHidden();

    const box = await mobileControl.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

    await mobileControl.getByRole("button", { name: "Design" }).click();
    await expect(page).toHaveURL(/\/cgi#design$/);
    await expect(
      mobileControl.locator('button[aria-pressed="true"]'),
    ).toHaveText("Design");
  });

  test("uses direct jumps for CGI chapter navigation with reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/cgi");
    await page
      .locator(".cgi-mode-control-shell--desktop")
      .getByRole("button", { name: "Design" })
      .click();
    await expect(page).toHaveURL(/\/cgi#design$/);

    const designTop = await page
      .locator("#design")
      .evaluate((element) => Math.round(element.getBoundingClientRect().top));

    expect(Math.abs(designTop)).toBeLessThanOrEqual(160);
  });
});
