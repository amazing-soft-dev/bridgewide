import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("a failed check puts focus on the first field with an error", async ({ page }) => {
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Contact BridgeWide" });
  await form.getByRole("button", { name: "Send message" }).click();

  const firstInvalid = form.locator("[aria-invalid='true']").first();
  await expect(firstInvalid).toBeVisible();
  await expect(firstInvalid).toBeFocused();
  // The message that explains it is tied to the field, so a screen reader reads it with the field.
  const describedBy = await firstInvalid.getAttribute("aria-describedby");
  expect(describedBy).toBeTruthy();
  await expect(page.locator(`#${describedBy}`)).toContainText(/.+/);
});

test("what the visitor typed is still there after a server error", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ ok: false, error: "Try again in a minute." }) }),
  );
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Contact BridgeWide" });
  await form.getByLabel("Your name").fill("Ada Lovelace");
  await form.getByLabel("Email").fill("ada@example.com");
  await form.getByLabel("Topic").selectOption("Press");
  await form.getByLabel("Message").fill("Please keep this text.");
  await form.getByRole("button", { name: "Send message" }).click();

  await expect(form.getByRole("alert")).toContainText("Try again in a minute.");
  await expect(form.getByLabel("Your name")).toHaveValue("Ada Lovelace");
  await expect(form.getByLabel("Email")).toHaveValue("ada@example.com");
  await expect(form.getByLabel("Message")).toHaveValue("Please keep this text.");
});

test("the AI-training contact page focuses the first error too", async ({ page }) => {
  await page.goto("/ai-training/contact");
  const form = page.getByRole("form", { name: "Contact BridgeWide" });
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.locator("[aria-invalid='true']").first()).toBeFocused();
});
