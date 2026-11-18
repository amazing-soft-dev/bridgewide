import { expect, type Page, test } from "@playwright/test";

// The star field has a round Replay button in its corner. It puts the mark back
// at rest and plays the entrance again. These checks cover the button itself:
// it is named, it can be used from the keyboard, replaying raises no script
// error and leaves the field on screen, and visitors who ask for reduced
// motion are not offered an entrance to replay.

const stage = (page: Page) => page.locator("section", { has: page.locator("[data-astra-left]") });
const replay = (page: Page) => stage(page).getByRole("button", { name: "Replay the star field animation" });

async function openStage(page: Page) {
  await page.goto("/");
  await page.locator("[data-astra-left]").waitFor({ state: "attached" });
  await stage(page).scrollIntoViewIfNeeded();
}

test.describe("replaying the star field", () => {
  test("the stage has a named Replay button in its corner", async ({ page }) => {
    await openStage(page);
    const button = replay(page);
    await expect(button).toBeVisible();
    const stageBox = await stage(page).locator("> div").first().boundingBox();
    const box = await button.boundingBox();
    if (!stageBox || !box) throw new Error("the stage and the button must both be laid out");
    // Bottom-right of the stage.
    expect(box.x + box.width).toBeGreaterThan(stageBox.x + stageBox.width * 0.8);
    expect(box.y + box.height).toBeGreaterThan(stageBox.y + stageBox.height * 0.7);
  });

  test("replaying leaves the field on screen with no script error", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await openStage(page);
    const button = replay(page);
    await button.click();
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(stage(page).locator("canvas")).toBeVisible();
    await expect(page.locator("[data-astra-left]")).toHaveText("Bridge");
    expect(errors).toEqual([]);
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("the Replay button is not offered", async ({ page }) => {
      await openStage(page);
      await expect(replay(page)).toBeHidden();
    });
  });
});
