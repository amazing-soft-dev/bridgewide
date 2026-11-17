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
      - link "Salary guide →" [ref=e6] [cursor=pointer]:
        - /url: /salary-guide
    - generic [ref=e8]:
      - link "BridgeWide" [ref=e9] [cursor=pointer]:
        - /url: /
      - generic [ref=e13]:
        - button "Search roles" [ref=e14] [cursor=pointer]
        - button "Menu" [ref=e18] [cursor=pointer]
  - main [ref=e21]:
    - navigation "AI training" [ref=e22]:
      - list [ref=e23]:
        - listitem [ref=e24]:
          - link "For candidates" [ref=e25] [cursor=pointer]:
            - /url: /ai-training/for-candidates
        - listitem [ref=e26]:
          - link "For partners" [ref=e27] [cursor=pointer]:
            - /url: /ai-training/for-partners
        - listitem [ref=e28]:
          - link "Jobs" [ref=e29] [cursor=pointer]:
            - /url: /ai-training/jobs
        - listitem [ref=e30]:
          - link "Platforms" [ref=e31] [cursor=pointer]:
            - /url: /ai-training/platforms
        - listitem [ref=e32]:
          - link "How it works" [ref=e33] [cursor=pointer]:
            - /url: /ai-training/how-it-works
        - listitem [ref=e34]:
          - link "FAQ" [ref=e35] [cursor=pointer]:
            - /url: /ai-training/faq
    - paragraph [ref=e36]:
      - generic [ref=e37]:
        - generic [ref=e38]: Based in your time zone? See roles for you.
        - link "United States" [ref=e39] [cursor=pointer]:
          - /url: /ai-training/usa
        - button "Dismiss" [ref=e40]
    - generic [ref=e43]:
      - paragraph [ref=e44]: Contact
      - heading "A note to the AI-training desk." [level=1] [ref=e45]
      - paragraph [ref=e47]: Candidates with a CV should use the application. Platforms and labs should use the partner form. This note is for everything else.
    - region "Send a message." [ref=e48]:
      - generic [ref=e49]:
        - generic [ref=e50]:
          - paragraph [ref=e51]: Write
          - heading "Send a message." [level=2] [ref=e52]
        - generic [ref=e53]:
          - paragraph [ref=e54]:
            - link "Apply as a candidate" [ref=e55] [cursor=pointer]:
              - /url: /ai-training/for-candidates
            - text: ·
            - link "Partner inquiry" [ref=e56] [cursor=pointer]:
              - /url: /ai-training/for-partners
            - text: ·
            - link "michael.allen@bridgewide.org" [ref=e57] [cursor=pointer]:
              - /url: mailto:michael.allen@bridgewide.org
          - form "Contact BridgeWide" [ref=e58]:
            - generic [aria-hidden] [ref=e59]:
              - text: Company website
              - textbox [ref=e60]
            - generic [ref=e65]:
              - textbox "Your name *" [ref=e66]:
                - /placeholder: " "
              - generic: Your name *
            - generic [ref=e68]:
              - textbox "Email *" [ref=e69]:
                - /placeholder: " "
              - generic: Email *
            - generic [ref=e71]:
              - combobox "Topic" [ref=e72] [cursor=pointer]:
                - option "Choose one" [selected]
                - option "Something else"
                - option "Hiring engineers"
                - option "Looking for a role"
                - option "AI training"
                - option "Press"
              - generic: Topic
            - generic [ref=e74]:
              - textbox "Message *" [ref=e75]:
                - /placeholder: " "
              - generic: Message *
            - generic [ref=e76]:
              - paragraph [ref=e77]: We only use these details to answer you.
              - button "Send message" [ref=e78] [cursor=pointer]:
                - generic [ref=e79]:
                  - generic [ref=e80]: Send message
                  - generic [aria-hidden] [ref=e81]: Send message
  - contentinfo [ref=e87]:
    - generic [ref=e88]:
      - generic [ref=e89]:
        - generic [ref=e90]:
          - link "BridgeWide" [ref=e91] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e95]:
            - generic [aria-hidden] [ref=e96]:
              - text: Company website
              - textbox [ref=e97]
            - paragraph [ref=e101]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e103]
            - generic [ref=e105]:
              - generic [ref=e106]:
                - textbox "Email" [ref=e107]
                - generic: Email
              - button "Send" [ref=e108] [cursor=pointer]:
                - generic [ref=e109]:
                  - generic [ref=e110]: Send
                  - generic [aria-hidden] [ref=e111]: Send
        - navigation "Footer" [ref=e115]:
          - generic [ref=e116]:
            - heading "Company" [level=2] [ref=e117]
            - list [ref=e118]:
              - listitem [ref=e119]:
                - link "About" [ref=e120] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e121]:
                - link "Regions" [ref=e122] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e123]:
                - link "Stories" [ref=e124] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e125]:
                - link "Insights" [ref=e126] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e127]:
            - heading "Staffing" [level=2] [ref=e128]
            - list [ref=e129]:
              - listitem [ref=e130]:
                - link "Hire engineers" [ref=e131] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e132]:
                - link "How hiring works" [ref=e133] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e134]:
                - link "Salary guide" [ref=e135] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e136]:
                - link "Open roles" [ref=e137] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e138]:
            - heading "AI training" [level=2] [ref=e139]
            - list [ref=e140]:
              - listitem [ref=e141]:
                - link "Overview" [ref=e142] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e143]:
                - link "For candidates" [ref=e144] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e145]:
                - link "For partners" [ref=e146] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e147]:
                - link "Jobs" [ref=e148] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e149]:
            - heading "The desk" [level=2] [ref=e150]
            - list [ref=e151]:
              - listitem [ref=e152]:
                - link "michael.allen@bridgewide.org" [ref=e153] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e154]:
                - link "+1 (442) 567-1328" [ref=e155] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e158] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e161]:
                  - text: Open
                  - generic [ref=e162]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e163]:
                - link "Send a CV" [ref=e164] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e165]:
        - generic [ref=e166]: © 2026 BridgeWide
        - generic [ref=e167]: San Francisco · remote desks in five regions
        - generic [ref=e168]:
          - link "Privacy" [ref=e169] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e170] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e176] [cursor=pointer]
  - alert [ref=e180]
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