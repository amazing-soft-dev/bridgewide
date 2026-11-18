import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

const pdf = { name: "ada-cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 a small test CV") };

/** Answer a form post with ok:true and remember what was sent. */
async function captureTo(page: Page, url: string) {
  const sent: { body: string }[] = [];
  await page.route(url, async (route) => {
    sent.push({ body: route.request().postData() ?? "" });
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, id: "BW-test" }) });
  });
  return sent;
}

test.describe("CV upload on /engineers", () => {
  test("sends a good PDF with the details and shows the thanks", async ({ page }) => {
    const sent = await captureTo(page, "**/api/cv");
    await page.goto("/engineers");
    const form = page.getByRole("form", { name: "Send a CV" });
    await form.getByLabel("Name", { exact: true }).fill("Ada Lovelace");
    await form.getByLabel("Email", { exact: true }).fill("ada@example.com");
    await form.getByLabel("Region", { exact: true }).selectOption({ index: 1 });
    await form.getByLabel("Right to work in this region", { exact: true }).selectOption({ index: 1 });
    await form.getByLabel("CV", { exact: true }).setInputFiles(pdf);
    await form.getByRole("button", { name: "Send CV" }).click();

    await expect(form.getByRole("status")).toContainText("Your CV is on its way");
    expect(sent).toHaveLength(1);
    expect(sent[0].body).toContain("ada@example.com");
    expect(sent[0].body).toContain("ada-cv.pdf");
  });

  test("refuses a text file before sending anything", async ({ page }) => {
    const sent = await captureTo(page, "**/api/cv");
    await page.goto("/engineers");
    const form = page.getByRole("form", { name: "Send a CV" });
    await form.getByLabel("Name", { exact: true }).fill("Ada Lovelace");
    await form.getByLabel("Email", { exact: true }).fill("ada@example.com");
    await form.getByLabel("Region", { exact: true }).selectOption({ index: 1 });
    await form.getByLabel("Right to work in this region", { exact: true }).selectOption({ index: 1 });
    await form.getByLabel("CV", { exact: true }).setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("hello") });
    await form.getByRole("button", { name: "Send CV" }).click();

    await expect(form.getByText("Upload a PDF, DOC, or DOCX file.")).toBeVisible();
    expect(sent).toHaveLength(0);
  });

  test("shows the server's reason when the post fails", async ({ page }) => {
    await page.route("**/api/cv", (route) =>
      route.fulfill({ status: 413, contentType: "application/json", body: JSON.stringify({ ok: false, error: "CV must be 5 MB or smaller." }) }),
    );
    await page.goto("/engineers");
    const form = page.getByRole("form", { name: "Send a CV" });
    await form.getByLabel("Name", { exact: true }).fill("Ada Lovelace");
    await form.getByLabel("Email", { exact: true }).fill("ada@example.com");
    await form.getByLabel("Region", { exact: true }).selectOption({ index: 1 });
    await form.getByLabel("Right to work in this region", { exact: true }).selectOption({ index: 1 });
    await form.getByLabel("CV", { exact: true }).setInputFiles(pdf);
    await form.getByRole("button", { name: "Send CV" }).click();

    await expect(form.getByRole("alert")).toContainText("CV must be 5 MB or smaller.");
    await expect(form.getByLabel("Name", { exact: true })).toHaveValue("Ada Lovelace");
  });
});

test.describe("keep a profile on /contact", () => {
  const fill = async (form: ReturnType<Page["getByRole"]>) => {
    await form.getByLabel("Name", { exact: true }).fill("Ada Lovelace");
    await form.getByLabel("Email", { exact: true }).fill("ada@example.com");
    await form.getByLabel("Region", { exact: true }).selectOption({ index: 1 });
    await form.getByLabel("Country", { exact: true }).fill("United States");
    await form.getByLabel("Discipline", { exact: true }).fill("Backend");
    await form.getByLabel("Years of experience", { exact: true }).fill("10");
    await form.getByLabel("Work mode", { exact: true }).selectOption({ index: 1 });
    await form.getByLabel("Profile", { exact: true }).fill("Ten years of Rust.");
    await form.getByLabel("CV", { exact: true }).setInputFiles(pdf);
  };

  test("will not keep a profile without consent, and puts focus on the box", async ({ page }) => {
    const sent = await captureTo(page, "**/api/talent-pool");
    await page.goto("/contact#keep-profile");
    const form = page.getByRole("form", { name: "Keep your profile" });
    await fill(form);
    await form.getByRole("button", { name: "Keep my profile" }).click();

    await expect(form.getByRole("alert")).toContainText("Consent is required");
    await expect(form.locator("input[name=consent]")).toBeFocused();
    expect(sent).toHaveLength(0);
  });

  test("keeps the profile once consent is given", async ({ page }) => {
    const sent = await captureTo(page, "**/api/talent-pool");
    await page.goto("/contact#keep-profile");
    const form = page.getByRole("form", { name: "Keep your profile" });
    await fill(form);
    await form.locator("input[name=consent]").check();
    await form.getByRole("button", { name: "Keep my profile" }).click();

    await expect(form.getByRole("status")).toContainText("12 months");
    expect(sent).toHaveLength(1);
    expect(sent[0].body).toContain("ada-cv.pdf");
    expect(sent[0].body).toContain("consent");
  });
});
