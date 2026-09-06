import { expect, test } from "@playwright/test";
import { projects, getProjects, projectHref, stillsYears, workHref } from "../../src/data/work-projects";
import { expectElementInsideViewport, expectNoHorizontalOverflow, expectNoConsoleFailures, waitForRolodexIdle } from "./helpers";

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
  await dialog.getByRole("link", { name: /work/ }).click();
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
  await page.getByRole("radio", { name: "CGI", exact: true }).click();
  await expect(page).toHaveURL(/\/work\?mode=cgi$/);
  await expect(page.locator(".rolodex-shell")).toHaveCount(0);
  await expect(page.locator(".cgi-project-tile")).toHaveCount(5);
  await expect(page.locator('[data-panel="stills"]')).toHaveCount(0);
  await page.getByRole("radio", { name: "STILLS", exact: true }).click();
  await expect(page.locator(".cgi-tile-browser")).toHaveCount(0);
  await expect(page.locator(".rolodex-panel")).toHaveCount(3);
  await page.goBack();
  await expect(page.getByRole("radio", { name: "CGI", exact: true })).toBeChecked();
  await page.goBack();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.getByRole("radio", { name: "STILLS", exact: true })).toBeChecked();
  await page.goForward();
  await expect(page.getByRole("radio", { name: "CGI", exact: true })).toBeChecked();
  expect(await page.evaluate(() => (window as unknown as {workDocument: string}).workDocument)).toBe("same-document");
  await page.getByRole("radio", { name: "CGI", exact: true }).press("ArrowLeft");
  await expect(page.getByRole("radio", { name: "STILLS", exact: true })).toBeFocused();
  await expect(page.locator('[data-panel="cgi"]')).toHaveCount(0);
  await checkErrors();
});

test("Work restores session mode and project position", async ({ page }) => {
  await page.goto("/work?mode=cgi&project=project-four");
  await expect(page.getByRole("heading", { name: "Project Four", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /view full project/i }).click();
  await expect(page).toHaveURL(/\/cgi\/project-four$/);
  await page.getByRole("link", { name: /^← CGI$/ }).click();
  await expect(page).toHaveURL(/\/work\?mode=cgi$/);
  await expect(page.locator(".cgi-expanded-player")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /open cgi project 04, project four/i })).toBeVisible();
  await page.goto("/work");
  await expect(page.getByRole("radio", { name: "CGI", exact: true })).toBeChecked();
  await expect(page.locator(".cgi-expanded-player")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /open cgi project 04, project four/i })).toBeVisible();
});

test("CGI persisted browser context does not hydrate into an expanded player", async ({ page }) => {
  const checkErrors = await expectNoConsoleFailures(page);
  await page.goto("/work");
  await page.evaluate(() => {
    window.sessionStorage.setItem("ak-work-mode", "cgi");
    window.sessionStorage.setItem("ak-work-position:cgi", "project-three");
    window.sessionStorage.setItem("ak-work-scroll:cgi", "0");
  });
  await page.reload();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.getByRole("radio", { name: "CGI", exact: true })).toBeChecked();
  await expect(page.locator(".cgi-tile-browser")).toHaveAttribute("data-active", "false");
  await expect(page.locator(".cgi-expanded-player")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /open cgi project 03, project three/i })).toBeVisible();
  await checkErrors();
});

test("stills: year panels cycle forward and expose only assigned collections", async ({ page }) => {
  await page.goto(workHref("stills"));

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
  await waitForRolodexIdle(page, stillsYears[0].year);
  await page.locator('.rolodex-panel[data-state="active"]').getByRole("link", { name: /goodwood festival of speed 2024/i }).click();
  await expect(page).toHaveURL(new RegExp(`${projectHref(stillsYears[0].collections[0])}$`));
});

test("cgi: tile field opens and closes an inline player without a Rolodex", async ({ page }) => {
  await page.goto(workHref("cgi"));
  const items = getProjects("cgi");

  await expect(page.locator(".rolodex-shell")).toHaveCount(0);
  await expect(page.locator(".cgi-project-tile")).toHaveCount(items.length);

  for (const project of items) {
    const tile = page.getByRole("button", { name: new RegExp(`open cgi project ${project.index}, ${project.title}`, "i") });
    await expect(tile).toBeVisible();
  }

  await page.getByRole("button", { name: /open cgi project 04, project four/i }).click();
  await expect(page).toHaveURL(/\/work\?mode=cgi&project=project-four$/);
  await expect(page.getByRole("heading", { name: "Project Four", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /close cgi player/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /view full project/i })).toHaveAttribute("href", "/cgi/project-four");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("heading", { name: "Project Four", exact: true })).toHaveCount(0);
  await expect(page).toHaveURL(/\/work\?mode=cgi$/);
});

test("stills: reduced motion keeps the Rolodex engine clean", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(workHref("stills"));
  await waitForRolodexIdle(page, "2024");
  await page.keyboard.press("ArrowDown");
  await waitForRolodexIdle(page, "2025");
  await expect(page.locator('.rolodex-scene-wrap[data-state="active"]')).toHaveCSS("transform", "none");
  await page.keyboard.press("ArrowDown");
  await page.getByRole("radio", { name: "CGI", exact: true }).click();
  await expect(page.locator(".rolodex-shell")).toHaveCount(0);
  await expect(page.locator(".cgi-project-tile")).toHaveCount(getProjects("cgi").length);
});

test("cgi: reduced motion and mode switching close the inline player cleanly", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(workHref("cgi"));
  await expect(page.locator(".cgi-project-tile")).toHaveCount(getProjects("cgi").length);
  await page.getByRole("button", { name: /open cgi project 02, project two/i }).click();
  await expect(page.getByRole("heading", { name: "Project Two", exact: true })).toBeVisible();
  await page.getByRole("radio", { name: "STILLS", exact: true }).click();
  await waitForRolodexIdle(page, "2024");
  await expect(page.locator(".cgi-expanded-player")).toHaveCount(0);
  await expect(page.locator('.rolodex-panel[aria-hidden="false"]')).toHaveCount(1);
});

for (const project of projects) {
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
    const returnPattern = project.discipline === "cgi"
      ? /\/work\?mode=cgi$/
      : new RegExp(`/work\\?mode=${project.discipline}&project=${next.slug}$`);
    await expect(page).toHaveURL(returnPattern);
    await expect(page.getByRole("radio", { name: project.discipline.toUpperCase(), exact: true })).toBeChecked();
    if (project.discipline === "cgi") {
      await expect(page.locator(".cgi-expanded-player")).toHaveCount(0);
    }
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
        await waitForRolodexIdle(page, "2024");
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
