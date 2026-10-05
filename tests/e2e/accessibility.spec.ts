import { expect, test, type Locator, type Page } from "@playwright/test";

import { cgiProjects, projectHref } from "../../src/data/work-projects";
import {
  expectMinTapTarget,
  expectNoHorizontalOverflow,
  expectNoSeriousAccessibilityViolations,
  expectWorkModeLabelsDoNotWrap,
  modeRadioNames,
} from "./helpers";

function parseRgb(value: string) {
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) {
    return null;
  }

  const [r, g, b] = match[1].split(",").slice(0, 3).map((channel) => Number.parseFloat(channel));
  return { b, g, r };
}

function luminance(channel: number) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function contrastRatio(foreground: { r: number; g: number; b: number }, background: { r: number; g: number; b: number }) {
  const a = 0.2126 * luminance(foreground.r) + 0.7152 * luminance(foreground.g) + 0.0722 * luminance(foreground.b);
  const b = 0.2126 * luminance(background.r) + 0.7152 * luminance(background.g) + 0.0722 * luminance(background.b);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);

  return (lighter + 0.05) / (darker + 0.05);
}

async function expectReadable(locator: Locator, label: string, minimum = 4.5) {
  await expect(locator, `${label} should be visible`).toBeVisible();
  const sample = await locator.evaluate((element) => {
    let ancestor: Element | null = element;
    const foreground = getComputedStyle(element).color;
    let background = "rgb(5, 3, 7)";

    while (ancestor) {
      const candidate = getComputedStyle(ancestor).backgroundColor;
      if (candidate && !candidate.endsWith(", 0)") && candidate !== "transparent") {
        background = candidate;
        break;
      }
      ancestor = ancestor.parentElement;
    }

    return { background, foreground };
  });
  const foreground = parseRgb(sample.foreground);
  const background = parseRgb(sample.background);

  expect(foreground, `${label} foreground should be an RGB color`).not.toBeNull();
  expect(background, `${label} background should be an RGB color`).not.toBeNull();
  expect(
    contrastRatio(foreground!, background!),
    `${label} should meet practical text contrast`,
  ).toBeGreaterThanOrEqual(minimum);
}

async function expectFunctionalTextFloor(page: Page, label: string) {
  const tiny = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("a, button, figcaption, dt, dd, p, span"))
      .filter((element) => {
        const text = element.textContent?.trim();
        if (!text || element.closest("[aria-hidden='true']")) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0 || style.visibility === "hidden" || style.display === "none") return false;
        if (element.closest(".rolodex-title-field")) return false;
        return Number.parseFloat(style.fontSize) < 14;
      })
      .slice(0, 20)
      .map((element) => ({
        className: element.className,
        fontSize: getComputedStyle(element).fontSize,
        tag: element.tagName,
        text: element.textContent?.trim().slice(0, 60),
      })),
  );

  expect(tiny, `${label} should not expose functional text below 14px`).toEqual([]);
}

test.describe("structural accessibility and contrast", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Accessibility audit runs in Chromium.");

  test("axe has no serious or critical violations in representative states", async ({ page }) => {
    for (const [label, route] of [
      ["landing page", "/"],
      ["Stills", "/work?mode=stills"],
      ["CGI", "/work?mode=cgi"],
      ["About", "/about"],
      ["activated CGI player", projectHref(cgiProjects[0])],
    ] as const) {
      await page.goto(route);
      await expectNoHorizontalOverflow(page);
      await expectNoSeriousAccessibilityViolations(page, label);
    }

    await page.goto("/");
    await page.getByRole("button", { name: /open navigation menu/i }).click();
    await expectNoSeriousAccessibilityViolations(page, "open menu");

    await page.goto("/about");
    await page.getByRole("button", { name: /get in touch/i }).first().click();
    await expectNoSeriousAccessibilityViolations(page, "open Contact interface");
  });

  test("current Work switch exposes state, keyboard operation, focus, and narrow label integrity", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/work?mode=stills");
    const photography = page.getByRole("radio", { name: modeRadioNames.stills });
    const visualization = page.getByRole("radio", { name: modeRadioNames.cgi });

    await expect(photography).toBeChecked();
    await expectMinTapTarget(photography, "Stills mode");
    await expectMinTapTarget(visualization, "CGI mode");
    await expectWorkModeLabelsDoNotWrap(page);

    await visualization.click();
    await expect(page).toHaveURL(/\/work\?mode=cgi$/);
    await expect(visualization).toBeChecked();
    await visualization.press("ArrowLeft");
    await expect(photography).toBeFocused();
    await expect(photography).toBeChecked();

    const focusOutline = await photography.evaluate((element) => getComputedStyle(element).outlineStyle);
    expect(focusOutline).not.toBe("none");
  });

  test("Contact links are named, touch-sized, keyboard reachable, and return focus", async ({ page }) => {
    await page.goto("/about");
    const trigger = page.getByRole("button", { name: /get in touch/i }).first();
    await trigger.focus();
    await trigger.press("Enter");

    const dialog = page.getByRole("dialog", { name: /get in touch/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: /close contact panel/i })).toBeFocused();

    for (const action of [
      page.getByRole("link", { name: /email:/i }),
      page.getByRole("link", { name: /instagram:/i }),
      page.getByRole("link", { name: /linkedin:/i }),
    ]) {
      await expect(action).toBeVisible();
      await expectMinTapTarget(action, "Contact action");
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("CGI hidden player remains inert until selection, then exposes only current controls", async ({ page }) => {
    await page.goto("/work?mode=cgi");
    await expect(page.locator(".cgi-expanded-player")).toHaveAttribute("inert", "");
    await expect(page.getByRole("button", { name: new RegExp(`play ${cgiProjects[0].title}`, "i") })).toHaveCount(0);

    await page.getByRole("button", { name: new RegExp(`open cgi project ${cgiProjects[0].index}, ${cgiProjects[0].title}`, "i") }).click();
    await expect(page.locator(".cgi-expanded-player")).not.toHaveAttribute("inert", "");
    await expect(page.getByRole("button", { name: new RegExp(`play ${cgiProjects[0].title}`, "i") })).toBeVisible();
    await expect(page.getByRole("slider", { name: new RegExp(`seek ${cgiProjects[0].title}`, "i") })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("key contrast and functional font-size samples stay accessible", async ({ page }) => {
    await page.goto("/work?mode=stills");
    await expectReadable(page.getByRole("radio", { name: modeRadioNames.stills }), "active Stills switch");
    await expectReadable(page.getByRole("radio", { name: modeRadioNames.cgi }), "inactive CGI switch", 3);
    await expectReadable(page.locator(".stills-archive-cue").first(), "Stills archive cue");
    await expectFunctionalTextFloor(page, "Stills");

    await page.goto(projectHref(cgiProjects[0]));
    await expectReadable(page.locator(".cgi-player-controls").getByRole("button").first(), "CGI player chrome", 3);
    await expectFunctionalTextFloor(page, "CGI");

    await page.goto("/about");
    await page.getByRole("button", { name: /get in touch/i }).first().click();
    await expectReadable(page.getByRole("link", { name: /email:/i }), "Contact email link");
    await expectFunctionalTextFloor(page, "About and Contact");
  });

  test("200 percent reflow-equivalent zoom keeps primary flows usable without horizontal overflow", async ({ page }) => {
    for (const route of ["/", "/work?mode=stills", "/work?mode=cgi", "/about"] as const) {
      await page.setViewportSize({ width: 640, height: 900 });
      await page.goto(route);
      await page.evaluate(() => {
        document.documentElement.style.zoom = "2";
      });
      await expectNoHorizontalOverflow(page);
    }

    await page.goto("/about");
    await page.evaluate(() => {
      document.documentElement.style.zoom = "2";
    });
    await page.getByRole("button", { name: /get in touch/i }).first().click();
    await expect(page.getByRole("dialog", { name: /get in touch/i })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
