import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Pages a visitor reaches first. The browser job runs this on a desktop and a
// narrow viewport. A serious or critical violation fails the job and names the
// rule, the page, and each element, with the two colours and the ratio for a
// contrast failure.
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

    const results = await new AxeBuilder({ page }).withTags(tags).analyze();

    const serious = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
    const report = serious.map((violation) => {
      const nodes = violation.nodes.slice(0, 12).map((node) => {
        const data = (node.any[0]?.data ?? {}) as { fgColor?: string; bgColor?: string; contrastRatio?: number };
        const colours = data.fgColor ? ` [${data.fgColor} on ${data.bgColor}, ${data.contrastRatio}:1]` : "";
        return `  ${node.target.join(" ")}${colours}`;
      });
      return `${violation.id} (${violation.impact}), ${violation.nodes.length} element(s): ${violation.help}\n${nodes.join("\n")}`;
    });
    expect(report, `accessibility violations on ${route}:\n${report.join("\n")}`).toEqual([]);
  });
}
