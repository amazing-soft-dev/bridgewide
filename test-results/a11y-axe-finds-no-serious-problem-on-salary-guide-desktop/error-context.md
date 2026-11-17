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
      - generic [aria-hidden] [ref=e6]: ·
      - link "Salary guide →" [ref=e7] [cursor=pointer]:
        - /url: /salary-guide
    - generic [ref=e9]:
      - link "BridgeWide" [ref=e10] [cursor=pointer]:
        - /url: /
      - navigation "Primary" [ref=e14]:
        - link "Employers" [ref=e15] [cursor=pointer]:
          - /url: /employers
        - link "AI training" [ref=e16] [cursor=pointer]:
          - /url: /ai-training
        - link "Regions" [ref=e17] [cursor=pointer]:
          - /url: /regions
        - link "Roles" [ref=e18] [cursor=pointer]:
          - /url: /roles
        - link "Salary guide" [ref=e19] [cursor=pointer]:
          - /url: /salary-guide
        - link "Insights" [ref=e20] [cursor=pointer]:
          - /url: /insights
        - link "About" [ref=e21] [cursor=pointer]:
          - /url: /about
        - link "Contact" [ref=e22] [cursor=pointer]:
          - /url: /contact
      - generic [ref=e23]:
        - button "Search roles" [ref=e24] [cursor=pointer]
        - link "Hire engineers" [ref=e28] [cursor=pointer]:
          - /url: /employers
          - generic [ref=e29]:
            - generic [ref=e30]: Hire engineers
            - generic [aria-hidden] [ref=e31]: Hire engineers
  - main [ref=e35]:
    - generic [ref=e38]:
      - paragraph [ref=e39]: Salary guide
      - heading "Autumn 2026 edition" [level=1] [ref=e40]
      - paragraph [ref=e42]: Annual base salary in USD. Low, median, and high for each discipline, compared in the region where the engineer will be employed. Equity and local rules sit beside these bands.
    - region "Bands by region" [ref=e43]:
      - generic [ref=e44]:
        - generic [ref=e45]:
          - paragraph [ref=e46]: Bands
          - heading "Bands by region" [level=2] [ref=e47]
          - generic [ref=e48]: Use a band to set an offer conversation. A figure under the median should be said early, before a shortlist goes out.
        - region "Salary bands by discipline and region (scrolls sideways on a narrow screen)" [ref=e50]:
          - table "Autumn 2026 edition. Annual base salary in USD. Low, high, and median for every discipline in each region." [ref=e51]:
            - caption [ref=e52]: Autumn 2026 edition. Annual base salary in USD. Low, high, and median for every discipline in each region.
            - rowgroup [ref=e53]:
              - row [ref=e54]:
                - columnheader "Discipline" [ref=e55]
                - columnheader "United States" [ref=e56]
                - columnheader "Canada" [ref=e57]
                - columnheader "Latin America" [ref=e58]
                - columnheader "Europe" [ref=e59]
                - columnheader "Asia" [ref=e60]
            - rowgroup [ref=e61]:
              - row [ref=e62]:
                - rowheader "Backend" [ref=e63]
                - cell "$165,000–$245,000 Median $198,000" [ref=e64]:
                  - generic [ref=e65]: $165,000–$245,000
                  - generic [ref=e66]: Median $198,000
                - cell "$130,000–$185,000 Median $155,000" [ref=e67]:
                  - generic [ref=e68]: $130,000–$185,000
                  - generic [ref=e69]: Median $155,000
                - cell "$72,000–$128,000 Median $96,000" [ref=e70]:
                  - generic [ref=e71]: $72,000–$128,000
                  - generic [ref=e72]: Median $96,000
                - cell "$110,000–$178,000 Median $142,000" [ref=e73]:
                  - generic [ref=e74]: $110,000–$178,000
                  - generic [ref=e75]: Median $142,000
                - cell "$66,000–$118,000 Median $88,000" [ref=e76]:
                  - generic [ref=e77]: $66,000–$118,000
                  - generic [ref=e78]: Median $88,000
              - row [ref=e79]:
                - rowheader "Frontend" [ref=e80]
                - cell "$150,000–$220,000 Median $180,000" [ref=e81]:
                  - generic [ref=e82]: $150,000–$220,000
                  - generic [ref=e83]: Median $180,000
                - cell "$120,000–$175,000 Median $145,000" [ref=e84]:
                  - generic [ref=e85]: $120,000–$175,000
                  - generic [ref=e86]: Median $145,000
                - cell "$64,000–$115,000 Median $86,000" [ref=e87]:
                  - generic [ref=e88]: $64,000–$115,000
                  - generic [ref=e89]: Median $86,000
                - cell "$100,000–$165,000 Median $130,000" [ref=e90]:
                  - generic [ref=e91]: $100,000–$165,000
                  - generic [ref=e92]: Median $130,000
                - cell "$59,000–$106,000 Median $79,000" [ref=e93]:
                  - generic [ref=e94]: $59,000–$106,000
                  - generic [ref=e95]: Median $79,000
              - row [ref=e96]:
                - rowheader "Data" [ref=e97]
                - cell "$168,000–$250,000 Median $205,000" [ref=e98]:
                  - generic [ref=e99]: $168,000–$250,000
                  - generic [ref=e100]: Median $205,000
                - cell "$135,000–$195,000 Median $162,000" [ref=e101]:
                  - generic [ref=e102]: $135,000–$195,000
                  - generic [ref=e103]: Median $162,000
                - cell "$76,000–$140,000 Median $102,000" [ref=e104]:
                  - generic [ref=e105]: $76,000–$140,000
                  - generic [ref=e106]: Median $102,000
                - cell "$115,000–$185,000 Median $148,000" [ref=e107]:
                  - generic [ref=e108]: $115,000–$185,000
                  - generic [ref=e109]: Median $148,000
                - cell "$70,000–$129,000 Median $94,000" [ref=e110]:
                  - generic [ref=e111]: $70,000–$129,000
                  - generic [ref=e112]: Median $94,000
              - row [ref=e113]:
                - rowheader "Cloud" [ref=e114]
                - cell "$170,000–$260,000 Median $210,000" [ref=e115]:
                  - generic [ref=e116]: $170,000–$260,000
                  - generic [ref=e117]: Median $210,000
                - cell "$140,000–$200,000 Median $168,000" [ref=e118]:
                  - generic [ref=e119]: $140,000–$200,000
                  - generic [ref=e120]: Median $168,000
                - cell "$80,000–$145,000 Median $108,000" [ref=e121]:
                  - generic [ref=e122]: $80,000–$145,000
                  - generic [ref=e123]: Median $108,000
                - cell "$120,000–$190,000 Median $152,000" [ref=e124]:
                  - generic [ref=e125]: $120,000–$190,000
                  - generic [ref=e126]: Median $152,000
                - cell "$74,000–$133,000 Median $99,000" [ref=e127]:
                  - generic [ref=e128]: $74,000–$133,000
                  - generic [ref=e129]: Median $99,000
              - row [ref=e130]:
                - rowheader "Mobile" [ref=e131]
                - cell "$155,000–$230,000 Median $188,000" [ref=e132]:
                  - generic [ref=e133]: $155,000–$230,000
                  - generic [ref=e134]: Median $188,000
                - cell "$125,000–$180,000 Median $150,000" [ref=e135]:
                  - generic [ref=e136]: $125,000–$180,000
                  - generic [ref=e137]: Median $150,000
                - cell "$68,000–$120,000 Median $90,000" [ref=e138]:
                  - generic [ref=e139]: $68,000–$120,000
                  - generic [ref=e140]: Median $90,000
                - cell "$105,000–$170,000 Median $136,000" [ref=e141]:
                  - generic [ref=e142]: $105,000–$170,000
                  - generic [ref=e143]: Median $136,000
                - cell "$63,000–$110,000 Median $83,000" [ref=e144]:
                  - generic [ref=e145]: $63,000–$110,000
                  - generic [ref=e146]: Median $83,000
              - row [ref=e147]:
                - rowheader "Leadership" [ref=e148]
                - cell "$220,000–$340,000 Median $275,000" [ref=e149]:
                  - generic [ref=e150]: $220,000–$340,000
                  - generic [ref=e151]: Median $275,000
                - cell "$180,000–$270,000 Median $220,000" [ref=e152]:
                  - generic [ref=e153]: $180,000–$270,000
                  - generic [ref=e154]: Median $220,000
                - cell "$120,000–$200,000 Median $155,000" [ref=e155]:
                  - generic [ref=e156]: $120,000–$200,000
                  - generic [ref=e157]: Median $155,000
                - cell "$160,000–$260,000 Median $205,000" [ref=e158]:
                  - generic [ref=e159]: $160,000–$260,000
                  - generic [ref=e160]: Median $205,000
                - cell "$110,000–$184,000 Median $143,000" [ref=e161]:
                  - generic [ref=e162]: $110,000–$184,000
                  - generic [ref=e163]: Median $143,000
  - contentinfo [ref=e166]:
    - generic [ref=e167]:
      - generic [ref=e168]:
        - generic [ref=e169]:
          - link "BridgeWide" [ref=e170] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e174]:
            - generic [aria-hidden] [ref=e175]:
              - text: Company website
              - textbox [ref=e176]
            - paragraph [ref=e180]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e182]
            - generic [ref=e184]:
              - generic [ref=e185]:
                - textbox "Email" [ref=e186]
                - generic: Email
              - button "Send" [ref=e187] [cursor=pointer]:
                - generic [ref=e188]:
                  - generic [ref=e189]: Send
                  - generic [aria-hidden] [ref=e190]: Send
        - navigation "Footer" [ref=e194]:
          - generic [ref=e195]:
            - heading "Company" [level=2] [ref=e196]
            - list [ref=e197]:
              - listitem [ref=e198]:
                - link "About" [ref=e199] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e200]:
                - link "Regions" [ref=e201] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e202]:
                - link "Stories" [ref=e203] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e204]:
                - link "Insights" [ref=e205] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e206]:
            - heading "Staffing" [level=2] [ref=e207]
            - list [ref=e208]:
              - listitem [ref=e209]:
                - link "Hire engineers" [ref=e210] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e211]:
                - link "How hiring works" [ref=e212] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e213]:
                - link "Salary guide" [ref=e214] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e215]:
                - link "Open roles" [ref=e216] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e217]:
            - heading "AI training" [level=2] [ref=e218]
            - list [ref=e219]:
              - listitem [ref=e220]:
                - link "Overview" [ref=e221] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e222]:
                - link "For candidates" [ref=e223] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e224]:
                - link "For partners" [ref=e225] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e226]:
                - link "Jobs" [ref=e227] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e228]:
            - heading "The desk" [level=2] [ref=e229]
            - list [ref=e230]:
              - listitem [ref=e231]:
                - link "michael.allen@bridgewide.org" [ref=e232] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e233]:
                - link "+1 (442) 567-1328" [ref=e234] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e237] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e240]:
                  - text: Open
                  - generic [ref=e241]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e242]:
                - link "Send a CV" [ref=e243] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e244]:
        - generic [ref=e245]: © 2026 BridgeWide
        - generic [ref=e246]: San Francisco · remote desks in five regions
        - generic [ref=e247]:
          - link "Privacy" [ref=e248] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e249] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e255] [cursor=pointer]
  - alert [ref=e259]
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