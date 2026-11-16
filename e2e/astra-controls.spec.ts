import { expect, type Page, test } from "@playwright/test";

// The star field can be turned by dragging it or with the arrow keys. These
// checks cover the keyboard side: the control is a named, focusable button, an
// arrow key does not scroll the page while it is focused, and it is gone for
// visitors who ask for reduced motion.

const stage = (page: Page) => page.locator("section", { has: page.locator("[data-astra-left]") });
const surface = (page: Page) => stage(page).getByRole("button", { name: /arrow keys to turn the BridgeWide mark/ });

async function openStage(page: Page) {
  await page.goto("/");
  await page.locator("[data-astra-left]").waitFor({ state: "attached" });
  await stage(page).scrollIntoViewIfNeeded();
}

test.describe("turning the mark", () => {
  test("the stage has a named button that takes keyboard focus", async ({ page }) => {
    await openStage(page);
    const button = surface(page);
    await expect(button).toBeVisible();
    await button.focus();
    await expect(button).toBeFocused();
  });

  test("an arrow key turns the mark and does not scroll the page", async ({ page }) => {
    await openStage(page);
    const button = surface(page);
    await button.focus();
    const before = await page.evaluate(() => window.scrollY);
    for (const key of ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"]) await page.keyboard.press(key);
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
    await expect(button).toBeFocused();
  });

  test("other keys keep their normal job", async ({ page }) => {
    await openStage(page);
    const button = surface(page);
    await button.focus();
    // Tab moves on instead of being swallowed by the control.
    await page.keyboard.press("Tab");
    await expect(button).not.toBeFocused();
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("the turn button is not offered", async ({ page }) => {
      await openStage(page);
      await expect(surface(page)).toBeHidden();
    });
  });
});
