# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> axe finds no serious problem on /regions/usa
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
    - generic [ref=e23]:
      - generic [ref=e24]:
        - paragraph [ref=e25]: USA
        - heading "United States" [level=1] [ref=e26]
        - paragraph [ref=e28]: Hybrid seats in San Francisco, New York, Austin, and other US hubs, sourced against your stack and your bar. This desk is the default when the hiring manager and the team sit in the same city most weeks.
        - generic [ref=e29]: 3 open roles
      - img "Photograph for the United States desk" [ref=e32]
    - region "Open roles" [ref=e33]:
      - generic [ref=e34]:
        - generic [ref=e35]:
          - paragraph [ref=e36]: Seats
          - heading "Open roles" [level=2] [ref=e37]
        - generic [ref=e38]:
          - list [ref=e39]:
            - listitem [ref=e40]:
              - link "ENG Staff Backend Engineer A staff backend seat for a San Francisco payments team that needs one owner for a ledger service. The engineer should have shipped Go or Java in production and be ready to review design with the people already on the team. $210k" [ref=e41] [cursor=pointer]:
                - /url: /roles/staff-backend-engineer-san-francisco
                - generic [ref=e42]: ENG
                - generic [ref=e43]:
                  - heading "Staff Backend Engineer" [level=3] [ref=e44]
                  - generic [ref=e45]: A staff backend seat for a San Francisco payments team that needs one owner for a ledger service. The engineer should have shipped Go or Java in production and be ready to review design with the people already on the team.
                - generic [ref=e46]: $210k
            - listitem [ref=e47]:
              - link "ENG Senior Frontend Engineer Hybrid frontend seat in Austin on a product surface that operations staff use all day. We are shortlisting senior engineers who have owned a design system and can work beside an existing React team. $165k" [ref=e48] [cursor=pointer]:
                - /url: /roles/senior-frontend-engineer-austin
                - generic [ref=e49]: ENG
                - generic [ref=e50]:
                  - heading "Senior Frontend Engineer" [level=3] [ref=e51]
                  - generic [ref=e52]: Hybrid frontend seat in Austin on a product surface that operations staff use all day. We are shortlisting senior engineers who have owned a design system and can work beside an existing React team.
                - generic [ref=e53]: $165k
            - listitem [ref=e54]:
              - link "MGT Engineering Manager A manager seat in New York for a group of eight product engineers and a roadmap the company has already shared internally. The search is for a manager who has run a team of engineers and who will hire into that team after they start. $240k" [ref=e55] [cursor=pointer]:
                - /url: /roles/engineering-manager-new-york
                - generic [ref=e56]: MGT
                - generic [ref=e57]:
                  - heading "Engineering Manager" [level=3] [ref=e58]
                  - generic [ref=e59]: A manager seat in New York for a group of eight product engineers and a roadmap the company has already shared internally. The search is for a manager who has run a team of engineers and who will hire into that team after they start.
                - generic [ref=e60]: $240k
          - paragraph [ref=e61]:
            - link "All regions" [ref=e62] [cursor=pointer]:
              - /url: /regions
  - contentinfo [ref=e65]:
    - generic [ref=e66]:
      - generic [ref=e67]:
        - generic [ref=e68]:
          - link "BridgeWide" [ref=e69] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e73]:
            - generic [aria-hidden] [ref=e74]:
              - text: Company website
              - textbox [ref=e75]
            - paragraph [ref=e79]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e81]
            - generic [ref=e83]:
              - generic [ref=e84]:
                - textbox "Email" [ref=e85]
                - generic: Email
              - button "Send" [ref=e86] [cursor=pointer]:
                - generic [ref=e87]:
                  - generic [ref=e88]: Send
                  - generic [aria-hidden] [ref=e89]: Send
        - navigation "Footer" [ref=e93]:
          - generic [ref=e94]:
            - heading "Company" [level=2] [ref=e95]
            - list [ref=e96]:
              - listitem [ref=e97]:
                - link "About" [ref=e98] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e99]:
                - link "Regions" [ref=e100] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e101]:
                - link "Stories" [ref=e102] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e103]:
                - link "Insights" [ref=e104] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e105]:
            - heading "Staffing" [level=2] [ref=e106]
            - list [ref=e107]:
              - listitem [ref=e108]:
                - link "Hire engineers" [ref=e109] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e110]:
                - link "How hiring works" [ref=e111] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e112]:
                - link "Salary guide" [ref=e113] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e114]:
                - link "Open roles" [ref=e115] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e116]:
            - heading "AI training" [level=2] [ref=e117]
            - list [ref=e118]:
              - listitem [ref=e119]:
                - link "Overview" [ref=e120] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e121]:
                - link "For candidates" [ref=e122] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e123]:
                - link "For partners" [ref=e124] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e125]:
                - link "Jobs" [ref=e126] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e127]:
            - heading "The desk" [level=2] [ref=e128]
            - list [ref=e129]:
              - listitem [ref=e130]:
                - link "michael.allen@bridgewide.org" [ref=e131] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e132]:
                - link "+1 (442) 567-1328" [ref=e133] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e136] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e139]:
                  - text: Open
                  - generic [ref=e140]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e141]:
                - link "Send a CV" [ref=e142] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e143]:
        - generic [ref=e144]: © 2026 BridgeWide
        - generic [ref=e145]: San Francisco · remote desks in five regions
        - generic [ref=e146]:
          - link "Privacy" [ref=e147] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e148] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e154] [cursor=pointer]
  - alert [ref=e158]
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