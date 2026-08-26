import { expect, type Locator, type Page } from "@playwright/test";

export const desktopViewports = [
  { width: 1920, height: 1080 },
  { width: 1600, height: 900 },
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1280, height: 800 },
  { width: 1280, height: 720 },
  { width: 1024, height: 768 },
  { width: 1024, height: 600 },
  { width: 1280, height: 620 },
] as const;

export const tabletViewports = [
  { width: 820, height: 1180 },
  { width: 768, height: 1024 },
] as const;

export const mobileViewports = [
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
  { width: 360, height: 800 },
] as const;

export const responsiveViewports = [
  ...desktopViewports,
  ...tabletViewports,
  ...mobileViewports,
] as const;

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );

  expect(overflow).toBeLessThanOrEqual(2);
}

export async function expectElementInsideViewport(
  locator: Locator,
  label = "element",
) {
  await expect(locator, `${label} should be visible`).toBeVisible();

  const box = await locator.boundingBox();
  expect(box, `${label} should have a bounding box`).not.toBeNull();

  const viewport = locator.page().viewportSize();
  expect(viewport, "viewport should be set").not.toBeNull();

  const tolerance = 2;
  expect(box!.x, `${label} should not overflow left`).toBeGreaterThanOrEqual(
    -tolerance,
  );
  expect(box!.y, `${label} should not overflow top`).toBeGreaterThanOrEqual(
    -tolerance,
  );
  expect(
    box!.x + box!.width,
    `${label} should not overflow right`,
  ).toBeLessThanOrEqual(viewport!.width + tolerance);
  expect(
    box!.y + box!.height,
    `${label} should not overflow bottom`,
  ).toBeLessThanOrEqual(viewport!.height + tolerance);
}

export async function expectMinTapTarget(locator: Locator, label = "control") {
  await expect(locator, `${label} should be visible`).toBeVisible();
  const box = await locator.boundingBox();

  expect(box, `${label} should have a bounding box`).not.toBeNull();
  expect(
    Math.min(box!.width, box!.height),
    `${label} should meet minimum touch target size`,
  ).toBeGreaterThanOrEqual(44);
}

export async function expectNoConsoleFailures(page: Page) {
  const errors: string[] = [];
  const failedRequests: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) => {
    const failure = request.failure();
    const errorText = failure?.errorText ?? "";

    if (
      errorText.includes("ERR_ABORTED") ||
      errorText.includes("NS_BINDING_ABORTED")
    ) {
      return;
    }

    failedRequests.push(`${request.url()} ${errorText}`.trim());
  });

  return async () => {
    expect(errors, "browser console/page errors").toEqual([]);
    expect(failedRequests, "failed browser requests").toEqual([]);
  };
}

export async function waitForRolodexIdle(page: Page, title: string) {
  await expect(page.locator(".rolodex-track")).toHaveAttribute(
    "data-phase",
    "idle",
    { timeout: 4_000 },
  );
  await expect(
    page.locator('.rolodex-panel[data-state="active"] .rolodex-heading'),
  ).toHaveText(new RegExp(`^${title}$`, "i"), { timeout: 4_000 });
  await page.waitForTimeout(260);
}

export async function clickRolodexNav(page: Page, label: string) {
  await page
    .locator(".rolodex-nav-item")
    .filter({ hasText: new RegExp(label, "i") })
    .click();
}

export async function getElementCenter(locator: Locator) {
  const box = await locator.boundingBox();

  expect(box).not.toBeNull();

  return (box?.x ?? 0) + (box?.width ?? 0) / 2;
}

export async function getUsableCenter(page: Page) {
  return page.evaluate(() => {
    const layer = document.querySelector<HTMLElement>(
      '.rolodex-panel[data-state="active"] .rolodex-content-layer',
    );

    if (layer) {
      const rect = layer.getBoundingClientRect();

      return rect.left + rect.width / 2;
    }

    return window.innerWidth / 2;
  });
}

export async function expectRolodexContentCentered(page: Page) {
  const expectedCenter = await getUsableCenter(page);
  const heading = page.locator('.rolodex-panel[data-state="active"] .rolodex-heading');
  const copy = page.locator('.rolodex-panel[data-state="active"] .rolodex-copy');
  const cta = page.locator('.rolodex-panel[data-state="active"] .rolodex-liquid-cta');
  const centers = {
    heading: await getElementCenter(heading),
    copy: await getElementCenter(copy),
    cta: await getElementCenter(cta),
  };

  for (const [name, center] of Object.entries(centers)) {
    expect(
      Math.abs(center - expectedCenter),
      `${name} center should align to usable content center`,
    ).toBeLessThanOrEqual(3);
  }

  expect(Math.abs(centers.heading - centers.copy)).toBeLessThanOrEqual(2);
  expect(Math.abs(centers.heading - centers.cta)).toBeLessThanOrEqual(2);
}

export async function expectRolodexFocusedContainment(page: Page) {
  const activePanel = page.locator('.rolodex-panel[data-state="active"]');
  const repetitions = activePanel.locator(".rolodex-title-field__repetitions");
  const repeatedWords = activePanel.locator(".rolodex-title-field__word");

  await expectElementInsideViewport(
    page.getByRole("link", { name: "Home" }).first(),
    "homepage logo",
  );
  await expectElementInsideViewport(page.locator(".rolodex-nav"), "left nav");
  await expectElementInsideViewport(
    activePanel.locator(".rolodex-title-field"),
    "Rolodex title field",
  );
  await expectElementInsideViewport(
    activePanel.locator(".rolodex-heading"),
    "Rolodex heading",
  );
  await expectElementInsideViewport(
    activePanel.locator(".rolodex-copy"),
    "Rolodex description",
  );
  await expectElementInsideViewport(
    activePanel.locator(".rolodex-liquid-cta"),
    "Rolodex CTA",
  );
  await expect(repetitions).toHaveAttribute("aria-hidden", "true");
  expect(
    await repeatedWords.count(),
    "decorative title field should contain repeated title instances",
  ).toBeGreaterThanOrEqual(10);
  await expectRolodexContentCentered(page);
}

export async function expectRolodexHeadingFont(page: Page) {
  const style = await page
    .locator('.rolodex-panel[data-state="active"] .rolodex-heading')
    .evaluate((element) => {
      const computed = getComputedStyle(element);
      const fontSize = Number.parseFloat(computed.fontSize);
      const letterSpacing = Number.parseFloat(computed.letterSpacing);

      return {
        family: computed.fontFamily,
        fontSize,
        letterSpacing,
        letterSpacingRatio: letterSpacing / fontSize,
        textTransform: computed.textTransform,
        weight: computed.fontWeight,
      };
    });

  expect(style.family).toContain("Barlow");
  expect(Number(style.weight)).toBe(900);
  expect(style.textTransform).toBe("uppercase");
  expect(style.letterSpacingRatio).toBeGreaterThanOrEqual(0.024);
  expect(style.letterSpacingRatio).toBeLessThanOrEqual(0.034);
}

export async function buttonBox(page: Page, name: string | RegExp) {
  const locator = page.getByRole("link", { name }).first();
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();

  expect(box).not.toBeNull();

  return box!;
}
