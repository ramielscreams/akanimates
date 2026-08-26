import { expect, type Locator, type Page } from "@playwright/test";

export const desktopViewports = [
  { width: 1920, height: 1080 },
  { width: 1600, height: 900 },
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 1280, height: 620 },
] as const;

export const responsiveViewports = [
  ...desktopViewports,
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
] as const;

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );

  expect(overflow).toBeLessThanOrEqual(2);
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

    failedRequests.push(`${request.url()} ${failure?.errorText ?? ""}`.trim());
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
