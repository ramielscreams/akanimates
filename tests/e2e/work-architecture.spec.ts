import { expect, test } from "@playwright/test";
import { projects, getProjects, projectHref, stillsYears, workHref } from "../../src/data/work-projects";
import { expectElementInsideViewport, expectNoHorizontalOverflow, expectNoConsoleFailures, expectWorkModeLabelsDoNotWrap, modeRadioNames, waitForRolodexIdle } from "./helpers";

const cgiItems = getProjects("cgi");
const firstCgiProject = cgiItems[0];
const secondCgiProject = cgiItems[1];
const thirdCgiProject = cgiItems[2];
const fourthCgiProject = cgiItems[3];

test("Home, menu and About use the reduced hierarchy", async ({ page }) => {
  const checkErrors = await expectNoConsoleFailures(page);
  await page.goto("/");
  await expect(page.locator(".rolodex-shell")).toHaveCount(0);
  const destinations = page.getByRole("navigation", { name: "Primary destinations" });
  await expect(destinations.getByRole("link")).toHaveCount(2);
  await destinations.getByRole("link", { name: /ABOUT/ }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { name: "About", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("link")).toHaveCount(2);
  await dialog.getByRole("link", { name: /work/i }).click();
  await expect(page).toHaveURL(/\/work$/);
  await page.getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await checkErrors();
});

test("mode changes are isolated, instantaneous client history entries", async ({ page }) => {
  const checkErrors = await expectNoConsoleFailures(page);
  await page.goto("/work");
  await expect(page.locator("main")).toHaveAttribute("data-work-mode", "stills");
  await expect(page.locator(".rolodex-panel")).toHaveCount(3);
  await page.evaluate(() => { (window as unknown as { workDocument: string }).workDocument = "same-document"; });
  await page.getByRole("radio", { name: modeRadioNames.cgi, exact: true }).click();
  await expect(page).toHaveURL(/\/work\?mode=cgi(&project=[^&]+)?$/);
  await expect(page.locator(".rolodex-shell")).toHaveCount(0);
  await expect(page.locator(".cgi-project-tile")).toHaveCount(cgiItems.length);
  await expect(page.locator('[data-panel="stills"]')).toHaveCount(0);
  await expectWorkModeLabelsDoNotWrap(page);
  await page.getByRole("radio", { name: modeRadioNames.stills, exact: true }).click();
  await expect(page.locator(".cgi-tile-browser")).toHaveCount(0);
  await expect(page.locator(".rolodex-panel")).toHaveCount(3);
  await page.goBack();
  await expect(page.getByRole("radio", { name: modeRadioNames.cgi, exact: true })).toBeChecked();
  await page.goBack();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.getByRole("radio", { name: modeRadioNames.stills, exact: true })).toBeChecked();
  await page.goForward();
  await expect(page.getByRole("radio", { name: modeRadioNames.cgi, exact: true })).toBeChecked();
  expect(await page.evaluate(() => (window as unknown as {workDocument: string}).workDocument)).toBe("same-document");
  await page.getByRole("radio", { name: modeRadioNames.cgi, exact: true }).press("ArrowLeft");
  await expect(page.getByRole("radio", { name: modeRadioNames.stills, exact: true })).toBeFocused();
  await expect(page.locator('[data-panel="cgi"]')).toHaveCount(0);
  await checkErrors();
});

test("Work renders direct CGI project query state", async ({ page }) => {
  await page.goto(projectHref(fourthCgiProject));
  await expect(page.getByRole("heading", { name: fourthCgiProject.title, exact: true })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/work\\?mode=cgi&project=${fourthCgiProject.slug}$`));
  await expect(page.locator('.cgi-project-tile[data-active="true"]').getByRole("button", { name: new RegExp(`open cgi project ${fourthCgiProject.index}, ${fourthCgiProject.title}`, "i") })).toBeVisible();
});

test("CGI persisted browser context restores mode without exposing hidden player controls", async ({ page }) => {
  const checkErrors = await expectNoConsoleFailures(page);
  await page.addInitScript(() => {
    window.sessionStorage.setItem("ak-work-mode", "cgi");
    window.sessionStorage.setItem("ak-work-scroll:cgi", "0");
  });
  await page.goto("/work");
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.getByRole("radio", { name: modeRadioNames.cgi, exact: true })).toBeChecked();
  await expect(page.locator(".cgi-tile-browser")).toHaveAttribute("data-active", "true");
  await expect(page.locator(".cgi-expanded-player")).toHaveAttribute("inert", "");
  await expect(page.getByRole("button", { name: new RegExp(`play ${firstCgiProject.title}`, "i") })).toHaveCount(0);
  await expect(page.getByRole("button", { name: new RegExp(`open cgi project ${firstCgiProject.index}, ${firstCgiProject.title}`, "i") })).toBeVisible();

  await page.goto("/work?mode=cgi");
  await expect(page.locator(".cgi-tile-browser")).toHaveAttribute("data-active", "true");
  await expect(page.locator(".cgi-expanded-player")).toHaveAttribute("inert", "");

  await page.goto(projectHref(thirdCgiProject));
  await expect(page.locator(".cgi-tile-browser")).toHaveAttribute("data-active", "true");
  await expect(page.getByRole("heading", { name: thirdCgiProject.title, exact: true })).toBeVisible();
  await checkErrors();
});

test("stills: year panels cycle in both directions and expose only assigned collections", async ({ page }) => {
  await page.goto(workHref("stills"));
  await page.waitForSelector(".rolodex-shell");
  await page.evaluate(() => document.querySelector(".rolodex-shell")?.scrollIntoView());

  for (let i = 0; i < stillsYears.length; i++) {
    const year = stillsYears[i];
    await waitForRolodexIdle(page, year.year);
    const active = page.locator('.rolodex-panel[data-state="active"]');

    await expect(active.getByRole("link")).toHaveCount(year.collections.length);

    for (const collection of year.collections) {
      await expect(active.getByRole("link", { name: `${collection.title} ${collection.year}` })).toHaveAttribute("href", projectHref(collection));
    }

    if (year.year === "2024") {
      await expect(active.getByRole("link", { name: /formula one/i })).toHaveCount(0);
    }

    await expect(page.locator('.rolodex-panel[aria-hidden="false"]')).toHaveCount(1);
    await page.mouse.move(900, 500);
    await page.mouse.wheel(0, 90);
    await page.mouse.wheel(0, 65);
    await page.mouse.wheel(0, 25);
    await waitForRolodexIdle(page, stillsYears[(i + 1) % stillsYears.length].year);
  }

  await page.mouse.wheel(0, -150);
  await page.waitForTimeout(400);
  await waitForRolodexIdle(page, stillsYears[stillsYears.length - 1].year);
  await page.locator('.rolodex-panel[data-state="active"]').getByRole("link", { name: /goodwood festival of speed 2024/i }).click();
  await expect(page).toHaveURL(new RegExp(`${projectHref(stillsYears[stillsYears.length - 1].collections[0])}$`));
});

test("cgi: tile field drives the persistent featured player without a Rolodex", async ({ page }) => {
  await page.goto(workHref("cgi"));
  const items = getProjects("cgi");

  await expect(page.locator(".rolodex-shell")).toHaveCount(0);
  await expect(page.locator(".cgi-project-tile")).toHaveCount(items.length);
  await expect(page.locator(".cgi-project-tile__info")).toHaveCount(0);

  for (const project of items) {
    const tile = page.getByRole("button", { name: new RegExp(`open cgi project ${project.index}, ${project.title}`, "i") });
    await expect(tile).toBeVisible();
    await expect(tile.locator(".cgi-project-tile__media .cgi-project-tile__caption")).toContainText(project.title);
  }

  await expect(page.locator(".cgi-project-tile")).toHaveCount(cgiItems.length);
  await expect(page.locator(".cgi-project-tile")).toHaveCount(10);
  await expect(page.locator(".cgi-expanded-player")).toHaveAttribute("inert", "");
  await expect(page.getByRole("button", { name: new RegExp(`play ${firstCgiProject.title}`, "i") })).toHaveCount(0);

  await page.getByRole("button", { name: new RegExp(`open cgi project ${fourthCgiProject.index}, ${fourthCgiProject.title}`, "i") }).click();
  await expect(page).toHaveURL(new RegExp(`/work\\?mode=cgi&project=${fourthCgiProject.slug}$`));
  await expect(page.getByRole("heading", { name: fourthCgiProject.title, exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: new RegExp(`play ${fourthCgiProject.title}`, "i") })).toBeVisible();
  await expect(page.getByRole("slider", { name: new RegExp(`seek ${fourthCgiProject.title}`, "i") })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".cgi-expanded-player")).toHaveAttribute("inert", "");
  await expect(page.getByRole("heading", { name: firstCgiProject.title, exact: true })).toHaveCount(0);
  await expect(page).toHaveURL(/\/work\?mode=cgi$/);
});

test("cgi: pointer hover plays one lightweight five second tile preview", async ({ page }) => {
  const checkErrors = await expectNoConsoleFailures(page);

  await page.goto(workHref("cgi"));

  const firstTile = page.getByRole("button", { name: new RegExp(`open cgi project ${firstCgiProject.index}, ${firstCgiProject.title}`, "i") });
  const secondTile = page.getByRole("button", { name: new RegExp(`open cgi project ${secondCgiProject.index}, ${secondCgiProject.title}`, "i") });
  const firstBox = await firstTile.boundingBox();
  const secondBox = await secondTile.boundingBox();

  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();

  await page.mouse.move(firstBox!.x + firstBox!.width / 2, firstBox!.y + firstBox!.height / 2);
  await expect(page.locator(".cgi-project-tile").first()).toHaveAttribute("data-hovered", "true");
  await expect(page.locator(".cgi-project-tile__preview")).toHaveCount(1);
  await expect(page.locator(".cgi-project-tile__preview")).toHaveAttribute("data-ready", "true");
  const initialPreviewTime = await page.locator(".cgi-project-tile__preview").first().evaluate((video) => (video as HTMLVideoElement).currentTime);
  expect(initialPreviewTime).toBeGreaterThanOrEqual((firstCgiProject.previewStart ?? 0) - 0.35);
  expect(initialPreviewTime).toBeLessThanOrEqual((firstCgiProject.previewStart ?? 0) + 1.2);

  await page.waitForTimeout(1400);
  const firstPreviewTime = await page.locator(".cgi-project-tile__preview").first().evaluate((video) => (video as HTMLVideoElement).currentTime);
  expect(firstPreviewTime).toBeGreaterThanOrEqual((firstCgiProject.previewStart ?? 0) - 0.35);
  expect(firstPreviewTime).toBeLessThanOrEqual((firstCgiProject.previewStart ?? 0) + 2.5);

  const firstTileBoxDuringPreview = await firstTile.boundingBox();
  expect(firstTileBoxDuringPreview).not.toBeNull();
  expect(Math.abs(firstTileBoxDuringPreview!.x - firstBox!.x)).toBeLessThan(0.5);
  expect(Math.abs(firstTileBoxDuringPreview!.y - firstBox!.y)).toBeLessThan(0.5);
  expect(Math.abs(firstTileBoxDuringPreview!.width - firstBox!.width)).toBeLessThan(0.5);
  expect(Math.abs(firstTileBoxDuringPreview!.height - firstBox!.height)).toBeLessThan(0.5);
  const previewTransform = await firstTile.evaluate((tile) => ({
    tile: getComputedStyle(tile).transform,
    media: getComputedStyle(tile.querySelector(".cgi-project-tile__media")!).transform,
    preview: getComputedStyle(tile.querySelector(".cgi-project-tile__preview")!).transform,
  }));
  expect(previewTransform.tile).toBe("none");
  expect(previewTransform.media).toBe("none");
  expect(previewTransform.preview).toContain("matrix");

  await page.mouse.move(secondBox!.x + secondBox!.width / 2, secondBox!.y + secondBox!.height / 2);
  await expect(page.locator(".cgi-project-tile").nth(1)).toHaveAttribute("data-hovered", "true");
  await expect(page.locator(".cgi-project-tile").first()).toHaveAttribute("data-hovered", "false");
  await expect(page.locator(".cgi-project-tile__preview")).toHaveCount(1);

  await page.waitForTimeout(5400);
  const heldPreview = await page.locator(".cgi-project-tile__preview").first().evaluate((video) => {
    const media = video as HTMLVideoElement;

    return {
      currentTime: media.currentTime,
      paused: media.paused,
    };
  });
  expect(heldPreview.currentTime).toBeLessThanOrEqual((secondCgiProject.previewStart ?? 0) + 5.05);
  expect(heldPreview.paused).toBe(true);

  const secondPreviewTime = await page.locator(".cgi-project-tile__preview").first().evaluate((video) => (video as HTMLVideoElement).currentTime);
  expect(secondPreviewTime).toBeGreaterThanOrEqual((secondCgiProject.previewStart ?? 0) - 0.35);

  await page.mouse.move(10, 10);
  await expect(page.locator(".cgi-project-tile__preview")).toHaveCount(0);

  await firstTile.click();
  await expect(page).toHaveURL(new RegExp(`/work\\?mode=cgi&project=${firstCgiProject.slug}$`));
  await checkErrors();
});

test("cgi: every configured project has a bounded hover preview start", async ({ page }) => {
  await page.goto(workHref("cgi"));

  for (const project of cgiItems) {
    const tile = page.getByRole("button", { name: new RegExp(`open cgi project ${project.index}, ${project.title}`, "i") });
    await tile.scrollIntoViewIfNeeded();
    const box = await tile.boundingBox();

    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    const preview = page.locator(".cgi-project-tile__preview");
    await expect(preview).toHaveCount(1);
    await expect(preview).toHaveAttribute("data-ready", "true");
    const state = await preview.evaluate((video) => {
      const media = video as HTMLVideoElement;
      return { currentTime: media.currentTime, paused: media.paused };
    });

    expect(state.currentTime).toBeGreaterThanOrEqual((project.previewStart ?? 0) - 0.35);
    expect(state.currentTime).toBeLessThanOrEqual((project.previewStart ?? 0) + 1.2);
    expect(state.paused).toBe(false);
    await page.mouse.move(10, 10);
    await expect(preview).toHaveCount(0);
  }
});

test("cgi: reduced motion keeps tile previews static", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(workHref("cgi"));

  const firstTile = page.getByRole("button", { name: new RegExp(`open cgi project ${firstCgiProject.index}, ${firstCgiProject.title}`, "i") });
  const firstBox = await firstTile.boundingBox();

  expect(firstBox).not.toBeNull();
  await page.mouse.move(firstBox!.x + firstBox!.width / 2, firstBox!.y + firstBox!.height / 2);
  await expect(page.locator(".cgi-project-tile__preview")).toHaveCount(0);
  await firstTile.click();
  await expect(page).toHaveURL(new RegExp(`/work\\?mode=cgi&project=${firstCgiProject.slug}$`));
});

test("stills: reduced motion keeps the Rolodex engine clean", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(workHref("stills"));
  await page.waitForSelector(".rolodex-shell");
  await page.evaluate(() => document.querySelector(".rolodex-shell")?.scrollIntoView());
  await waitForRolodexIdle(page, "2026");
  await page.keyboard.press("ArrowDown");
  await waitForRolodexIdle(page, "2025");
  await expect(page.locator('.rolodex-scene-wrap[data-state="active"]')).toHaveCSS("transform", "none");
  await page.keyboard.press("ArrowDown");
  await page.getByRole("radio", { name: modeRadioNames.cgi, exact: true }).click();
  await expect(page.locator(".rolodex-shell")).toHaveCount(0);
  await expect(page.locator(".cgi-project-tile")).toHaveCount(getProjects("cgi").length);
});

test("cgi: reduced motion and mode switching close the inline player cleanly", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(workHref("cgi"));
  await expect(page.locator(".cgi-project-tile")).toHaveCount(getProjects("cgi").length);
  await page.getByRole("button", { name: new RegExp(`open cgi project ${secondCgiProject.index}, ${secondCgiProject.title}`, "i") }).click();
  await expect(page.getByRole("heading", { name: secondCgiProject.title, exact: true })).toBeVisible();
  await page.getByRole("radio", { name: modeRadioNames.stills, exact: true }).click();
  await page.locator(".rolodex-shell").scrollIntoViewIfNeeded();
  await waitForRolodexIdle(page, "2026");
  await expect(page.locator(".cgi-expanded-player")).toHaveCount(0);
  await expect(page.locator('.rolodex-panel[aria-hidden="false"]')).toHaveCount(1);
});

for (const project of projects.filter((item) => item.discipline === "stills")) {
  test(`${project.discipline}/${project.slug}: direct interior, next and return`, async ({ page }) => {
    const checkErrors = await expectNoConsoleFailures(page);
    const siblings = getProjects(project.discipline);
    const next = siblings[(siblings.findIndex((p) => p.slug === project.slug) + 1) % siblings.length];
    const response = await page.goto(projectHref(project));
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: project.title, exact: true })).toBeVisible();
    await expect(page.locator("main")).toHaveAttribute("data-discipline", project.discipline);
    const footer = page.getByRole("navigation", { name: /project navigation/ });
    await expect(footer).toContainText("Next Project");
    await expect(footer.getByRole("link", { name: new RegExp(`next project, ${next.title}`, "i") })).toHaveAttribute("href", projectHref(next));
    await footer.getByRole("link", { name: new RegExp(`next project, ${next.title}`, "i") }).click();
    await expect(page).toHaveURL(new RegExp(`${projectHref(next)}$`));
    await page.getByRole("link", { name: /^Back to/ }).click();
    const returnPattern = new RegExp(`/work\\?mode=${project.discipline}&project=${next.slug}$`);
    await expect(page).toHaveURL(returnPattern);
    await expect(page.getByRole("radio", { name: modeRadioNames.stills, exact: true })).toBeChecked();
    await checkErrors();
  });
}

for (const [from, to] of [["/photography", "/work?mode=stills"], ["/cgi", "/work?mode=cgi"], ["/design", "/work"], ["/design/project-one", "/work"], ["/visualization?mode=design", "/work"], ["/visualization", "/work?mode=cgi"]]) {
  test(`legacy ${from} redirects safely`, async ({ page }) => {
    await page.goto(from);
    expect(new URL(page.url()).pathname + new URL(page.url()).search).toBe(to);
    await expect(page.getByRole("radiogroup", { name: "Work mode" })).toBeVisible();
  });
}

for (const viewport of [{width: 1440, height: 900}, {width: 1920, height: 1080}, {width: 768, height: 1024}, {width: 390, height: 844}, {width: 320, height: 568}, {width: 844, height: 390}]) {
  test(`responsive Work at ${viewport.width}x${viewport.height}`, async ({page}, testInfo) => {
    await page.setViewportSize(viewport);
    for (const mode of ["stills", "cgi"]) {
      await page.goto(`/work?mode=${mode}`);
      if (mode === "stills") {
        await page.waitForSelector(".rolodex-shell");
        await page.evaluate(() => document.querySelector(".rolodex-shell")?.scrollIntoView());
        await waitForRolodexIdle(page, "2026");
      } else {
        await expect(page.locator(".cgi-project-tile")).toHaveCount(getProjects("cgi").length);
      }
      await expectNoHorizontalOverflow(page);
      const selectors = mode === "stills"
        ? ['.work-mode-control', '.rolodex-nav', '.rolodex-panel[data-state="active"] .rolodex-heading', '.rolodex-panel[data-state="active"] .stills-year-collections']
        : ['.work-mode-control', '.cgi-tile-browser__intro'];

      for (const selector of selectors) {
        await expectElementInsideViewport(page.locator(selector), selector);
      }

      if (mode === "cgi") {
        await expect(page.locator(".cgi-tile-field")).toBeVisible();
        await page.locator(".cgi-tile-field").scrollIntoViewIfNeeded();
        const firstTile = page.locator(".cgi-project-tile").first();
        await expect(firstTile).toBeVisible();
        const box = await firstTile.boundingBox();
        const viewportSize = page.viewportSize();

        expect(box).not.toBeNull();
        expect(viewportSize).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(-2);
        expect(box!.x + box!.width).toBeLessThanOrEqual(viewportSize!.width + 2);
        expect(box!.y).toBeLessThanOrEqual(viewportSize!.height);
      }
      await page.screenshot({path: testInfo.outputPath(`${mode}.png`)});
    }
    await page.goto("/");
    await expectNoHorizontalOverflow(page);
    await page.screenshot({path: testInfo.outputPath("home.png")});
  });
}

