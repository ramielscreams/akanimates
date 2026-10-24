import { expect, type Page, test } from "@playwright/test";
import { cgiProjects, projectHref } from "../../src/data/work-projects";

import {
  buttonBox,
  expectElementInsideViewport,
  expectMinTapTarget,
  expectNoHorizontalOverflow,
  expectWorkModeLabelsDoNotWrap,
  modeRadioNames,
  responsiveViewports,
} from "./helpers";

const firstCgiProject = cgiProjects[0];
const fifthCgiProject = cgiProjects[4];

const primaryRoutes = [
  "/",
  "/about",
  "/photography",
  "/work?mode=cgi",
  "/work?mode=stills",
  "/work/stills/2024/goodwood",
  projectHref(firstCgiProject),
  projectHref(fifthCgiProject),
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
        page.getByRole("radio", { name: modeRadioNames.cgi }),
        "CGI mode option",
      );
      await expectMinTapTarget(
        page.getByRole("radio", { name: modeRadioNames.stills }),
        "Stills mode option",
      );
      await expectWorkModeLabelsDoNotWrap(page);

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

  test("reflows the six-photo opening grid during live viewport resizing", async ({
    page,
  }) => {
    const cases = [
      { width: 320, height: 568, columns: 1, rows: 6 },
      { width: 390, height: 844, columns: 1, rows: 6 },
      { width: 768, height: 1024, columns: 2, rows: 3 },
      { width: 900, height: 700, columns: 2, rows: 3 },
      { width: 1280, height: 720, columns: 6, rows: 1 },
      { width: 1440, height: 900, columns: 3, rows: 2 },
      { width: 1920, height: 1080, columns: 3, rows: 2 },
      { width: 2560, height: 1440, columns: 6, rows: 1 },
    ] as const;

    await page.goto("/work?mode=stills");
    const grid = page.locator(".stills-selection__grid");
    const tiles = page.locator(".stills-selection-tile");

    for (const viewport of cases) {
      await page.setViewportSize(viewport);
      await expect(grid).toBeVisible();
      await expect(tiles).toHaveCount(6);
      await page.waitForFunction(() => {
        const element = document.querySelector<HTMLElement>(
          ".stills-selection__grid",
        );
        return Boolean(element && element.getBoundingClientRect().width > 0);
      });

      const layout = await grid.evaluate((element) => {
        const cards = Array.from(
          element.querySelectorAll<HTMLElement>(".stills-selection-tile"),
        );
        const positions = cards.map((card) => {
          const rect = card.getBoundingClientRect();
          return {
            left: Math.round(rect.left),
            top: Math.round(rect.top),
            right: rect.right,
            bottom: rect.bottom,
          };
        });
        const unique = (values: number[]) => [...new Set(values)].length;
        const rect = element.getBoundingClientRect();

        return {
          columns: unique(positions.map(({ left }) => left)),
          rows: unique(positions.map(({ top }) => top)),
          gridRight: rect.right,
          viewportWidth: window.innerWidth,
          contained: positions.every(
            ({ left, right, top, bottom }) =>
              left >= rect.left - 1 &&
              right <= rect.right + 1 &&
              top >= rect.top - 1 &&
              bottom <= rect.bottom + 1,
          ),
        };
      });

      expect(layout.columns, `${viewport.width}x${viewport.height} columns`).toBe(
        viewport.columns,
      );
      expect(layout.rows, `${viewport.width}x${viewport.height} rows`).toBe(
        viewport.rows,
      );
      expect(layout.gridRight).toBeLessThanOrEqual(layout.viewportWidth + 1);
      expect(layout.contained).toBe(true);
      await expectNoHorizontalOverflow(page);
    }
  });

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
      projectHref(firstCgiProject),
      projectHref(fifthCgiProject),
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
    const tile = page.getByRole("button", { name: new RegExp(`open cgi project ${firstCgiProject.index}, ${firstCgiProject.title}`, "i") });
    await expect(tile).toBeVisible();
    const tileBox = await tile.boundingBox();

    expect(tileBox?.height ?? 0).toBeGreaterThanOrEqual(220);
    expect(tileBox?.width ?? 0).toBeGreaterThan(300);
    await page.mouse.move((tileBox?.x ?? 0) + 18, (tileBox?.y ?? 0) + 18);
    await page.waitForTimeout(50);
    await expect(page.locator(".cgi-project-tile").first()).toHaveAttribute("data-hovered", "true");

    await tile.click();
    await expect(page).toHaveURL(new RegExp(`/work\\?mode=cgi&project=${firstCgiProject.slug}$`));
    await expect(page.getByRole("heading", { name: firstCgiProject.title, exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: new RegExp(`play ${firstCgiProject.title}`, "i") })).toBeVisible();



    await page.goto("/about");
    const contact = await buttonBox(page, /get in touch/i);
    expect(contact.height).toBeGreaterThanOrEqual(44);
  });

});
