# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> axe finds no serious problem on /terms
- Location: e2e\a11y.spec.ts:30:3

# Error details

```
Error: browserContext.newPage: Target crashed 
 Please check out https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/error-handling.md
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
      - paragraph [ref=e25]: Terms
      - heading "Fees and the replacement search." [level=1] [ref=e26]
      - paragraph [ref=e28]: A signed search agreement is the document that applies. These terms restate the fees published on the site. A lawyer reviews them before they are indexed.
    - region "What a search costs" [ref=e29]:
      - generic [ref=e30]:
        - generic [ref=e31]:
          - paragraph [ref=e32]: Fees
          - heading "What a search costs" [level=2] [ref=e33]
        - generic [ref=e35]:
          - paragraph [ref=e36]: 20% of first-year base salary for a permanent hire, billed when the engineer starts.
          - paragraph [ref=e37]: An 18% margin on the agreed contract rate.
          - paragraph [ref=e38]: A 12-week replacement guarantee. If a permanent hire leaves inside that window, we reopen the search once at no extra fee. The clock starts on the engineer's start date. The reopen is once, and it covers a permanent hire. It does not cover a contract seat, a resignation the agreement excludes, or a termination the agreement treats as outside the guarantee. The signed agreement wins if it differs from this page.
          - paragraph [ref=e39]: AI-training candidates are paid by the platform. BridgeWide does not take a cut of those earnings and does not pay the candidate. A profile is introduced only after the candidate agrees.
    - region "Who we work for" [ref=e40]:
      - generic [ref=e41]:
        - generic [ref=e42]:
          - paragraph [ref=e43]: Terms
          - heading "Who we work for" [level=2] [ref=e44]
        - paragraph [ref=e47]: BridgeWide is a recruitment agency. For permanent and contract searches we act for the hiring company, and the company pays our fee. We do not charge candidates for finding them a role, for presenting their profile, or for anything else.
    - region "Equal opportunity" [ref=e48]:
      - generic [ref=e49]:
        - generic [ref=e50]:
          - paragraph [ref=e51]: Terms
          - heading "Equal opportunity" [level=2] [ref=e52]
        - paragraph [ref=e55]: We consider every candidate on skills and experience. We do not discriminate because of race, color, religion, sex, sexual orientation, gender identity, national origin, age, disability, or any other status the law protects where the role is, and we do not pass on a client brief that asks us to.
    - region "Asking for an accommodation" [ref=e56]:
      - generic [ref=e57]:
        - generic [ref=e58]:
          - paragraph [ref=e59]: Terms
          - heading "Asking for an accommodation" [level=2] [ref=e60]
        - paragraph [ref=e63]: If you need an accommodation in how you apply or interview, such as a different format, more time, or an accessible document, write to michael.allen@bridgewide.org and say what would help. A person will reply.
    - region "AI-training work" [ref=e64]:
      - generic [ref=e65]:
        - generic [ref=e66]:
          - paragraph [ref=e67]: Terms
          - heading "AI-training work" [level=2] [ref=e68]
        - paragraph [ref=e71]: For AI-training work, BridgeWide introduces candidates to specialist platforms. The platform decides whether to accept you, sets the pay and the terms, and pays you. BridgeWide does not pay you and does not take a share of what the platform pays you. Your profile goes to a platform only after you agree to that introduction.
  - contentinfo [ref=e74]:
    - generic [ref=e75]:
      - generic [ref=e76]:
        - generic [ref=e77]:
          - link "BridgeWide" [ref=e78] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e82]:
            - generic [aria-hidden] [ref=e83]:
              - text: Company website
              - textbox [ref=e84]
            - paragraph [ref=e85]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e87]
            - generic [ref=e89]:
              - generic [ref=e90]:
                - textbox "Email" [ref=e91]
                - generic: Email
              - button "Send" [ref=e92] [cursor=pointer]:
                - generic [ref=e93]:
                  - generic [ref=e94]: Send
                  - generic [aria-hidden] [ref=e95]: Send
        - navigation "Footer" [ref=e99]:
          - generic [ref=e100]:
            - heading "Company" [level=2] [ref=e101]
            - list [ref=e102]:
              - listitem [ref=e103]:
                - link "About" [ref=e104] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e105]:
                - link "Regions" [ref=e106] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e107]:
                - link "Stories" [ref=e108] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e109]:
                - link "Insights" [ref=e110] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e111]:
            - heading "Staffing" [level=2] [ref=e112]
            - list [ref=e113]:
              - listitem [ref=e114]:
                - link "Hire engineers" [ref=e115] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e116]:
                - link "How hiring works" [ref=e117] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e118]:
                - link "Salary guide" [ref=e119] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e120]:
                - link "Open roles" [ref=e121] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e122]:
            - heading "AI training" [level=2] [ref=e123]
            - list [ref=e124]:
              - listitem [ref=e125]:
                - link "Overview" [ref=e126] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e127]:
                - link "For candidates" [ref=e128] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e129]:
                - link "For partners" [ref=e130] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e131]:
                - link "Jobs" [ref=e132] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e133]:
            - heading "The desk" [level=2] [ref=e134]
            - list [ref=e135]:
              - listitem [ref=e136]:
                - link "michael.allen@bridgewide.org" [ref=e137] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e138]:
                - link "+1 (442) 567-1328" [ref=e139] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e142] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e145]:
                  - text: Open
                  - generic [ref=e146]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e147]:
                - link "Send a CV" [ref=e148] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e149]:
        - generic [ref=e150]: © 2026 BridgeWide
        - generic [ref=e151]: San Francisco · remote desks in five regions
        - generic [ref=e152]:
          - link "Privacy" [ref=e153] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e154] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e160] [cursor=pointer]:
    - generic [ref=e163]:
      - text: Rendering
      - generic [ref=e164]:
        - generic [ref=e165]: .
        - generic [ref=e166]: .
        - generic [ref=e167]: .
  - alert [ref=e168]
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
  32 |     await page.waitForLoadState("networkidle");
  33 | 
> 34 |     const results = await new AxeBuilder({ page }).withTags(tags).analyze();
     |                     ^ Error: browserContext.newPage: Target crashed 
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