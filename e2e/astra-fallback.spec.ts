import { chromium, expect, type Page, test } from "@playwright/test";

// The star field after the footer is WebGL. These checks cover what a visitor
// sees when WebGL is not there, or goes away, instead of a flat dark box: the
// still sky, with both words, and no script error.

const stage = (page: Page) => page.locator("section", { has: page.locator("[data-astra-left]") });

/** Collects uncaught page errors so a test can assert there were none. */
function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function openStage(page: Page) {
  await page.goto("/");
  await page.locator("[data-astra-left]").waitFor({ state: "attached" });
  await stage(page).scrollIntoViewIfNeeded();
}

/** Whether this browser can make a WebGL context at all. */
function hasWebgl(page: Page) {
  return page.evaluate(() => {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  });
}

/** Loses, and optionally restores, the star field's WebGL context. */
function loseContext(page: Page, restoreAfterMs: number | null) {
  return page.evaluate((restoreAfter) => {
    const canvas = document.querySelector<HTMLCanvasElement>("[data-astra-left]")?.closest("section")?.querySelector("canvas");
    // Asking a canvas for the context type it already has returns that context.
    const gl = canvas?.getContext("webgl2") ?? canvas?.getContext("webgl");
    const lose = gl?.getExtension("WEBGL_lose_context");
    if (!lose) throw new Error("the star field has no WebGL context to lose");
    lose.loseContext();
    if (restoreAfter !== null) setTimeout(() => lose.restoreContext(), restoreAfter);
  }, restoreAfterMs);
}

test.describe("without WebGL", () => {
  test("the star field shows the still sky and both words, with no script error", async ({ baseURL, viewport }) => {
    // A browser of its own: Playwright does not allow launch options per describe block.
    const browser = await chromium.launch({ args: ["--disable-3d-apis", "--disable-gpu"] });
    try {
      const context = await browser.newContext({ baseURL: baseURL ?? undefined, viewport });
      const page = await context.newPage();
      const errors = collectPageErrors(page);
      await openStage(page);

      expect(await hasWebgl(page)).toBe(false);
      await expect(page.locator("[data-astra-fallback='static-dust']")).toBeVisible();
      await expect(page.locator("[data-astra-left]")).toBeVisible();
      await expect(page.locator("[data-astra-left]")).toHaveText("Bridge");
      await expect(page.locator("[data-astra-right]")).toBeVisible();
      await expect(page.locator("[data-astra-right]")).toHaveText("Wide");
      // The canvas is gone and the label no longer promises a mark that is not there.
      await expect(stage(page).locator("canvas")).toHaveCount(0);
      await expect(stage(page)).not.toHaveAttribute("aria-label", /mark/i);
      expect(errors).toEqual([]);
    } finally {
      await browser.close();
    }
  });
});

test.describe("with WebGL", () => {
  test("a lost context that comes back keeps the live field", async ({ page }) => {
    const errors = collectPageErrors(page);
    await openStage(page);
    test.skip(!(await hasWebgl(page)), "this browser cannot make a WebGL context");
    await expect(stage(page).locator("canvas")).toHaveCount(1);

    await loseContext(page, 400);
    // Longer than the time the field waits for a restore (3 s): it must not give up.
    await page.waitForTimeout(4500);

    await expect(stage(page).locator("canvas")).toHaveCount(1);
    await expect(page.locator("[data-astra-fallback]")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test("a lost context that never comes back falls back to the still sky", async ({ page }) => {
    const errors = collectPageErrors(page);
    await openStage(page);
    test.skip(!(await hasWebgl(page)), "this browser cannot make a WebGL context");
    await expect(stage(page).locator("canvas")).toHaveCount(1);

    await loseContext(page, null);

    await expect(page.locator("[data-astra-fallback='static-dust']")).toBeVisible({ timeout: 10_000 });
    await expect(stage(page).locator("canvas")).toHaveCount(0);
    await expect(page.locator("[data-astra-left]")).toBeVisible();
    expect(errors).toEqual([]);
  });
});
