# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: work-architecture.spec.ts >> CGI persisted browser context does not hydrate into an expanded player
- Location: tests\e2e\work-architecture.spec.ts:67:5

# Error details

```
Error: expect(locator).toBeChecked() failed

Locator:  getByRole('radio', { name: 'CGI', exact: true })
Expected: checked
Received: unchecked
Timeout:  5000ms

Call log:
  - Expect "toBeChecked" with timeout 5000ms
  - waiting for getByRole('radio', { name: 'CGI', exact: true })
    14 × locator resolved to <button role="radio" type="button" tabindex="-1" aria-checked="false" class="work-mode-control__option">…</button>
       - unexpected value "unchecked"

```

```yaml
- radio "CGI"
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | import { projects, getProjects, projectHref, stillsYears, workHref } from "../../src/data/work-projects";
  3   | import { expectElementInsideViewport, expectNoHorizontalOverflow, expectNoConsoleFailures, waitForRolodexIdle } from "./helpers";
  4   | 
  5   | test("Home, menu and About use the reduced hierarchy", async ({ page }) => {
  6   |   const checkErrors = await expectNoConsoleFailures(page);
  7   |   await page.goto("/");
  8   |   await expect(page.locator(".rolodex-shell")).toHaveCount(0);
  9   |   const destinations = page.getByRole("navigation", { name: "Primary destinations" });
  10  |   await expect(destinations.getByRole("link")).toHaveCount(2);
  11  |   await destinations.getByRole("link", { name: /ABOUT/ }).click();
  12  |   await expect(page).toHaveURL(/\/about$/);
  13  |   await expect(page.getByRole("heading", { name: "About", exact: true })).toBeVisible();
  14  |   await page.getByRole("button", { name: "Open navigation menu" }).click();
  15  |   const dialog = page.getByRole("dialog");
  16  |   await expect(dialog.getByRole("link")).toHaveCount(2);
  17  |   await dialog.getByRole("link", { name: /work/ }).click();
  18  |   await expect(page).toHaveURL(/\/work$/);
  19  |   await page.getByRole("link", { name: "Home", exact: true }).click();
  20  |   await expect(page).toHaveURL(/\/$/);
  21  |   await checkErrors();
  22  | });
  23  | 
  24  | test("mode changes are isolated, instantaneous client history entries", async ({ page }) => {
  25  |   const checkErrors = await expectNoConsoleFailures(page);
  26  |   await page.goto("/work");
  27  |   await expect(page.locator("main")).toHaveAttribute("data-work-mode", "stills");
  28  |   await expect(page.locator(".rolodex-panel")).toHaveCount(3);
  29  |   await page.evaluate(() => { (window as unknown as { workDocument: string }).workDocument = "same-document"; });
  30  |   await page.getByRole("radio", { name: "CGI", exact: true }).click();
  31  |   await expect(page).toHaveURL(/\/work\?mode=cgi$/);
  32  |   await expect(page.locator(".rolodex-shell")).toHaveCount(0);
  33  |   await expect(page.locator(".cgi-project-tile")).toHaveCount(5);
  34  |   await expect(page.locator('[data-panel="stills"]')).toHaveCount(0);
  35  |   await page.getByRole("radio", { name: "STILLS", exact: true }).click();
  36  |   await expect(page.locator(".cgi-tile-browser")).toHaveCount(0);
  37  |   await expect(page.locator(".rolodex-panel")).toHaveCount(3);
  38  |   await page.goBack();
  39  |   await expect(page.getByRole("radio", { name: "CGI", exact: true })).toBeChecked();
  40  |   await page.goBack();
  41  |   await expect(page).toHaveURL(/\/work$/);
  42  |   await expect(page.getByRole("radio", { name: "STILLS", exact: true })).toBeChecked();
  43  |   await page.goForward();
  44  |   await expect(page.getByRole("radio", { name: "CGI", exact: true })).toBeChecked();
  45  |   expect(await page.evaluate(() => (window as unknown as {workDocument: string}).workDocument)).toBe("same-document");
  46  |   await page.getByRole("radio", { name: "CGI", exact: true }).press("ArrowLeft");
  47  |   await expect(page.getByRole("radio", { name: "STILLS", exact: true })).toBeFocused();
  48  |   await expect(page.locator('[data-panel="cgi"]')).toHaveCount(0);
  49  |   await checkErrors();
  50  | });
  51  | 
  52  | test("Work restores session mode and project position", async ({ page }) => {
  53  |   await page.goto("/work?mode=cgi&project=project-four");
  54  |   await expect(page.getByRole("heading", { name: "Project Four", exact: true })).toBeVisible();
  55  |   await page.getByRole("link", { name: /view full project/i }).click();
  56  |   await expect(page).toHaveURL(/\/cgi\/project-four$/);
  57  |   await page.getByRole("link", { name: /^← CGI$/ }).click();
  58  |   await expect(page).toHaveURL(/\/work\?mode=cgi$/);
  59  |   await expect(page.locator(".cgi-expanded-player")).toHaveCount(0);
  60  |   await expect(page.getByRole("button", { name: /open cgi project 04, project four/i })).toBeVisible();
  61  |   await page.goto("/work");
  62  |   await expect(page.getByRole("radio", { name: "CGI", exact: true })).toBeChecked();
  63  |   await expect(page.locator(".cgi-expanded-player")).toHaveCount(0);
  64  |   await expect(page.getByRole("button", { name: /open cgi project 04, project four/i })).toBeVisible();
  65  | });
  66  | 
  67  | test("CGI persisted browser context does not hydrate into an expanded player", async ({ page }) => {
  68  |   const checkErrors = await expectNoConsoleFailures(page);
  69  |   await page.goto("/work");
  70  |   await page.evaluate(() => {
  71  |     window.sessionStorage.setItem("ak-work-mode", "cgi");
  72  |     window.sessionStorage.setItem("ak-work-position:cgi", "project-three");
  73  |     window.sessionStorage.setItem("ak-work-scroll:cgi", "0");
  74  |   });
  75  |   await page.reload();
  76  |   await expect(page).toHaveURL(/\/work$/);
> 77  |   await expect(page.getByRole("radio", { name: "CGI", exact: true })).toBeChecked();
      |                                                                       ^ Error: expect(locator).toBeChecked() failed
  78  |   await expect(page.locator(".cgi-tile-browser")).toHaveAttribute("data-active", "false");
  79  |   await expect(page.locator(".cgi-expanded-player")).toHaveCount(0);
  80  |   await expect(page.getByRole("button", { name: /open cgi project 03, project three/i })).toBeVisible();
  81  |   await checkErrors();
  82  | });
  83  | 
  84  | test("stills: year panels cycle forward and expose only assigned collections", async ({ page }) => {
  85  |   await page.goto(workHref("stills"));
  86  | 
  87  |   for (let i = 0; i < stillsYears.length; i++) {
  88  |     const year = stillsYears[i];
  89  |     await waitForRolodexIdle(page, year.year);
  90  |     const active = page.locator('.rolodex-panel[data-state="active"]');
  91  | 
  92  |     await expect(active.getByRole("link")).toHaveCount(year.collections.length);
  93  | 
  94  |     for (const collection of year.collections) {
  95  |       await expect(active.getByRole("link", { name: `${collection.title} ${collection.year}` })).toHaveAttribute("href", projectHref(collection));
  96  |     }
  97  | 
  98  |     if (year.year === "2024") {
  99  |       await expect(active.getByRole("link", { name: /formula one/i })).toHaveCount(0);
  100 |     }
  101 | 
  102 |     await expect(page.locator('.rolodex-panel[aria-hidden="false"]')).toHaveCount(1);
  103 |     await page.mouse.move(900, 500);
  104 |     await page.mouse.wheel(0, 90);
  105 |     await page.mouse.wheel(0, 65);
  106 |     await page.mouse.wheel(0, 25);
  107 |     await waitForRolodexIdle(page, stillsYears[(i + 1) % stillsYears.length].year);
  108 |   }
  109 | 
  110 |   await page.mouse.wheel(0, -150);
  111 |   await page.waitForTimeout(400);
  112 |   await waitForRolodexIdle(page, stillsYears[0].year);
  113 |   await page.locator('.rolodex-panel[data-state="active"]').getByRole("link", { name: /goodwood festival of speed 2024/i }).click();
  114 |   await expect(page).toHaveURL(new RegExp(`${projectHref(stillsYears[0].collections[0])}$`));
  115 | });
  116 | 
  117 | test("cgi: tile field opens and closes an inline player without a Rolodex", async ({ page }) => {
  118 |   await page.goto(workHref("cgi"));
  119 |   const items = getProjects("cgi");
  120 | 
  121 |   await expect(page.locator(".rolodex-shell")).toHaveCount(0);
  122 |   await expect(page.locator(".cgi-project-tile")).toHaveCount(items.length);
  123 | 
  124 |   for (const project of items) {
  125 |     const tile = page.getByRole("button", { name: new RegExp(`open cgi project ${project.index}, ${project.title}`, "i") });
  126 |     await expect(tile).toBeVisible();
  127 |   }
  128 | 
  129 |   await page.getByRole("button", { name: /open cgi project 04, project four/i }).click();
  130 |   await expect(page).toHaveURL(/\/work\?mode=cgi&project=project-four$/);
  131 |   await expect(page.getByRole("heading", { name: "Project Four", exact: true })).toBeVisible();
  132 |   await expect(page.getByRole("button", { name: /close cgi player/i })).toBeVisible();
  133 |   await expect(page.getByRole("link", { name: /view full project/i })).toHaveAttribute("href", "/cgi/project-four");
  134 |   await page.keyboard.press("Escape");
  135 |   await expect(page.getByRole("heading", { name: "Project Four", exact: true })).toHaveCount(0);
  136 |   await expect(page).toHaveURL(/\/work\?mode=cgi$/);
  137 | });
  138 | 
  139 | test("stills: reduced motion keeps the Rolodex engine clean", async ({ page }) => {
  140 |   await page.emulateMedia({ reducedMotion: "reduce" });
  141 |   await page.goto(workHref("stills"));
  142 |   await waitForRolodexIdle(page, "2024");
  143 |   await page.keyboard.press("ArrowDown");
  144 |   await waitForRolodexIdle(page, "2025");
  145 |   await expect(page.locator('.rolodex-scene-wrap[data-state="active"]')).toHaveCSS("transform", "none");
  146 |   await page.keyboard.press("ArrowDown");
  147 |   await page.getByRole("radio", { name: "CGI", exact: true }).click();
  148 |   await expect(page.locator(".rolodex-shell")).toHaveCount(0);
  149 |   await expect(page.locator(".cgi-project-tile")).toHaveCount(getProjects("cgi").length);
  150 | });
  151 | 
  152 | test("cgi: reduced motion and mode switching close the inline player cleanly", async ({ page }) => {
  153 |   await page.emulateMedia({ reducedMotion: "reduce" });
  154 |   await page.goto(workHref("cgi"));
  155 |   await expect(page.locator(".cgi-project-tile")).toHaveCount(getProjects("cgi").length);
  156 |   await page.getByRole("button", { name: /open cgi project 02, project two/i }).click();
  157 |   await expect(page.getByRole("heading", { name: "Project Two", exact: true })).toBeVisible();
  158 |   await page.getByRole("radio", { name: "STILLS", exact: true }).click();
  159 |   await waitForRolodexIdle(page, "2024");
  160 |   await expect(page.locator(".cgi-expanded-player")).toHaveCount(0);
  161 |   await expect(page.locator('.rolodex-panel[aria-hidden="false"]')).toHaveCount(1);
  162 | });
  163 | 
  164 | for (const project of projects) {
  165 |   test(`${project.discipline}/${project.slug}: direct interior, next and return`, async ({ page }) => {
  166 |     const checkErrors = await expectNoConsoleFailures(page);
  167 |     const siblings = getProjects(project.discipline);
  168 |     const next = siblings[(siblings.findIndex((p) => p.slug === project.slug) + 1) % siblings.length];
  169 |     const response = await page.goto(projectHref(project));
  170 |     expect(response?.status()).toBe(200);
  171 |     await expect(page.getByRole("heading", { name: project.title, exact: true })).toBeVisible();
  172 |     await expect(page.locator("main")).toHaveAttribute("data-discipline", project.discipline);
  173 |     const footer = page.getByRole("navigation", { name: /project navigation/ });
  174 |     await expect(footer).toContainText("Next Project");
  175 |     await expect(footer.getByRole("link", { name: new RegExp(`next project, ${next.title}`, "i") })).toHaveAttribute("href", projectHref(next));
  176 |     await footer.getByRole("link", { name: new RegExp(`next project, ${next.title}`, "i") }).click();
  177 |     await expect(page).toHaveURL(new RegExp(`${projectHref(next)}$`));
```