import { expect, test } from "@playwright/test";
import { projects, getProjects, projectHref, workHref } from "../../src/data/work-projects";
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
  await expect(page.locator(".rolodex-panel")).toHaveCount(5);
  await expect(page.locator('[data-panel="stills"]')).toHaveCount(0);
  await page.getByRole("radio", { name: "STILLS", exact: true }).click();
  await expect(page.locator('[data-panel="cgi"]')).toHaveCount(0);
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
  await waitForRolodexIdle(page, "Project Four");
  await page.getByRole("link", { name: /view project 04, project four/i }).click();
  await expect(page).toHaveURL(/\/cgi\/project-four$/);
  await page.getByRole("link", { name: /^← CGI$/ }).click();
  await expect(page).toHaveURL(/\/work\?mode=cgi&project=project-four$/);
  await waitForRolodexIdle(page, "Project Four");
  await page.goto("/work");
  await expect(page.getByRole("radio", { name: "CGI", exact: true })).toBeChecked();
  await waitForRolodexIdle(page, "Project Four");
});

for (const mode of ["stills", "cgi"] as const) {
  test(`${mode}: intentional scrolling cycles forward and opens every project`, async ({ page }) => {
    await page.goto(workHref(mode));
    const items = getProjects(mode);
    for (let i = 0; i < items.length; i++) {
      await waitForRolodexIdle(page, items[i].title);
      const active = page.locator('.rolodex-panel[data-state="active"]');
      await expect(active.getByRole("link")).toHaveAttribute("href", projectHref(items[i]));
      await expect(page.locator('.rolodex-panel[aria-hidden="false"]')).toHaveCount(1);
      await page.mouse.move(900, 500);
      await page.mouse.wheel(0, 90);
      await page.mouse.wheel(0, 65);
      await page.mouse.wheel(0, 25);
      await waitForRolodexIdle(page, items[(i + 1) % items.length].title);
    }
    await page.mouse.wheel(0, -150);
    await page.waitForTimeout(400);
    await waitForRolodexIdle(page, items[0].title);
    await page.locator('.rolodex-panel[data-state="active"]').getByRole("link").click();
    await expect(page).toHaveURL(new RegExp(`${projectHref(items[0])}$`));
  });

  test(`${mode}: reduced motion and switching while moving clean up the engine`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(workHref(mode));
    await waitForRolodexIdle(page, "Project One");
    await page.keyboard.press("ArrowDown");
    await waitForRolodexIdle(page, "Project Two");
    await expect(page.locator('.rolodex-scene-wrap[data-state="active"]')).toHaveCSS("transform", "none");
    await page.keyboard.press("ArrowDown");
    await page.getByRole("radio", { name: mode === "stills" ? "CGI" : "STILLS", exact: true }).click();
    await waitForRolodexIdle(page, "Project One");
    await expect(page.locator('.rolodex-panel[aria-hidden="false"]')).toHaveCount(1);
  });
}

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
    await expect(page).toHaveURL(new RegExp(`/work\\?mode=${project.discipline}&project=${next.slug}$`));
    await expect(page.getByRole("radio", { name: project.discipline.toUpperCase(), exact: true })).toBeChecked();
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
      await waitForRolodexIdle(page, "Project One");
      await expectNoHorizontalOverflow(page);
      for (const selector of ['.work-mode-control', '.rolodex-nav', '.rolodex-panel[data-state="active"] .rolodex-heading', '.rolodex-panel[data-state="active"] .rolodex-liquid-cta']) {
        await expectElementInsideViewport(page.locator(selector), selector);
      }
      await page.screenshot({path: testInfo.outputPath(`${mode}.png`)});
    }
    await page.goto("/");
    await expectNoHorizontalOverflow(page);
    await page.screenshot({path: testInfo.outputPath("home.png")});
  });
}
