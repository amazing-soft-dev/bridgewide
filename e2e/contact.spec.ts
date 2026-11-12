import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("contact requires a topic and shows a server error", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ ok: false, error: "Desk unavailable." }) }),
  );
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Ada Lovelace");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByLabel("Message").fill("Hello from the desk test.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Choose a topic from the list.")).toBeVisible();

  await page.getByLabel("Topic").selectOption("Press");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("alert")).toContainText("Desk unavailable.");
});

test("AI training contact uses the same topic control", async ({ page }) => {
  await page.goto("/ai-training/contact");
  const topic = page.getByLabel("Topic");
  await expect(topic).toBeVisible();
  await topic.focus();
  await page.keyboard.press("ArrowDown");
  await expect(topic).toBeFocused();
});

test("a closed role has no apply form and an empty region keeps a profile", async ({ page }) => {
  await page.goto("/roles/staff-backend-engineer-san-francisco");
  await expect(page.getByRole("heading", { name: "This role is closed." })).toBeVisible();
  await expect(page.getByLabel("Apply in two minutes")).toHaveCount(0);
  await page.goto("/regions/usa");
  await expect(page.getByRole("link", { name: "Leave a CV and a profile" })).toHaveAttribute(
    "href",
    "/contact?region=usa#keep-profile",
  );
});
