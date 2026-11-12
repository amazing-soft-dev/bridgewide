import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Pages a visitor reaches first. The browser job runs this on a desktop and a
// narrow viewport. A serious or critical violation fails the job and names the
// rule, the page, and the element.
//
// color-contrast is scanned apart from the rest and only reported. The palette
// fails AA on every page today (see the contrast issue), and fixing it is a
// design decision. When that lands, delete the second scan and let the first
// one cover every rule.
const routes = [
  "/",
  "/contact",
  "/ai-training/contact",
  "/roles",
  "/employers",
  "/engineers",
  "/salary-guide",
  "/regions/usa",
  "/privacy",
  "/terms",
  "/this-page-does-not-exist",
];

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.beforeEach(async ({ page }) => {
  // Motion that fades content in would hide it from the scan, so ask for none.
  await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const route of routes) {
  test(`axe finds no serious problem on ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).withTags(tags).disableRules(["color-contrast"]).analyze();

    const serious = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
    const report = serious.map(
      (violation) =>
        `${violation.id} (${violation.impact}): ${violation.help}\n` +
        violation.nodes
          .slice(0, 3)
          .map((node) => `  ${node.target.join(" ")}`)
          .join("\n"),
    );
    expect(report, `accessibility violations on ${route}:\n${report.join("\n")}`).toEqual([]);

    const contrast = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
    const count = contrast.violations.flatMap((violation) => violation.nodes).length;
    test.info().annotations.push({ type: "color-contrast", description: `${count} element(s) below AA on ${route}` });
  });
}
