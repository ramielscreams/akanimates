import { expect, type Locator, type Page, test } from "@playwright/test";

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

async function expectAboutGridAlignment(page: Page) {
  await expectNoHorizontalOverflow(page);

  const metrics = await page.evaluate(() => {
    const rectFor = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      const rect = element?.getBoundingClientRect();

      if (!rect) {
        return null;
      }

      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      };
    };

    return {
      frames: Array.from(document.querySelectorAll<HTMLElement>(".about-frame")).map(
        (element) => {
          const rect = element.getBoundingClientRect();

          return {
            left: rect.left,
            right: rect.right,
            width: rect.width,
          };
        },
      ),
      heading: rectFor(".about-hero h1"),
      intro: rectFor(".about-intro .site-prose"),
      bio: rectFor(".about-bio-experience .about-intro"),
      experience: rectFor(".about-experience"),
      role: rectFor("#about-disciplines"),
      location: rectFor("#about-availability"),
      contactHeading: rectFor("#contact-heading"),
      contactTrigger: rectFor(".about-contact-row .contact-launch"),
      closing: rectFor(".about-closing-nav__inner"),
      viewportWidth: window.innerWidth,
    };
  });

  expect(metrics.frames.length, "About should use repeated shared frames").toBeGreaterThanOrEqual(3);

  const [firstFrame] = metrics.frames;

  for (const [index, frame] of metrics.frames.entries()) {
    expect(Math.abs(frame.left - firstFrame.left), `frame ${index + 1} left edge`).toBeLessThanOrEqual(1);
    expect(Math.abs(frame.right - firstFrame.right), `frame ${index + 1} right edge`).toBeLessThanOrEqual(1);
  }

  for (const [name, rect] of Object.entries({
    heading: metrics.heading,
    intro: metrics.intro,
    bio: metrics.bio,
    contactHeading: metrics.contactHeading,
    closing: metrics.closing,
  })) {
    expect(rect, `${name} should be measurable`).not.toBeNull();
    expect(
      Math.abs(rect!.left - firstFrame.left),
      `${name} should align to the About frame left edge`,
    ).toBeLessThanOrEqual(2);
  }

  expect(metrics.contactTrigger, "contact CTA should be measurable").not.toBeNull();
  expect(metrics.experience, "About experience column should be measurable").not.toBeNull();
  expect(metrics.bio, "About biography column should be measurable").not.toBeNull();
  expect(metrics.role, "About role label should be measurable").not.toBeNull();
  expect(metrics.location, "About location label should be measurable").not.toBeNull();

  expect(
    metrics.heading!.top,
    "About content should begin without an oversized hero gap",
  ).toBeLessThan(metrics.viewportWidth >= 1024 ? 170 : 150);

  if (metrics.viewportWidth >= 1024) {
    expect(metrics.experience!.left).toBeGreaterThan(metrics.bio!.right);
    expect(metrics.experience!.right).toBeLessThanOrEqual(firstFrame.right + 1);
    expect(metrics.bio!.width).toBeGreaterThan(metrics.experience!.width);
    expect(
      Math.abs(metrics.experience!.top - metrics.heading!.top),
      "ABOUT and Experience should remain in the same opening band",
    ).toBeLessThanOrEqual(48);
    expect(metrics.bio!.top).toBeGreaterThan(metrics.heading!.bottom);
    expect(metrics.role!.left).toBeGreaterThan(metrics.experience!.left);
    expect(Math.abs(metrics.location!.left - metrics.role!.left)).toBeLessThanOrEqual(2);
    expect(
      metrics.contactHeading!.top - Math.max(metrics.bio!.bottom, metrics.experience!.bottom),
      "next About section should begin without excessive bottom whitespace",
    ).toBeLessThanOrEqual(220);
  } else {
    expect(metrics.bio!.top).toBeGreaterThan(metrics.heading!.bottom);
    expect(metrics.experience!.top).toBeGreaterThan(metrics.bio!.bottom);
    expect(
      metrics.contactHeading!.top - metrics.experience!.bottom,
      "mobile next section should follow the stacked opening without excessive whitespace",
    ).toBeLessThanOrEqual(190);
  }

  expect(metrics.role!.top).toBeGreaterThan(metrics.experience!.top);
  expect(metrics.location!.top).toBeGreaterThan(metrics.role!.bottom);
  await expect(page.locator(".about-detail-stack")).toHaveCount(0);

  if (metrics.viewportWidth >= 768) {
    expect(metrics.contactTrigger!.left).toBeGreaterThan(metrics.contactHeading!.right);
    expect(Math.abs(metrics.contactTrigger!.right - firstFrame.right)).toBeLessThanOrEqual(2);
  } else {
    expect(metrics.contactTrigger!.top).toBeGreaterThan(metrics.contactHeading!.bottom);
    expect(metrics.contactTrigger!.left).toBeGreaterThanOrEqual(firstFrame.left - 1);
    expect(metrics.contactTrigger!.right).toBeLessThanOrEqual(firstFrame.right + 1);
  }
}

test.describe("interior wayfinding and typography", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Detailed interior audit runs in Chromium.");

  test("normalizes major interior display headings to Barlow Condensed", async ({
    page,
  }) => {
    const checks = [
      { path: "/about", selector: "h1" },
      { path: "/about#contact", selector: "#contact-heading" },
      { path: "/work/stills/2024/goodwood", selector: "h1" },
      { path: "/cgi/project-one", selector: "h1" },
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
    await expect(page.getByRole("heading", { name: /^contact$/i })).toBeVisible();
    await expect(page.locator("#contact").getByText(/whatsapp details pending|phone details pending/i)).toHaveCount(0);

    const response = await page.goto("/contact");
    expect(response?.status()).toBe(200);
    expect(page.url()).toContain("/about#contact");
    await expect(page.locator("#contact")).toBeVisible();
    await expect(page.getByRole("dialog", { name: /get in touch/i })).toBeVisible();
  });

  test("opens a floating About contact layer with modal focus management", async ({
    page,
  }) => {
    await page.goto("/about");

    const trigger = page.getByRole("button", { name: /get in touch/i }).first();
    await expect(trigger).toBeVisible();
    await expect(page.getByRole("dialog", { name: /get in touch/i })).toHaveCount(0);
    await trigger.scrollIntoViewIfNeeded();
    const scrollBefore = await page.evaluate(() => window.scrollY);

    await trigger.click();

    const dialog = page.getByRole("dialog", { name: /get in touch/i });
    await expect(dialog).toBeVisible();
    await expect(page.locator(".contact-layer__scrim")).toBeVisible();
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toContain("hidden");

    for (const method of ["Email", "Instagram", "LinkedIn"]) {
      const action = dialog.locator("[data-contact-action]").filter({ hasText: method });
      await expect(action).toBeVisible();
      await expect(action).toHaveAttribute("aria-disabled", "true");
    }

    await expect(dialog.locator("[data-contact-close]")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.locator('[data-contact-action="email"]')).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.locator("[data-contact-close]")).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);

    await trigger.click();
    await expect(dialog).toBeVisible();
    await page.locator(".contact-layer__scrim").click({ position: { x: 4, y: 4 } });
    await expect(dialog).toBeHidden();

    await trigger.click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: /close contact panel/i }).click();
    await expect(dialog).toBeHidden();
  });

  test("uses one closing contact row on About without inline contact methods", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/about");

    const row = page.locator(".about-contact-row");
    const heading = row.getByRole("heading", { name: /^contact$/i });
    const trigger = row.getByRole("button", { name: /get in touch/i });

    await expect(heading).toBeVisible();
    await expect(trigger).toBeVisible();
    await expect(row.locator("[data-contact-action]")).toHaveCount(0);
    await expect(row.getByText(/whatsapp details pending|phone details pending|instagram profile pending|email details pending|linkedin profile pending/i)).toHaveCount(0);

    const [headingBox, triggerBox] = await Promise.all([
      heading.boundingBox(),
      trigger.boundingBox(),
    ]);

    expect(headingBox).not.toBeNull();
    expect(triggerBox).not.toBeNull();
    expect(triggerBox!.x).toBeGreaterThan(headingBox!.x + headingBox!.width);
    expect(
      Math.abs(
        headingBox!.y + headingBox!.height / 2 - (triggerBox!.y + triggerBox!.height / 2),
      ),
      "desktop contact row should align heading and CTA as one composed statement",
    ).toBeLessThanOrEqual(48);

    await trigger.click();
    const dialog = page.getByRole("dialog", { name: /get in touch/i });
    await expect(dialog).toBeVisible();
    for (const method of ["Email", "Instagram", "LinkedIn"]) {
      await expect(dialog.locator("[data-contact-action]").filter({ hasText: method })).toBeVisible();
    }

    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");

    const mobileRow = page.locator(".about-contact-row");
    const mobileHeading = mobileRow.getByRole("heading", { name: /^contact$/i });
    const mobileTrigger = mobileRow.getByRole("button", { name: /get in touch/i });

    const [mobileHeadingBox, mobileTriggerBox] = await Promise.all([
      mobileHeading.boundingBox(),
      mobileTrigger.boundingBox(),
    ]);

    expect(mobileHeadingBox).not.toBeNull();
    expect(mobileTriggerBox).not.toBeNull();
    expect(mobileTriggerBox!.y).toBeGreaterThan(mobileHeadingBox!.y + mobileHeadingBox!.height);
    expect(mobileTriggerBox!.height).toBeGreaterThanOrEqual(56);
  });

  test("aligns About sections to one shared editorial grid", async ({
    page,
  }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1440, height: 900 },
      { width: 1366, height: 768 },
      { width: 1024, height: 768 },
      { width: 430, height: 932 },
      { width: 390, height: 844 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto("/about");
      await expectAboutGridAlignment(page);
    }
  });

  test("About closes with a Work destination", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("link", { name: /explore work/i }).click();
    await expect(page).toHaveURL(/\/work$/);
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
    await expect(dialog).not.toContainText(/cgi|design|contact|photography/i);
    await expect(dialog).toContainText(/about/i);
    await expect(dialog).toContainText(/work/i);

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
      "/work?mode=cgi",
      "/work?mode=stills",
      "/cgi",
      "/work",
      "/work/stills/2024/goodwood",
      "/cgi/project-one",
      "/cgi/project-five",
    ]) {
      await page.goto(path);
      await expectNoHorizontalOverflow(page);
    }

    await assertNoFailures();
  });
});
