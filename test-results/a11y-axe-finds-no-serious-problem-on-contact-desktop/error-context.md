# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> axe finds no serious problem on /contact
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
      - navigation "Breadcrumb" [ref=e40]:
        - list [ref=e41]:
          - listitem [ref=e42]:
            - link "Home" [ref=e43] [cursor=pointer]:
              - /url: /
          - listitem [ref=e46]:
            - generic [ref=e47]: Contact
      - paragraph [ref=e48]: Contact
      - heading "Talk to the desk." [level=1] [ref=e49]:
        - generic [ref=e50]:
          - generic [ref=e51]: Talk
          - generic [ref=e52]: to
          - generic [ref=e53]: the
          - generic [ref=e54]: desk.
      - paragraph [ref=e57]: Hiring, looking, or a question about the market. A person answers, usually within two working hours.
    - region "Send us a message." [ref=e58]:
      - generic [ref=e59]:
        - generic [ref=e60]:
          - paragraph [ref=e62]:
            - generic [ref=e63]: Contact
          - heading "Send us a message." [level=2] [ref=e66]:
            - generic [ref=e67]:
              - generic [ref=e68]: Send
              - generic [ref=e69]: us
              - generic [ref=e70]: a
              - generic [ref=e71]: message.
          - paragraph [ref=e74]: Hiring, looking, or just a question about the market. A person answers.
          - generic [ref=e76]:
            - generic [ref=e77]:
              - text: The desk
              - emphasis [ref=e78]: Open now
            - link "+1 (442) 567-1328" [ref=e79] [cursor=pointer]:
              - /url: tel:+14425671328
            - link "michael.allen@bridgewide.org" [ref=e80] [cursor=pointer]:
              - /url: mailto:michael.allen@bridgewide.org
            - generic [ref=e81]: San Francisco · remote desks in five regions
            - generic [ref=e82]: Mon–Fri · 08:00–18:00 PT
        - form "Contact BridgeWide" [ref=e85]:
          - generic [aria-hidden] [ref=e86]:
            - text: Company website
            - textbox [ref=e87]
          - generic [ref=e92]:
            - textbox "Your name *" [ref=e93]:
              - /placeholder: " "
            - generic: Your name *
          - generic [ref=e95]:
            - textbox "Email *" [ref=e96]:
              - /placeholder: " "
            - generic: Email *
          - generic [ref=e98]:
            - combobox "Topic" [ref=e99] [cursor=pointer]:
              - option "Choose one" [selected]
              - option "Something else"
              - option "Hiring engineers"
              - option "Looking for a role"
              - option "AI training"
              - option "Press"
            - generic: Topic
          - generic [ref=e101]:
            - textbox "Message *" [ref=e102]:
              - /placeholder: " "
            - generic: Message *
          - generic [ref=e103]:
            - paragraph [ref=e104]: We only use these details to answer you.
            - button "Send message" [ref=e105] [cursor=pointer]:
              - generic [ref=e106]:
                - generic [ref=e107]: Send message
                - generic [aria-hidden] [ref=e108]: Send message
    - region "Keep a profile on file." [ref=e112]:
      - generic [ref=e113]:
        - generic [ref=e114]:
          - paragraph [ref=e115]: No open role
          - heading "Keep a profile on file." [level=2] [ref=e116]
        - generic [ref=e117]:
          - paragraph [ref=e118]: If a region you want has no open role, leave a CV and a short profile. The desk keeps them for 12 months.
          - form "Keep your profile" [ref=e119]:
            - generic [aria-hidden] [ref=e120]:
              - text: Company website
              - textbox [ref=e121]
            - generic [ref=e125]:
              - generic [ref=e126]: Name
              - textbox "Name" [ref=e127]
            - generic [ref=e128]:
              - generic [ref=e129]: Email
              - textbox "Email" [ref=e130]
            - generic [ref=e131]:
              - generic [ref=e132]: Region
              - combobox "Region" [ref=e133]:
                - option "Choose a region" [selected]
                - option "United States"
                - option "Canada"
                - option "Latin America"
                - option "Europe"
                - option "Asia"
            - generic [ref=e134]:
              - generic [ref=e135]: Country
              - textbox "Country" [ref=e136]
            - generic [ref=e137]:
              - generic [ref=e138]: Discipline
              - textbox "Discipline" [ref=e139]
            - generic [ref=e140]:
              - generic [ref=e141]: Years of experience
              - textbox "Years of experience" [ref=e142]
            - generic [ref=e143]:
              - generic [ref=e144]: Work mode
              - combobox "Work mode" [ref=e145]:
                - option "Choose" [selected]
                - option "Remote"
                - option "Hybrid"
            - generic [ref=e146]:
              - generic [ref=e147]: Profile
              - textbox "Profile" [ref=e148]
            - generic [ref=e149]:
              - generic [ref=e150]: CV
              - button "CV" [ref=e151]
              - paragraph [ref=e152]: PDF, DOC, or DOCX. 5 MB maximum.
            - generic [ref=e153]:
              - checkbox "Keep my CV and profile for 12 months so the desk can write if a matching role opens. I can ask for it to be deleted sooner." [ref=e154]
              - text: Keep my CV and profile for 12 months so the desk can write if a matching role opens. I can ask for it to be deleted sooner.
            - button "Keep my profile" [ref=e155] [cursor=pointer]:
              - generic [ref=e156]:
                - generic [ref=e157]: Keep my profile
                - generic [aria-hidden] [ref=e158]: Keep my profile
    - region "Quick answers." [ref=e162]:
      - generic [ref=e163]:
        - generic [ref=e164]:
          - paragraph [ref=e165]: Questions
          - heading "Quick answers." [level=2] [ref=e166]:
            - generic [ref=e167]:
              - generic [ref=e168]: Quick
              - generic [ref=e169]: answers.
        - generic [ref=e172]:
          - list [ref=e173]:
            - listitem [ref=e174]:
              - button "01 Which regions do you cover? General" [pressed] [ref=e175]:
                - generic [ref=e176]: "01"
                - generic [ref=e177]: Which regions do you cover?
                - generic [ref=e178]: General
            - listitem [ref=e180]:
              - button "02 Where are you based? General" [ref=e181]:
                - generic [ref=e182]: "02"
                - generic [ref=e183]: Where are you based?
                - generic [ref=e184]: General
            - listitem [ref=e186]:
              - button "03 When can I reach you? General" [ref=e187]:
                - generic [ref=e188]: "03"
                - generic [ref=e189]: When can I reach you?
                - generic [ref=e190]: General
          - generic [ref=e192]:
            - region "01 Which regions do you cover? General" [ref=e194]:
              - paragraph [ref=e195]: General
              - heading "Which regions do you cover?" [level=3] [ref=e196]
              - paragraph [ref=e197]: "Five: the United States, Canada, Latin America, Europe, and Asia. Each region has its own desk with a consultant who has hired in that market, and one search can draw from more than one region when you want the comparison."
            - generic [ref=e199]:
              - paragraph [ref=e200]: Still asking?
              - paragraph [ref=e201]: Call the desk or send the question. A consultant answers, not a bot.
              - paragraph [ref=e202]:
                - link "+1 (442) 567-1328" [ref=e203] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "michael.allen@bridgewide.org" [ref=e204] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
  - contentinfo [ref=e207]:
    - generic [ref=e208]:
      - generic [ref=e209]:
        - generic [ref=e210]:
          - link "BridgeWide" [ref=e211] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e215]:
            - generic [aria-hidden] [ref=e216]:
              - text: Company website
              - textbox [ref=e217]
            - paragraph [ref=e218]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e220]
            - generic [ref=e222]:
              - generic [ref=e223]:
                - textbox "Email" [ref=e224]
                - generic: Email
              - button "Send" [ref=e225] [cursor=pointer]:
                - generic [ref=e226]:
                  - generic [ref=e227]: Send
                  - generic [aria-hidden] [ref=e228]: Send
        - navigation "Footer" [ref=e232]:
          - generic [ref=e233]:
            - heading "Company" [level=2] [ref=e234]
            - list [ref=e235]:
              - listitem [ref=e236]:
                - link "About" [ref=e237] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e238]:
                - link "Regions" [ref=e239] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e240]:
                - link "Stories" [ref=e241] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e242]:
                - link "Insights" [ref=e243] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e244]:
            - heading "Staffing" [level=2] [ref=e245]
            - list [ref=e246]:
              - listitem [ref=e247]:
                - link "Hire engineers" [ref=e248] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e249]:
                - link "How hiring works" [ref=e250] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e251]:
                - link "Salary guide" [ref=e252] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e253]:
                - link "Open roles" [ref=e254] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e255]:
            - heading "AI training" [level=2] [ref=e256]
            - list [ref=e257]:
              - listitem [ref=e258]:
                - link "Overview" [ref=e259] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e260]:
                - link "For candidates" [ref=e261] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e262]:
                - link "For partners" [ref=e263] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e264]:
                - link "Jobs" [ref=e265] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e266]:
            - heading "The desk" [level=2] [ref=e267]
            - list [ref=e268]:
              - listitem [ref=e269]:
                - link "michael.allen@bridgewide.org" [ref=e270] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e271]:
                - link "+1 (442) 567-1328" [ref=e272] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e275] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e278]:
                  - text: Open
                  - generic [ref=e279]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e280]:
                - link "Send a CV" [ref=e281] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e282]:
        - generic [ref=e283]: © 2026 BridgeWide
        - generic [ref=e284]: San Francisco · remote desks in five regions
        - generic [ref=e285]:
          - link "Privacy" [ref=e286] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e287] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e293] [cursor=pointer]
  - alert [ref=e297]
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