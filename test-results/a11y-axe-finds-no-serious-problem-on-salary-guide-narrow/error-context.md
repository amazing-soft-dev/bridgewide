# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> axe finds no serious problem on /salary-guide
- Location: e2e\a11y.spec.ts:30:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main"
  - banner:
    - generic [ref=e3]:
      - generic [ref=e5]: 14 roles live
      - link "Salary guide →" [ref=e6] [cursor=pointer]:
        - /url: /salary-guide
    - generic [ref=e8]:
      - link "BridgeWide" [ref=e9] [cursor=pointer]:
        - /url: /
      - generic [ref=e13]:
        - button "Search roles" [ref=e14] [cursor=pointer]
        - button "Menu" [ref=e18] [cursor=pointer]
  - main [ref=e21]:
    - generic [ref=e24]:
      - paragraph [ref=e25]: Salary guide
      - heading "Autumn 2026 edition" [level=1] [ref=e26]
      - paragraph [ref=e28]: Annual base salary in USD. Low, median, and high for each discipline, compared in the region where the engineer will be employed. Equity and local rules sit beside these bands.
    - region "Bands by region" [ref=e29]:
      - generic [ref=e30]:
        - generic [ref=e31]:
          - paragraph [ref=e32]: Bands
          - heading "Bands by region" [level=2] [ref=e33]
          - generic [ref=e34]: Use a band to set an offer conversation. A figure under the median should be said early, before a shortlist goes out.
        - region "Salary bands by discipline and region (scrolls sideways on a narrow screen)" [ref=e36]:
          - table "Autumn 2026 edition. Annual base salary in USD. Low, high, and median for every discipline in each region." [ref=e37]:
            - caption [ref=e38]: Autumn 2026 edition. Annual base salary in USD. Low, high, and median for every discipline in each region.
            - rowgroup [ref=e39]:
              - row [ref=e40]:
                - columnheader "Discipline" [ref=e41]
                - columnheader "United States" [ref=e42]
                - columnheader "Canada" [ref=e43]
                - columnheader "Latin America" [ref=e44]
                - columnheader "Europe" [ref=e45]
                - columnheader "Asia" [ref=e46]
            - rowgroup [ref=e47]:
              - row [ref=e48]:
                - rowheader "Backend" [ref=e49]
                - cell "$165,000–$245,000 Median $198,000" [ref=e50]:
                  - generic [ref=e51]: $165,000–$245,000
                  - generic [ref=e52]: Median $198,000
                - cell "$130,000–$185,000 Median $155,000" [ref=e53]:
                  - generic [ref=e54]: $130,000–$185,000
                  - generic [ref=e55]: Median $155,000
                - cell "$72,000–$128,000 Median $96,000" [ref=e56]:
                  - generic [ref=e57]: $72,000–$128,000
                  - generic [ref=e58]: Median $96,000
                - cell "$110,000–$178,000 Median $142,000" [ref=e59]:
                  - generic [ref=e60]: $110,000–$178,000
                  - generic [ref=e61]: Median $142,000
                - cell "$66,000–$118,000 Median $88,000" [ref=e62]:
                  - generic [ref=e63]: $66,000–$118,000
                  - generic [ref=e64]: Median $88,000
              - row [ref=e65]:
                - rowheader "Frontend" [ref=e66]
                - cell "$150,000–$220,000 Median $180,000" [ref=e67]:
                  - generic [ref=e68]: $150,000–$220,000
                  - generic [ref=e69]: Median $180,000
                - cell "$120,000–$175,000 Median $145,000" [ref=e70]:
                  - generic [ref=e71]: $120,000–$175,000
                  - generic [ref=e72]: Median $145,000
                - cell "$64,000–$115,000 Median $86,000" [ref=e73]:
                  - generic [ref=e74]: $64,000–$115,000
                  - generic [ref=e75]: Median $86,000
                - cell "$100,000–$165,000 Median $130,000" [ref=e76]:
                  - generic [ref=e77]: $100,000–$165,000
                  - generic [ref=e78]: Median $130,000
                - cell "$59,000–$106,000 Median $79,000" [ref=e79]:
                  - generic [ref=e80]: $59,000–$106,000
                  - generic [ref=e81]: Median $79,000
              - row [ref=e82]:
                - rowheader "Data" [ref=e83]
                - cell "$168,000–$250,000 Median $205,000" [ref=e84]:
                  - generic [ref=e85]: $168,000–$250,000
                  - generic [ref=e86]: Median $205,000
                - cell "$135,000–$195,000 Median $162,000" [ref=e87]:
                  - generic [ref=e88]: $135,000–$195,000
                  - generic [ref=e89]: Median $162,000
                - cell "$76,000–$140,000 Median $102,000" [ref=e90]:
                  - generic [ref=e91]: $76,000–$140,000
                  - generic [ref=e92]: Median $102,000
                - cell "$115,000–$185,000 Median $148,000" [ref=e93]:
                  - generic [ref=e94]: $115,000–$185,000
                  - generic [ref=e95]: Median $148,000
                - cell "$70,000–$129,000 Median $94,000" [ref=e96]:
                  - generic [ref=e97]: $70,000–$129,000
                  - generic [ref=e98]: Median $94,000
              - row [ref=e99]:
                - rowheader "Cloud" [ref=e100]
                - cell "$170,000–$260,000 Median $210,000" [ref=e101]:
                  - generic [ref=e102]: $170,000–$260,000
                  - generic [ref=e103]: Median $210,000
                - cell "$140,000–$200,000 Median $168,000" [ref=e104]:
                  - generic [ref=e105]: $140,000–$200,000
                  - generic [ref=e106]: Median $168,000
                - cell "$80,000–$145,000 Median $108,000" [ref=e107]:
                  - generic [ref=e108]: $80,000–$145,000
                  - generic [ref=e109]: Median $108,000
                - cell "$120,000–$190,000 Median $152,000" [ref=e110]:
                  - generic [ref=e111]: $120,000–$190,000
                  - generic [ref=e112]: Median $152,000
                - cell "$74,000–$133,000 Median $99,000" [ref=e113]:
                  - generic [ref=e114]: $74,000–$133,000
                  - generic [ref=e115]: Median $99,000
              - row [ref=e116]:
                - rowheader "Mobile" [ref=e117]
                - cell "$155,000–$230,000 Median $188,000" [ref=e118]:
                  - generic [ref=e119]: $155,000–$230,000
                  - generic [ref=e120]: Median $188,000
                - cell "$125,000–$180,000 Median $150,000" [ref=e121]:
                  - generic [ref=e122]: $125,000–$180,000
                  - generic [ref=e123]: Median $150,000
                - cell "$68,000–$120,000 Median $90,000" [ref=e124]:
                  - generic [ref=e125]: $68,000–$120,000
                  - generic [ref=e126]: Median $90,000
                - cell "$105,000–$170,000 Median $136,000" [ref=e127]:
                  - generic [ref=e128]: $105,000–$170,000
                  - generic [ref=e129]: Median $136,000
                - cell "$63,000–$110,000 Median $83,000" [ref=e130]:
                  - generic [ref=e131]: $63,000–$110,000
                  - generic [ref=e132]: Median $83,000
              - row [ref=e133]:
                - rowheader "Leadership" [ref=e134]
                - cell "$220,000–$340,000 Median $275,000" [ref=e135]:
                  - generic [ref=e136]: $220,000–$340,000
                  - generic [ref=e137]: Median $275,000
                - cell "$180,000–$270,000 Median $220,000" [ref=e138]:
                  - generic [ref=e139]: $180,000–$270,000
                  - generic [ref=e140]: Median $220,000
                - cell "$120,000–$200,000 Median $155,000" [ref=e141]:
                  - generic [ref=e142]: $120,000–$200,000
                  - generic [ref=e143]: Median $155,000
                - cell "$160,000–$260,000 Median $205,000" [ref=e144]:
                  - generic [ref=e145]: $160,000–$260,000
                  - generic [ref=e146]: Median $205,000
                - cell "$110,000–$184,000 Median $143,000" [ref=e147]:
                  - generic [ref=e148]: $110,000–$184,000
                  - generic [ref=e149]: Median $143,000
  - contentinfo [ref=e152]:
    - generic [ref=e153]:
      - generic [ref=e154]:
        - generic [ref=e155]:
          - link "BridgeWide" [ref=e156] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e160]:
            - generic [aria-hidden] [ref=e161]:
              - text: Company website
              - textbox [ref=e162]
            - paragraph [ref=e166]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e168]
            - generic [ref=e170]:
              - generic [ref=e171]:
                - textbox "Email" [ref=e172]
                - generic: Email
              - button "Send" [ref=e173] [cursor=pointer]:
                - generic [ref=e174]:
                  - generic [ref=e175]: Send
                  - generic [aria-hidden] [ref=e176]: Send
        - navigation "Footer" [ref=e180]:
          - generic [ref=e181]:
            - heading "Company" [level=2] [ref=e182]
            - list [ref=e183]:
              - listitem [ref=e184]:
                - link "About" [ref=e185] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e186]:
                - link "Regions" [ref=e187] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e188]:
                - link "Stories" [ref=e189] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e190]:
                - link "Insights" [ref=e191] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e192]:
            - heading "Staffing" [level=2] [ref=e193]
            - list [ref=e194]:
              - listitem [ref=e195]:
                - link "Hire engineers" [ref=e196] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e197]:
                - link "How hiring works" [ref=e198] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e199]:
                - link "Salary guide" [ref=e200] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e201]:
                - link "Open roles" [ref=e202] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e203]:
            - heading "AI training" [level=2] [ref=e204]
            - list [ref=e205]:
              - listitem [ref=e206]:
                - link "Overview" [ref=e207] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e208]:
                - link "For candidates" [ref=e209] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e210]:
                - link "For partners" [ref=e211] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e212]:
                - link "Jobs" [ref=e213] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e214]:
            - heading "The desk" [level=2] [ref=e215]
            - list [ref=e216]:
              - listitem [ref=e217]:
                - link "michael.allen@bridgewide.org" [ref=e218] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e219]:
                - link "+1 (442) 567-1328" [ref=e220] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e223] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e226]:
                  - text: Open
                  - generic [ref=e227]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e228]:
                - link "Send a CV" [ref=e229] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e230]:
        - generic [ref=e231]: © 2026 BridgeWide
        - generic [ref=e232]: San Francisco · remote desks in five regions
        - generic [ref=e233]:
          - link "Privacy" [ref=e234] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e235] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e241] [cursor=pointer]
  - alert [ref=e245]
```

# Test source

```ts
  1  | import AxeBuilder from "@axe-core/playwright";
  2  | import { expect, test } from "@playwright/test";
  3  | 
  4  | // Pages a visitor reaches first. The browser job runs this on a desktop and a
  5  | // narrow viewport. A serious or critical violation fails the job and names the
  6  | // rule, the page, and each element, with the two colours and the ratio for a
  7  | // contrast failure.
  8  | const routes = [
  9  |   "/",
  10 |   "/contact",
  11 |   "/ai-training/contact",
  12 |   "/roles",
  13 |   "/employers",
  14 |   "/engineers",
  15 |   "/salary-guide",
  16 |   "/regions/usa",
  17 |   "/privacy",
  18 |   "/terms",
  19 |   "/this-page-does-not-exist",
  20 | ];
  21 | 
  22 | const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
  23 | 
  24 | test.beforeEach(async ({ page }) => {
  25 |   // Motion that fades content in would hide it from the scan, so ask for none.
  26 |   await page.emulateMedia({ reducedMotion: "reduce" });
  27 | });
  28 | 
  29 | for (const route of routes) {
  30 |   test(`axe finds no serious problem on ${route}`, async ({ page }) => {
  31 |     await page.goto(route);
> 32 |     await page.waitForLoadState("networkidle");
     |                ^ Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
  33 | 
  34 |     const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  35 | 
  36 |     const serious = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  37 |     const report = serious.map((violation) => {
  38 |       const nodes = violation.nodes.slice(0, 12).map((node) => {
  39 |         const data = (node.any[0]?.data ?? {}) as { fgColor?: string; bgColor?: string; contrastRatio?: number };
  40 |         const colours = data.fgColor ? ` [${data.fgColor} on ${data.bgColor}, ${data.contrastRatio}:1]` : "";
  41 |         return `  ${node.target.join(" ")}${colours}`;
  42 |       });
  43 |       return `${violation.id} (${violation.impact}), ${violation.nodes.length} element(s): ${violation.help}\n${nodes.join("\n")}`;
  44 |     });
  45 |     expect(report, `accessibility violations on ${route}:\n${report.join("\n")}`).toEqual([]);
  46 |   });
  47 | }
  48 | 
```