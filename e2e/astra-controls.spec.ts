import { expect, type Page, test } from "@playwright/test";

// The star field can be turned by dragging it or with the arrow keys. These
// checks cover the control: it is a named, focusable button, an arrow key does
// not scroll the page while it is focused, a released drag eases the mark back
// to rest, and the control is gone for visitors who ask for reduced motion.

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

  test("a released drag eases the mark back to rest", async ({ page }) => {
    await openStage(page);
    const button = surface(page);
    const box = await button.boundingBox();
    if (!box) throw new Error("the turn button has no box");
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 240, y + 60, { steps: 12 });
    await expect(button).toHaveAttribute("data-dragging", "true");
    await page.mouse.up();
    await expect(button).not.toHaveAttribute("data-dragging", "true");
    await expect(button).toHaveAttribute("data-settling", "true");
    // Software WebGL in CI draws a few frames a second, so allow it time to arrive.
    await expect(button).not.toHaveAttribute("data-settling", "true", { timeout: 15_000 });
  });

  test("an arrow key stops a settle and the turn stays", async ({ page }) => {
    await openStage(page);
    const button = surface(page);
    const box = await button.boundingBox();
    if (!box) throw new Error("the turn button has no box");
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 200, box.y + box.height / 2, { steps: 10 });
    await page.mouse.up();
    await expect(button).toHaveAttribute("data-settling", "true");
    await button.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(button).not.toHaveAttribute("data-settling", "true");
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
