# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> axe finds no serious problem on /employers
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
        - navigation "Breadcrumb" [ref=e26]:
          - list [ref=e27]:
            - listitem [ref=e28]:
              - link "Home" [ref=e29] [cursor=pointer]:
                - /url: /
            - listitem [ref=e32]:
              - generic [ref=e33]: Employers
        - paragraph [ref=e35]:
          - generic [ref=e36]: For employers
        - heading "A shortlist your managers will interview." [level=1] [ref=e38]:
          - generic [ref=e39]:
            - generic [ref=e40]: A
            - generic [ref=e41]: shortlist
            - generic [ref=e42]: your
            - generic [ref=e43]: managers
            - generic [ref=e44]: will
            - generic [ref=e45]: interview.
        - paragraph [ref=e48]: Tell us the stack, the hiring manager, and what the first ninety days need. We source from the USA, Canada, Latin America, Europe, and Asia, and we stay on the search until the engineer starts.
        - list [ref=e50]:
          - listitem [ref=e51]:
            - generic [ref=e52]: Shortlist in 9 days
          - listitem [ref=e54]:
            - generic [ref=e55]: 12-week guarantee
          - listitem [ref=e57]:
            - generic [ref=e58]: Billed when they start
        - generic [ref=e60]:
          - link "Open a search" [ref=e61] [cursor=pointer]:
            - /url: "#brief"
            - generic [ref=e62]:
              - generic [ref=e63]: Open a search
              - generic [aria-hidden] [ref=e64]: Open a search
          - link "See open roles" [ref=e68] [cursor=pointer]:
            - /url: /roles
            - generic [ref=e69]:
              - generic [ref=e70]: See open roles
              - generic [aria-hidden] [ref=e71]: See open roles
      - figure "Placements in the past year 186 engineers, 5 regions" [ref=e76]:
        - generic [ref=e77]:
          - img "Photograph for companies hiring engineers" [ref=e78]
          - generic [ref=e79]: Brief to shortlist · 9 days
        - generic [ref=e80]:
          - paragraph [ref=e81]: Placements in the past year
          - paragraph [ref=e82]: 186 engineers, 5 regions
    - region "How a company hires" [ref=e83]:
      - generic [ref=e84]:
        - generic [ref=e85]:
          - paragraph [ref=e86]: The search
          - heading "How a company hires" [level=2] [ref=e87]
          - generic [ref=e88]: The brief is one page. The week that follows is the same shape whether the seat is permanent or contract.
        - list [ref=e90]:
          - listitem [ref=e91]:
            - paragraph [ref=e92]: "01"
            - heading "Name the bar" [level=3] [ref=e93]
            - paragraph [ref=e94]: The hiring manager, the system the hire will own, the salary band you will actually offer, and the interview loop.
          - listitem [ref=e95]:
            - paragraph [ref=e96]: "02"
            - heading "Read the shortlist" [level=3] [ref=e97]
            - paragraph [ref=e98]: A long list arrives with notes on depth. The shortlist that follows carries salary, notice, and a plain reason each engineer fits.
          - listitem [ref=e99]:
            - paragraph [ref=e100]: "03"
            - heading "Stay through the start" [level=3] [ref=e101]
            - paragraph [ref=e102]: Offers go out with the desk still on the thread. A confidential search holds the company name until a first conversation.
    - region "Monday brief. Friday offer." [ref=e103]:
      - generic [ref=e104]:
        - generic [ref=e105]:
          - paragraph [ref=e106]: The week
          - heading "Monday brief. Friday offer." [level=2] [ref=e107]
        - list [ref=e109]:
          - listitem [ref=e110]:
            - paragraph [ref=e111]: Mon
            - heading "Brief" [level=3] [ref=e112]
            - paragraph [ref=e113]: You tell us the stack, the hiring manager, and what good looks like in the first ninety days.
          - listitem [ref=e114]:
            - paragraph [ref=e115]: Tue
            - heading "Long list" [level=3] [ref=e116]
            - paragraph [ref=e117]: We send a long list with notes on depth, so your team can see who is worth a conversation.
          - listitem [ref=e118]:
            - paragraph [ref=e119]: Wed
            - heading "Interviews" [level=3] [ref=e120]
            - paragraph [ref=e121]: We run the first conversations and hold the calendar for people your managers should meet.
          - listitem [ref=e122]:
            - paragraph [ref=e123]: Thu
            - heading "Shortlist" [level=3] [ref=e124]
            - paragraph [ref=e125]: A short list arrives with salary, notice, and a plain reason each engineer fits this brief.
          - listitem [ref=e126]:
            - paragraph [ref=e127]: Fri
            - heading "Sent" [level=3] [ref=e128]
            - paragraph [ref=e129]: Offers go out with our desk still on the thread until the engineer starts.
    - region "Fees" [ref=e130]:
      - generic [ref=e131]:
        - generic [ref=e132]:
          - paragraph [ref=e133]: The fee
          - heading "Fees" [level=2] [ref=e134]
          - generic [ref=e135]: The signed search agreement is the one that applies.
        - list [ref=e137]:
          - listitem [ref=e138]:
            - heading "Permanent" [level=3] [ref=e139]
            - paragraph [ref=e140]: 20% of first-year base salary for a permanent hire, billed when the engineer starts.
          - listitem [ref=e141]:
            - heading "Contract" [level=3] [ref=e142]
            - paragraph [ref=e143]: An 18% margin on the agreed contract rate.
          - listitem [ref=e144]:
            - heading "Guarantee" [level=3] [ref=e145]
            - paragraph [ref=e146]: A 12-week replacement guarantee. If a permanent hire leaves inside that window, we reopen the search once at no extra fee.
    - region "Tell us the seat" [ref=e147]:
      - generic [ref=e148]:
        - generic [ref=e149]:
          - paragraph [ref=e150]: Brief
          - heading "Tell us the seat" [level=2] [ref=e151]
          - generic [ref=e152]: Company, role, region, and what good looks like. We reply from the desk.
        - form "Hire engineers" [ref=e154]:
          - generic [aria-hidden] [ref=e155]:
            - text: Company website
            - textbox [ref=e156]
          - generic [ref=e160]:
            - generic [ref=e161]: Name
            - textbox "Name" [ref=e162]
          - generic [ref=e163]:
            - generic [ref=e164]: Email
            - textbox "Email" [ref=e165]
          - generic [ref=e166]:
            - generic [ref=e167]: Company
            - textbox "Company" [ref=e168]
          - generic [ref=e169]:
            - generic [ref=e170]: Role title
            - textbox "Role title" [ref=e171]
          - group "Regions" [ref=e172]:
            - generic [ref=e174]:
              - checkbox "United States" [ref=e175]
              - text: United States
            - generic [ref=e176]:
              - checkbox "Canada" [ref=e177]
              - text: Canada
            - generic [ref=e178]:
              - checkbox "Latin America" [ref=e179]
              - text: Latin America
            - generic [ref=e180]:
              - checkbox "Europe" [ref=e181]
              - text: Europe
            - generic [ref=e182]:
              - checkbox "Asia" [ref=e183]
              - text: Asia
          - generic [ref=e184]:
            - generic [ref=e185]: Engagement
            - combobox "Engagement" [ref=e186]:
              - option "Choose engagement" [selected]
              - option "Permanent"
              - option "Contract"
          - generic [ref=e187]:
            - generic [ref=e188]: Hiring manager
            - textbox "Hiring manager" [ref=e189]
          - generic [ref=e190]:
            - generic [ref=e191]: Stack
            - textbox "Stack" [ref=e192]
          - generic [ref=e193]:
            - generic [ref=e194]: Band or day rate
            - textbox "Band or day rate" [ref=e195]
          - generic [ref=e196]:
            - generic [ref=e197]: First ninety days
            - textbox "First ninety days" [ref=e198]
          - generic [ref=e199]:
            - generic [ref=e200]: Contract duration
            - textbox "Contract duration" [ref=e201]
          - generic [ref=e202]:
            - checkbox "Confidential search. Keep the company name off the public brief." [ref=e203]
            - text: Confidential search. Keep the company name off the public brief.
          - generic [ref=e204]:
            - 'checkbox "I acknowledge the published fee: 20% of first-year base and a 12-week replacement for a permanent hire, or an 18% margin and no replacement clock for a contract." [ref=e205]'
            - text: "I acknowledge the published fee: 20% of first-year base and a 12-week replacement for a permanent hire, or an 18% margin and no replacement clock for a contract."
          - generic [ref=e206]:
            - generic [ref=e207]: Message
            - textbox "Message" [ref=e208]
          - button "Send hiring brief" [ref=e209] [cursor=pointer]:
            - generic [ref=e210]:
              - generic [ref=e211]: Send hiring brief
              - generic [aria-hidden] [ref=e212]: Send hiring brief
  - contentinfo [ref=e218]:
    - generic [ref=e219]:
      - generic [ref=e220]:
        - generic [ref=e221]:
          - link "BridgeWide" [ref=e222] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e226]:
            - generic [aria-hidden] [ref=e227]:
              - text: Company website
              - textbox [ref=e228]
            - paragraph [ref=e232]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e234]
            - generic [ref=e236]:
              - generic [ref=e237]:
                - textbox "Email" [ref=e238]
                - generic: Email
              - button "Send" [ref=e239] [cursor=pointer]:
                - generic [ref=e240]:
                  - generic [ref=e241]: Send
                  - generic [aria-hidden] [ref=e242]: Send
        - navigation "Footer" [ref=e246]:
          - generic [ref=e247]:
            - heading "Company" [level=2] [ref=e248]
            - list [ref=e249]:
              - listitem [ref=e250]:
                - link "About" [ref=e251] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e252]:
                - link "Regions" [ref=e253] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e254]:
                - link "Stories" [ref=e255] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e256]:
                - link "Insights" [ref=e257] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e258]:
            - heading "Staffing" [level=2] [ref=e259]
            - list [ref=e260]:
              - listitem [ref=e261]:
                - link "Hire engineers" [ref=e262] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e263]:
                - link "How hiring works" [ref=e264] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e265]:
                - link "Salary guide" [ref=e266] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e267]:
                - link "Open roles" [ref=e268] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e269]:
            - heading "AI training" [level=2] [ref=e270]
            - list [ref=e271]:
              - listitem [ref=e272]:
                - link "Overview" [ref=e273] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e274]:
                - link "For candidates" [ref=e275] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e276]:
                - link "For partners" [ref=e277] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e278]:
                - link "Jobs" [ref=e279] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e280]:
            - heading "The desk" [level=2] [ref=e281]
            - list [ref=e282]:
              - listitem [ref=e283]:
                - link "michael.allen@bridgewide.org" [ref=e284] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e285]:
                - link "+1 (442) 567-1328" [ref=e286] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e289] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e292]:
                  - text: Open
                  - generic [ref=e293]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e294]:
                - link "Send a CV" [ref=e295] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e296]:
        - generic [ref=e297]: © 2026 BridgeWide
        - generic [ref=e298]: San Francisco · remote desks in five regions
        - generic [ref=e299]:
          - link "Privacy" [ref=e300] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e301] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e307] [cursor=pointer]
  - alert [ref=e311]
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