# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> axe finds no serious problem on /ai-training/contact
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
    - navigation "AI training" [ref=e36]:
      - list [ref=e37]:
        - listitem [ref=e38]:
          - link "For candidates" [ref=e39] [cursor=pointer]:
            - /url: /ai-training/for-candidates
        - listitem [ref=e40]:
          - link "For partners" [ref=e41] [cursor=pointer]:
            - /url: /ai-training/for-partners
        - listitem [ref=e42]:
          - link "Jobs" [ref=e43] [cursor=pointer]:
            - /url: /ai-training/jobs
        - listitem [ref=e44]:
          - link "Platforms" [ref=e45] [cursor=pointer]:
            - /url: /ai-training/platforms
        - listitem [ref=e46]:
          - link "How it works" [ref=e47] [cursor=pointer]:
            - /url: /ai-training/how-it-works
        - listitem [ref=e48]:
          - link "FAQ" [ref=e49] [cursor=pointer]:
            - /url: /ai-training/faq
    - paragraph [ref=e50]:
      - generic [ref=e51]:
        - generic [ref=e52]: Based in your time zone? See roles for you.
        - link "United States" [ref=e53] [cursor=pointer]:
          - /url: /ai-training/usa
        - button "Dismiss" [ref=e54]
    - generic [ref=e57]:
      - paragraph [ref=e58]: Contact
      - heading "A note to the AI-training desk." [level=1] [ref=e59]
      - paragraph [ref=e61]: Candidates with a CV should use the application. Platforms and labs should use the partner form. This note is for everything else.
    - region "Send a message." [ref=e62]:
      - generic [ref=e63]:
        - generic [ref=e64]:
          - paragraph [ref=e65]: Write
          - heading "Send a message." [level=2] [ref=e66]
        - generic [ref=e67]:
          - paragraph [ref=e68]:
            - link "Apply as a candidate" [ref=e69] [cursor=pointer]:
              - /url: /ai-training/for-candidates
            - text: ·
            - link "Partner inquiry" [ref=e70] [cursor=pointer]:
              - /url: /ai-training/for-partners
            - text: ·
            - link "michael.allen@bridgewide.org" [ref=e71] [cursor=pointer]:
              - /url: mailto:michael.allen@bridgewide.org
          - form "Contact BridgeWide" [ref=e72]:
            - generic [aria-hidden] [ref=e73]:
              - text: Company website
              - textbox [ref=e74]
            - generic [ref=e79]:
              - textbox "Your name *" [ref=e80]:
                - /placeholder: " "
              - generic: Your name *
            - generic [ref=e82]:
              - textbox "Email *" [ref=e83]:
                - /placeholder: " "
              - generic: Email *
            - generic [ref=e85]:
              - combobox "Topic" [ref=e86] [cursor=pointer]:
                - option "Choose one" [selected]
                - option "Something else"
                - option "Hiring engineers"
                - option "Looking for a role"
                - option "AI training"
                - option "Press"
              - generic: Topic
            - generic [ref=e88]:
              - textbox "Message *" [ref=e89]:
                - /placeholder: " "
              - generic: Message *
            - generic [ref=e90]:
              - paragraph [ref=e91]: We only use these details to answer you.
              - button "Send message" [ref=e92] [cursor=pointer]:
                - generic [ref=e93]:
                  - generic [ref=e94]: Send message
                  - generic [aria-hidden] [ref=e95]: Send message
  - contentinfo [ref=e101]:
    - generic [ref=e102]:
      - generic [ref=e103]:
        - generic [ref=e104]:
          - link "BridgeWide" [ref=e105] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e109]:
            - generic [aria-hidden] [ref=e110]:
              - text: Company website
              - textbox [ref=e111]
            - paragraph [ref=e112]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e114]
            - generic [ref=e116]:
              - generic [ref=e117]:
                - textbox "Email" [ref=e118]
                - generic: Email
              - button "Send" [ref=e119] [cursor=pointer]:
                - generic [ref=e120]:
                  - generic [ref=e121]: Send
                  - generic [aria-hidden] [ref=e122]: Send
        - navigation "Footer" [ref=e126]:
          - generic [ref=e127]:
            - heading "Company" [level=2] [ref=e128]
            - list [ref=e129]:
              - listitem [ref=e130]:
                - link "About" [ref=e131] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e132]:
                - link "Regions" [ref=e133] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e134]:
                - link "Stories" [ref=e135] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e136]:
                - link "Insights" [ref=e137] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e138]:
            - heading "Staffing" [level=2] [ref=e139]
            - list [ref=e140]:
              - listitem [ref=e141]:
                - link "Hire engineers" [ref=e142] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e143]:
                - link "How hiring works" [ref=e144] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e145]:
                - link "Salary guide" [ref=e146] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e147]:
                - link "Open roles" [ref=e148] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e149]:
            - heading "AI training" [level=2] [ref=e150]
            - list [ref=e151]:
              - listitem [ref=e152]:
                - link "Overview" [ref=e153] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e154]:
                - link "For candidates" [ref=e155] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e156]:
                - link "For partners" [ref=e157] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e158]:
                - link "Jobs" [ref=e159] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e160]:
            - heading "The desk" [level=2] [ref=e161]
            - list [ref=e162]:
              - listitem [ref=e163]:
                - link "michael.allen@bridgewide.org" [ref=e164] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e165]:
                - link "+1 (442) 567-1328" [ref=e166] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e169] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e172]:
                  - text: Open
                  - generic [ref=e173]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e174]:
                - link "Send a CV" [ref=e175] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e176]:
        - generic [ref=e177]: © 2026 BridgeWide
        - generic [ref=e178]: San Francisco · remote desks in five regions
        - generic [ref=e179]:
          - link "Privacy" [ref=e180] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e181] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e187] [cursor=pointer]
  - alert [ref=e191]
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