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
    - generic [ref=e37]:
      - generic [ref=e38]:
        - paragraph [ref=e39]: Engineers
        - heading "Your name stays with us until the brief is real." [level=1] [ref=e40]
        - paragraph [ref=e42]: BridgeWide places software engineers for companies. The path for candidates is free, and an introduction only happens after you know the band and the manager.
        - generic [ref=e43]:
          - link "Send a CV" [ref=e44] [cursor=pointer]:
            - /url: "#cv"
            - generic [ref=e45]:
              - generic [ref=e46]: Send a CV
              - generic [aria-hidden] [ref=e47]: Send a CV
          - link "See open roles" [ref=e51] [cursor=pointer]:
            - /url: /roles
            - generic [ref=e52]:
              - generic [ref=e53]: See open roles
              - generic [aria-hidden] [ref=e54]: See open roles
      - img "Photograph for engineers looking for a role" [ref=e59]
    - region "Free, then confidential, then a conversation." [ref=e60]:
      - generic [ref=e61]:
        - generic [ref=e62]:
          - paragraph [ref=e63]: The path
          - heading "Free, then confidential, then a conversation." [level=2] [ref=e64]
        - list [ref=e66]:
          - listitem [ref=e67]:
            - paragraph [ref=e68]: "01"
            - heading "Free" [level=3] [ref=e69]
            - paragraph [ref=e70]: Companies pay BridgeWide. Engineers do not pay a fee to be introduced, interviewed, or hired.
          - listitem [ref=e71]:
            - paragraph [ref=e72]: "02"
            - heading "Confidential" [level=3] [ref=e73]
            - paragraph [ref=e74]: Your consultant tells you the band, the city or remote setup, and the hiring manager before your name goes across. A company can keep its own name inside a small group until that first conversation.
          - listitem [ref=e75]:
            - paragraph [ref=e76]: "03"
            - heading "A CV, then a conversation" [level=3] [ref=e77]
            - paragraph [ref=e78]: Send a CV and the region you want. If a role is live, you hear the brief before anyone at the company sees your name.
    - region "Send a CV" [ref=e79]:
      - generic [ref=e80]:
        - generic [ref=e81]:
          - paragraph [ref=e82]: CV
          - heading "Send a CV" [level=2] [ref=e83]
          - generic [ref=e84]: PDF, DOC, or DOCX. Tell us which of the five regions you want to work in.
        - form "Send a CV" [ref=e86]:
          - generic [aria-hidden] [ref=e87]:
            - text: Company website
            - textbox [ref=e88]
          - generic [ref=e92]:
            - generic [ref=e93]: Name
            - textbox "Name" [ref=e94]
          - generic [ref=e95]:
            - generic [ref=e96]: Email
            - textbox "Email" [ref=e97]
          - generic [ref=e98]:
            - generic [ref=e99]: This is for
            - combobox "This is for" [ref=e100]:
              - option "Staffing roles" [selected]
              - option "AI training"
            - paragraph [ref=e101]: Staffing places you with a company. AI training matches you to platforms that pay for model work.
          - generic [ref=e102]:
            - generic [ref=e103]: Region
            - combobox "Region" [ref=e104]:
              - option "Choose a region" [selected]
              - option "United States"
              - option "Canada"
              - option "Latin America"
              - option "Europe"
              - option "Asia"
          - generic [ref=e105]:
            - generic [ref=e106]: Right to work in this region
            - combobox "Right to work in this region" [ref=e107]:
              - option "Choose one" [selected]
              - option "Yes, I can work there"
              - option "Needs sponsorship"
          - generic [ref=e108]:
            - checkbox "I understand my profile is shared with a platform only after I agree to that introduction." [ref=e109]
            - text: I understand my profile is shared with a platform only after I agree to that introduction.
          - generic [ref=e110]:
            - generic [ref=e111]: CV
            - button "CV" [ref=e112]
            - paragraph [ref=e113]: PDF, DOC, or DOCX. 5 MB maximum.
          - button "Send CV" [ref=e114] [cursor=pointer]:
            - generic [ref=e115]:
              - generic [ref=e116]: Send CV
              - generic [aria-hidden] [ref=e117]: Send CV
  - contentinfo [ref=e123]:
    - generic [ref=e124]:
      - generic [ref=e125]:
        - generic [ref=e126]:
          - link "BridgeWide" [ref=e127] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e131]:
            - generic [aria-hidden] [ref=e132]:
              - text: Company website
              - textbox [ref=e133]
            - paragraph [ref=e137]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e139]
            - generic [ref=e141]:
              - generic [ref=e142]:
                - textbox "Email" [ref=e143]
                - generic: Email
              - button "Send" [ref=e144] [cursor=pointer]:
                - generic [ref=e145]:
                  - generic [ref=e146]: Send
                  - generic [aria-hidden] [ref=e147]: Send
        - navigation "Footer" [ref=e151]:
          - generic [ref=e152]:
            - heading "Company" [level=2] [ref=e153]
            - list [ref=e154]:
              - listitem [ref=e155]:
                - link "About" [ref=e156] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e157]:
                - link "Regions" [ref=e158] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e159]:
                - link "Stories" [ref=e160] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e161]:
                - link "Insights" [ref=e162] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e163]:
            - heading "Staffing" [level=2] [ref=e164]
            - list [ref=e165]:
              - listitem [ref=e166]:
                - link "Hire engineers" [ref=e167] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e168]:
                - link "How hiring works" [ref=e169] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e170]:
                - link "Salary guide" [ref=e171] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e172]:
                - link "Open roles" [ref=e173] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e174]:
            - heading "AI training" [level=2] [ref=e175]
            - list [ref=e176]:
              - listitem [ref=e177]:
                - link "Overview" [ref=e178] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e179]:
                - link "For candidates" [ref=e180] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e181]:
                - link "For partners" [ref=e182] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e183]:
                - link "Jobs" [ref=e184] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e185]:
            - heading "The desk" [level=2] [ref=e186]
            - list [ref=e187]:
              - listitem [ref=e188]:
                - link "michael.allen@bridgewide.org" [ref=e189] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e190]:
                - link "+1 (442) 567-1328" [ref=e191] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e194] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e197]:
                  - text: Open
                  - generic [ref=e198]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e199]:
                - link "Send a CV" [ref=e200] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e201]:
        - generic [ref=e202]: © 2026 BridgeWide
        - generic [ref=e203]: San Francisco · remote desks in five regions
        - generic [ref=e204]:
          - link "Privacy" [ref=e205] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e206] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e212] [cursor=pointer]
  - alert [ref=e216]
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