# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> axe finds no serious problem on /terms
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
      - paragraph [ref=e39]: Terms
      - heading "Fees and the replacement search." [level=1] [ref=e40]
      - paragraph [ref=e42]: A signed search agreement is the document that applies. These terms restate the fees published on the site. A lawyer reviews them before they are indexed.
    - region "What a search costs" [ref=e43]:
      - generic [ref=e44]:
        - generic [ref=e45]:
          - paragraph [ref=e46]: Fees
          - heading "What a search costs" [level=2] [ref=e47]
        - generic [ref=e49]:
          - paragraph [ref=e50]: 20% of first-year base salary for a permanent hire, billed when the engineer starts.
          - paragraph [ref=e51]: An 18% margin on the agreed contract rate.
          - paragraph [ref=e52]: A 12-week replacement guarantee. If a permanent hire leaves inside that window, we reopen the search once at no extra fee. The clock starts on the engineer's start date. The reopen is once, and it covers a permanent hire. It does not cover a contract seat, a resignation the agreement excludes, or a termination the agreement treats as outside the guarantee. The signed agreement wins if it differs from this page.
          - paragraph [ref=e53]: AI-training candidates are paid by the platform. BridgeWide does not take a cut of those earnings and does not pay the candidate. A profile is introduced only after the candidate agrees.
    - region "Who we work for" [ref=e54]:
      - generic [ref=e55]:
        - generic [ref=e56]:
          - paragraph [ref=e57]: Terms
          - heading "Who we work for" [level=2] [ref=e58]
        - paragraph [ref=e61]: BridgeWide is a recruitment agency. For permanent and contract searches we act for the hiring company, and the company pays our fee. We do not charge candidates for finding them a role, for presenting their profile, or for anything else.
    - region "Equal opportunity" [ref=e62]:
      - generic [ref=e63]:
        - generic [ref=e64]:
          - paragraph [ref=e65]: Terms
          - heading "Equal opportunity" [level=2] [ref=e66]
        - paragraph [ref=e69]: We consider every candidate on skills and experience. We do not discriminate because of race, color, religion, sex, sexual orientation, gender identity, national origin, age, disability, or any other status the law protects where the role is, and we do not pass on a client brief that asks us to.
    - region "Asking for an accommodation" [ref=e70]:
      - generic [ref=e71]:
        - generic [ref=e72]:
          - paragraph [ref=e73]: Terms
          - heading "Asking for an accommodation" [level=2] [ref=e74]
        - paragraph [ref=e77]: If you need an accommodation in how you apply or interview, such as a different format, more time, or an accessible document, write to michael.allen@bridgewide.org and say what would help. A person will reply.
    - region "AI-training work" [ref=e78]:
      - generic [ref=e79]:
        - generic [ref=e80]:
          - paragraph [ref=e81]: Terms
          - heading "AI-training work" [level=2] [ref=e82]
        - paragraph [ref=e85]: For AI-training work, BridgeWide introduces candidates to specialist platforms. The platform decides whether to accept you, sets the pay and the terms, and pays you. BridgeWide does not pay you and does not take a share of what the platform pays you. Your profile goes to a platform only after you agree to that introduction.
  - contentinfo [ref=e88]:
    - generic [ref=e89]:
      - generic [ref=e90]:
        - generic [ref=e91]:
          - link "BridgeWide" [ref=e92] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e96]:
            - generic [aria-hidden] [ref=e97]:
              - text: Company website
              - textbox [ref=e98]
            - paragraph [ref=e102]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e104]
            - generic [ref=e106]:
              - generic [ref=e107]:
                - textbox "Email" [ref=e108]
                - generic: Email
              - button "Send" [ref=e109] [cursor=pointer]:
                - generic [ref=e110]:
                  - generic [ref=e111]: Send
                  - generic [aria-hidden] [ref=e112]: Send
        - navigation "Footer" [ref=e116]:
          - generic [ref=e117]:
            - heading "Company" [level=2] [ref=e118]
            - list [ref=e119]:
              - listitem [ref=e120]:
                - link "About" [ref=e121] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e122]:
                - link "Regions" [ref=e123] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e124]:
                - link "Stories" [ref=e125] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e126]:
                - link "Insights" [ref=e127] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e128]:
            - heading "Staffing" [level=2] [ref=e129]
            - list [ref=e130]:
              - listitem [ref=e131]:
                - link "Hire engineers" [ref=e132] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e133]:
                - link "How hiring works" [ref=e134] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e135]:
                - link "Salary guide" [ref=e136] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e137]:
                - link "Open roles" [ref=e138] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e139]:
            - heading "AI training" [level=2] [ref=e140]
            - list [ref=e141]:
              - listitem [ref=e142]:
                - link "Overview" [ref=e143] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e144]:
                - link "For candidates" [ref=e145] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e146]:
                - link "For partners" [ref=e147] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e148]:
                - link "Jobs" [ref=e149] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e150]:
            - heading "The desk" [level=2] [ref=e151]
            - list [ref=e152]:
              - listitem [ref=e153]:
                - link "michael.allen@bridgewide.org" [ref=e154] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e155]:
                - link "+1 (442) 567-1328" [ref=e156] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e159] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e162]:
                  - text: Open
                  - generic [ref=e163]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e164]:
                - link "Send a CV" [ref=e165] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e166]:
        - generic [ref=e167]: © 2026 BridgeWide
        - generic [ref=e168]: San Francisco · remote desks in five regions
        - generic [ref=e169]:
          - link "Privacy" [ref=e170] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e171] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e177] [cursor=pointer]
  - alert [ref=e181]
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