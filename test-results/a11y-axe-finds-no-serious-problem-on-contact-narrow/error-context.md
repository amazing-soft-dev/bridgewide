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
      - navigation "Breadcrumb" [ref=e26]:
        - list [ref=e27]:
          - listitem [ref=e28]:
            - link "Home" [ref=e29] [cursor=pointer]:
              - /url: /
          - listitem [ref=e32]:
            - generic [ref=e33]: Contact
      - paragraph [ref=e34]: Contact
      - heading "Talk to the desk." [level=1] [ref=e35]:
        - generic [ref=e36]:
          - generic [ref=e37]: Talk
          - generic [ref=e38]: to
          - generic [ref=e39]: the
          - generic [ref=e40]: desk.
      - paragraph [ref=e43]: Hiring, looking, or a question about the market. A person answers, usually within two working hours.
    - region "Send us a message." [ref=e44]:
      - generic [ref=e45]:
        - generic [ref=e46]:
          - paragraph [ref=e48]:
            - generic [ref=e49]: Contact
          - heading "Send us a message." [level=2] [ref=e52]:
            - generic [ref=e53]:
              - generic [ref=e54]: Send
              - generic [ref=e55]: us
              - generic [ref=e56]: a
              - generic [ref=e57]: message.
          - paragraph [ref=e60]: Hiring, looking, or just a question about the market. A person answers.
          - generic [ref=e62]:
            - generic [ref=e63]:
              - text: The desk
              - emphasis [ref=e64]: Open now
            - link "+1 (442) 567-1328" [ref=e65] [cursor=pointer]:
              - /url: tel:+14425671328
            - link "michael.allen@bridgewide.org" [ref=e66] [cursor=pointer]:
              - /url: mailto:michael.allen@bridgewide.org
            - generic [ref=e67]: San Francisco · remote desks in five regions
            - generic [ref=e68]: Mon–Fri · 08:00–18:00 PT
        - form "Contact BridgeWide" [ref=e71]:
          - generic [aria-hidden] [ref=e72]:
            - text: Company website
            - textbox [ref=e73]
          - generic [ref=e78]:
            - textbox "Your name *" [ref=e79]:
              - /placeholder: " "
            - generic: Your name *
          - generic [ref=e81]:
            - textbox "Email *" [ref=e82]:
              - /placeholder: " "
            - generic: Email *
          - generic [ref=e84]:
            - combobox "Topic" [ref=e85] [cursor=pointer]:
              - option "Choose one" [selected]
              - option "Something else"
              - option "Hiring engineers"
              - option "Looking for a role"
              - option "AI training"
              - option "Press"
            - generic: Topic
          - generic [ref=e87]:
            - textbox "Message *" [ref=e88]:
              - /placeholder: " "
            - generic: Message *
          - generic [ref=e89]:
            - paragraph [ref=e90]: We only use these details to answer you.
            - button "Send message" [ref=e91] [cursor=pointer]:
              - generic [ref=e92]:
                - generic [ref=e93]: Send message
                - generic [aria-hidden] [ref=e94]: Send message
    - region "Keep a profile on file." [ref=e98]:
      - generic [ref=e99]:
        - generic [ref=e100]:
          - paragraph [ref=e101]: No open role
          - heading "Keep a profile on file." [level=2] [ref=e102]
        - generic [ref=e103]:
          - paragraph [ref=e104]: If a region you want has no open role, leave a CV and a short profile. The desk keeps them for 12 months.
          - form "Keep your profile" [ref=e105]:
            - generic [aria-hidden] [ref=e106]:
              - text: Company website
              - textbox [ref=e107]
            - generic [ref=e111]:
              - generic [ref=e112]: Name
              - textbox "Name" [ref=e113]
            - generic [ref=e114]:
              - generic [ref=e115]: Email
              - textbox "Email" [ref=e116]
            - generic [ref=e117]:
              - generic [ref=e118]: Region
              - combobox "Region" [ref=e119]:
                - option "Choose a region" [selected]
                - option "United States"
                - option "Canada"
                - option "Latin America"
                - option "Europe"
                - option "Asia"
            - generic [ref=e120]:
              - generic [ref=e121]: Country
              - textbox "Country" [ref=e122]
            - generic [ref=e123]:
              - generic [ref=e124]: Discipline
              - textbox "Discipline" [ref=e125]
            - generic [ref=e126]:
              - generic [ref=e127]: Years of experience
              - textbox "Years of experience" [ref=e128]
            - generic [ref=e129]:
              - generic [ref=e130]: Work mode
              - combobox "Work mode" [ref=e131]:
                - option "Choose" [selected]
                - option "Remote"
                - option "Hybrid"
            - generic [ref=e132]:
              - generic [ref=e133]: Profile
              - textbox "Profile" [ref=e134]
            - generic [ref=e135]:
              - generic [ref=e136]: CV
              - button "CV" [ref=e137]
              - paragraph [ref=e138]: PDF, DOC, or DOCX. 5 MB maximum.
            - generic [ref=e139]:
              - checkbox "Keep my CV and profile for 12 months so the desk can write if a matching role opens. I can ask for it to be deleted sooner." [ref=e140]
              - text: Keep my CV and profile for 12 months so the desk can write if a matching role opens. I can ask for it to be deleted sooner.
            - button "Keep my profile" [ref=e141] [cursor=pointer]:
              - generic [ref=e142]:
                - generic [ref=e143]: Keep my profile
                - generic [aria-hidden] [ref=e144]: Keep my profile
    - region "Quick answers." [ref=e148]:
      - generic [ref=e149]:
        - generic [ref=e150]:
          - paragraph [ref=e151]: Questions
          - heading "Quick answers." [level=2] [ref=e152]:
            - generic [ref=e153]:
              - generic [ref=e154]: Quick
              - generic [ref=e155]: answers.
        - generic [ref=e158]:
          - list [ref=e159]:
            - listitem [ref=e160]:
              - button "01 Which regions do you cover?" [pressed] [ref=e161]:
                - generic [ref=e162]: "01"
                - generic [ref=e163]: Which regions do you cover?
            - listitem [ref=e165]:
              - button "02 Where are you based?" [ref=e166]:
                - generic [ref=e167]: "02"
                - generic [ref=e168]: Where are you based?
            - listitem [ref=e170]:
              - button "03 When can I reach you?" [ref=e171]:
                - generic [ref=e172]: "03"
                - generic [ref=e173]: When can I reach you?
          - generic [ref=e175]:
            - region "01 Which regions do you cover?" [ref=e177]:
              - paragraph [ref=e178]: General
              - heading "Which regions do you cover?" [level=3] [ref=e179]
              - paragraph [ref=e180]: "Five: the United States, Canada, Latin America, Europe, and Asia. Each region has its own desk with a consultant who has hired in that market, and one search can draw from more than one region when you want the comparison."
            - generic [ref=e182]:
              - paragraph [ref=e183]: Still asking?
              - paragraph [ref=e184]: Call the desk or send the question. A consultant answers, not a bot.
              - paragraph [ref=e185]:
                - link "+1 (442) 567-1328" [ref=e186] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "michael.allen@bridgewide.org" [ref=e187] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
  - contentinfo [ref=e190]:
    - generic [ref=e191]:
      - generic [ref=e192]:
        - generic [ref=e193]:
          - link "BridgeWide" [ref=e194] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e198]:
            - generic [aria-hidden] [ref=e199]:
              - text: Company website
              - textbox [ref=e200]
            - paragraph [ref=e204]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e206]
            - generic [ref=e208]:
              - generic [ref=e209]:
                - textbox "Email" [ref=e210]
                - generic: Email
              - button "Send" [ref=e211] [cursor=pointer]:
                - generic [ref=e212]:
                  - generic [ref=e213]: Send
                  - generic [aria-hidden] [ref=e214]: Send
        - navigation "Footer" [ref=e218]:
          - generic [ref=e219]:
            - heading "Company" [level=2] [ref=e220]
            - list [ref=e221]:
              - listitem [ref=e222]:
                - link "About" [ref=e223] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e224]:
                - link "Regions" [ref=e225] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e226]:
                - link "Stories" [ref=e227] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e228]:
                - link "Insights" [ref=e229] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e230]:
            - heading "Staffing" [level=2] [ref=e231]
            - list [ref=e232]:
              - listitem [ref=e233]:
                - link "Hire engineers" [ref=e234] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e235]:
                - link "How hiring works" [ref=e236] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e237]:
                - link "Salary guide" [ref=e238] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e239]:
                - link "Open roles" [ref=e240] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e241]:
            - heading "AI training" [level=2] [ref=e242]
            - list [ref=e243]:
              - listitem [ref=e244]:
                - link "Overview" [ref=e245] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e246]:
                - link "For candidates" [ref=e247] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e248]:
                - link "For partners" [ref=e249] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e250]:
                - link "Jobs" [ref=e251] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e252]:
            - heading "The desk" [level=2] [ref=e253]
            - list [ref=e254]:
              - listitem [ref=e255]:
                - link "michael.allen@bridgewide.org" [ref=e256] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e257]:
                - link "+1 (442) 567-1328" [ref=e258] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e261] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e264]:
                  - text: Open
                  - generic [ref=e265]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e266]:
                - link "Send a CV" [ref=e267] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e268]:
        - generic [ref=e269]: © 2026 BridgeWide
        - generic [ref=e270]: San Francisco · remote desks in five regions
        - generic [ref=e271]:
          - link "Privacy" [ref=e272] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e273] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e279] [cursor=pointer]
  - alert [ref=e283]
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