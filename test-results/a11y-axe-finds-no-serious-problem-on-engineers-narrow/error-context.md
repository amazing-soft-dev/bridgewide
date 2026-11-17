# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> axe finds no serious problem on /engineers
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
        - paragraph [ref=e25]: Engineers
        - heading "Your name stays with us until the brief is real." [level=1] [ref=e26]
        - paragraph [ref=e28]: BridgeWide places software engineers for companies. The path for candidates is free, and an introduction only happens after you know the band and the manager.
        - generic [ref=e29]:
          - link "Send a CV" [ref=e30] [cursor=pointer]:
            - /url: "#cv"
            - generic [ref=e31]:
              - generic [ref=e32]: Send a CV
              - generic [aria-hidden] [ref=e33]: Send a CV
          - link "See open roles" [ref=e37] [cursor=pointer]:
            - /url: /roles
            - generic [ref=e38]:
              - generic [ref=e39]: See open roles
              - generic [aria-hidden] [ref=e40]: See open roles
      - img "Photograph for engineers looking for a role" [ref=e45]
    - region "Free, then confidential, then a conversation." [ref=e46]:
      - generic [ref=e47]:
        - generic [ref=e48]:
          - paragraph [ref=e49]: The path
          - heading "Free, then confidential, then a conversation." [level=2] [ref=e50]
        - list [ref=e52]:
          - listitem [ref=e53]:
            - paragraph [ref=e54]: "01"
            - heading "Free" [level=3] [ref=e55]
            - paragraph [ref=e56]: Companies pay BridgeWide. Engineers do not pay a fee to be introduced, interviewed, or hired.
          - listitem [ref=e57]:
            - paragraph [ref=e58]: "02"
            - heading "Confidential" [level=3] [ref=e59]
            - paragraph [ref=e60]: Your consultant tells you the band, the city or remote setup, and the hiring manager before your name goes across. A company can keep its own name inside a small group until that first conversation.
          - listitem [ref=e61]:
            - paragraph [ref=e62]: "03"
            - heading "A CV, then a conversation" [level=3] [ref=e63]
            - paragraph [ref=e64]: Send a CV and the region you want. If a role is live, you hear the brief before anyone at the company sees your name.
    - region "Send a CV" [ref=e65]:
      - generic [ref=e66]:
        - generic [ref=e67]:
          - paragraph [ref=e68]: CV
          - heading "Send a CV" [level=2] [ref=e69]
          - generic [ref=e70]: PDF, DOC, or DOCX. Tell us which of the five regions you want to work in.
        - form "Send a CV" [ref=e72]:
          - generic [aria-hidden] [ref=e73]:
            - text: Company website
            - textbox [ref=e74]
          - generic [ref=e75]:
            - generic [ref=e76]: Name
            - textbox "Name" [ref=e77]
          - generic [ref=e78]:
            - generic [ref=e79]: Email
            - textbox "Email" [ref=e80]
          - generic [ref=e81]:
            - generic [ref=e82]: This is for
            - combobox "This is for" [ref=e83]:
              - option "Staffing roles" [selected]
              - option "AI training"
            - paragraph [ref=e84]: Staffing places you with a company. AI training matches you to platforms that pay for model work.
          - generic [ref=e85]:
            - generic [ref=e86]: Region
            - combobox "Region" [ref=e87]:
              - option "Choose a region" [selected]
              - option "United States"
              - option "Canada"
              - option "Latin America"
              - option "Europe"
              - option "Asia"
          - generic [ref=e88]:
            - generic [ref=e89]: Right to work in this region
            - combobox "Right to work in this region" [ref=e90]:
              - option "Choose one" [selected]
              - option "Yes, I can work there"
              - option "Needs sponsorship"
          - generic [ref=e91]:
            - checkbox "I understand my profile is shared with a platform only after I agree to that introduction." [ref=e92]
            - text: I understand my profile is shared with a platform only after I agree to that introduction.
          - generic [ref=e93]:
            - generic [ref=e94]: CV
            - button "CV" [ref=e95]
            - paragraph [ref=e96]: PDF, DOC, or DOCX. 5 MB maximum.
          - button "Send CV" [ref=e97] [cursor=pointer]:
            - generic [ref=e98]:
              - generic [ref=e99]: Send CV
              - generic [aria-hidden] [ref=e100]: Send CV
  - contentinfo [ref=e106]:
    - generic [ref=e107]:
      - generic [ref=e108]:
        - generic [ref=e109]:
          - link "BridgeWide" [ref=e110] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e114]:
            - generic [aria-hidden] [ref=e115]:
              - text: Company website
              - textbox [ref=e116]
            - paragraph [ref=e117]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e119]
            - generic [ref=e121]:
              - generic [ref=e122]:
                - textbox "Email" [ref=e123]
                - generic: Email
              - button "Send" [ref=e124] [cursor=pointer]:
                - generic [ref=e125]:
                  - generic [ref=e126]: Send
                  - generic [aria-hidden] [ref=e127]: Send
        - navigation "Footer" [ref=e131]:
          - generic [ref=e132]:
            - heading "Company" [level=2] [ref=e133]
            - list [ref=e134]:
              - listitem [ref=e135]:
                - link "About" [ref=e136] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e137]:
                - link "Regions" [ref=e138] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e139]:
                - link "Stories" [ref=e140] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e141]:
                - link "Insights" [ref=e142] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e143]:
            - heading "Staffing" [level=2] [ref=e144]
            - list [ref=e145]:
              - listitem [ref=e146]:
                - link "Hire engineers" [ref=e147] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e148]:
                - link "How hiring works" [ref=e149] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e150]:
                - link "Salary guide" [ref=e151] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e152]:
                - link "Open roles" [ref=e153] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e154]:
            - heading "AI training" [level=2] [ref=e155]
            - list [ref=e156]:
              - listitem [ref=e157]:
                - link "Overview" [ref=e158] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e159]:
                - link "For candidates" [ref=e160] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e161]:
                - link "For partners" [ref=e162] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e163]:
                - link "Jobs" [ref=e164] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e165]:
            - heading "The desk" [level=2] [ref=e166]
            - list [ref=e167]:
              - listitem [ref=e168]:
                - link "michael.allen@bridgewide.org" [ref=e169] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e170]:
                - link "+1 (442) 567-1328" [ref=e171] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e174] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e177]:
                  - text: Open
                  - generic [ref=e178]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e179]:
                - link "Send a CV" [ref=e180] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e181]:
        - generic [ref=e182]: © 2026 BridgeWide
        - generic [ref=e183]: San Francisco · remote desks in five regions
        - generic [ref=e184]:
          - link "Privacy" [ref=e185] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e186] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e192] [cursor=pointer]
  - alert [ref=e196]
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