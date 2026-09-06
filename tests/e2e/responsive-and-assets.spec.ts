import { expect, type Page, test } from "@playwright/test";

import {
  buttonBox,
  expectElementInsideViewport,
  expectMinTapTarget,
  expectNoHorizontalOverflow,
  responsiveViewports,
} from "./helpers";

const primaryRoutes = [
  "/",
  "/about",
  "/photography",
  "/work?mode=cgi",
  "/work?mode=stills",
  "/work/stills/2024/goodwood",
  "/cgi/project-one",
  "/cgi/project-five",
  "/definitely-not-a-real-route",
] as const;

async function expectPersistentHomeLogo(page: Page) {
  const home = page.getByRole("link", { name: "Home" }).first();

  await expectElementInsideViewport(home, "persistent AK home logo");
  await expectMinTapTarget(home, "persistent AK home logo");

  const box = await home.boundingBox();
  expect(box, "persistent AK home logo should have a bounding box").not.toBeNull();
  expect(box!.height).toBeGreaterThanOrEqual(40);

  await home.focus();
  await expect(home).toBeFocused();
}

test.describe("responsive layout, assets, and controls", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Detailed responsive audit runs in Chromium.");

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

  for (const viewport of responsiveViewports) {
    test(`keeps primary UI contained at ${viewport.width}x${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await expectElementInsideViewport(page.getByRole("navigation", { name: "Primary destinations" }), "Home destinations");

      await page.goto("/work?mode=cgi");
      await expectElementInsideViewport(
        page.locator(".work-mode-control"),
        "Work mode switch",
      );
      await expectMinTapTarget(
        page.getByRole("radio", { name: /^CGI$/ }),
        "CGI mode option",
      );
      await expectMinTapTarget(
        page.getByRole("radio", { name: "STILLS" }),
        "Stills mode option",
      );

      await page.goto("/definitely-not-a-real-route");
      await expectElementInsideViewport(
        page.getByRole("heading", { name: /off route/i }),
        "404 heading",
      );
      await expectElementInsideViewport(
        page.getByRole("link", { name: /return home/i }),
        "404 return button",
      );

      await page.goto("/about");
      await page.getByRole("button", { name: /get in touch/i }).first().click();
      const contactDialog = page.getByRole("dialog", { name: /get in touch/i });
      await expectElementInsideViewport(contactDialog, "About contact layer");
      await expectElementInsideViewport(
        contactDialog.getByRole("button", { name: /close contact panel/i }),
        "Contact close button",
      );

      for (const method of ["Email", "Instagram", "LinkedIn"]) {
        await expectMinTapTarget(
          contactDialog.locator("[data-contact-action]").filter({ hasText: method }),
          `${method} contact action`,
        );
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

  test("keeps the AK Home logo larger and accessible across representative routes", async ({
    page,
  }) => {
    const logoRoutes = [
      "/",
      "/about",
      "/photography",
      "/work?mode=cgi",
      "/work/stills/2024/goodwood",
      "/cgi/project-one",
      "/cgi/project-five",
    ] as const;
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1440, height: 900 },
      { width: 1366, height: 768 },
      { width: 1024, height: 768 },
      { width: 430, height: 932 },
      { width: 390, height: 844 },
    ] as const;

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      for (const route of logoRoutes) {
        await page.goto(route);
        await expectPersistentHomeLogo(page);
        await expectNoHorizontalOverflow(page);
      }
    }

    await page.goto("/work/stills/2024/goodwood");
    await page.getByRole("link", { name: "Home" }).first().click();
    await expect(page).toHaveURL("/");

    await page.goto("/definitely-not-a-real-route");
    await expect(page.getByRole("link", { name: /return home/i })).toBeVisible();
  });

  test("keeps major CTA buttons substantial and pointer-reactive", async ({
    page,
  }) => {
    await page.goto("/work?mode=cgi");
    const explore = page.locator('.rolodex-panel[data-state="active"] .rolodex-project-hit-area');
    await expect(explore).toBeVisible();
    const exploreBox = await explore.boundingBox();

    expect(exploreBox?.height ?? 0).toBeGreaterThanOrEqual(300);
    expect(exploreBox?.width ?? 0).toBeGreaterThan(300);
    await expect(explore).toHaveAttribute("href", "/cgi/project-one");

    const visibleCta = page.locator('.rolodex-panel[data-state="active"] .rolodex-liquid-cta');
    await expect(visibleCta).toBeVisible();
    const beforeTransform = await visibleCta.evaluate((element) => getComputedStyle(element).transform);
    const box = await explore.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move((box?.x ?? 0) + 18, (box?.y ?? 0) + 18);
    await page.waitForTimeout(50);
    const transform = await visibleCta.evaluate((element) => getComputedStyle(element).transform);

    expect(transform).toBe(beforeTransform);



    await page.goto("/about");
    const contact = await buttonBox(page, /get in touch/i);
    expect(contact.height).toBeGreaterThanOrEqual(56);
  });

});
