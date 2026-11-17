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
        - navigation "Breadcrumb" [ref=e40]:
          - list [ref=e41]:
            - listitem [ref=e42]:
              - link "Home" [ref=e43] [cursor=pointer]:
                - /url: /
            - listitem [ref=e46]:
              - generic [ref=e47]: Employers
        - paragraph [ref=e49]:
          - generic [ref=e50]: For employers
        - heading "A shortlist your managers will interview." [level=1] [ref=e52]:
          - generic [ref=e53]:
            - generic [ref=e54]: A
            - generic [ref=e55]: shortlist
            - generic [ref=e56]: your
            - generic [ref=e57]: managers
            - generic [ref=e58]: will
            - generic [ref=e59]: interview.
        - paragraph [ref=e62]: Tell us the stack, the hiring manager, and what the first ninety days need. We source from the USA, Canada, Latin America, Europe, and Asia, and we stay on the search until the engineer starts.
        - list [ref=e64]:
          - listitem [ref=e65]:
            - generic [ref=e66]: Shortlist in 9 days
          - listitem [ref=e68]:
            - generic [ref=e69]: 12-week guarantee
          - listitem [ref=e71]:
            - generic [ref=e72]: Billed when they start
        - generic [ref=e74]:
          - link "Open a search" [ref=e75] [cursor=pointer]:
            - /url: "#brief"
            - generic [ref=e76]:
              - generic [ref=e77]: Open a search
              - generic [aria-hidden] [ref=e78]: Open a search
          - link "See open roles" [ref=e82] [cursor=pointer]:
            - /url: /roles
            - generic [ref=e83]:
              - generic [ref=e84]: See open roles
              - generic [aria-hidden] [ref=e85]: See open roles
      - figure "Placements in the past year 186 engineers, 5 regions" [ref=e90]:
        - generic [ref=e91]:
          - img "Photograph for companies hiring engineers" [ref=e92]
          - generic [ref=e93]: Brief to shortlist · 9 days
        - generic [ref=e94]:
          - paragraph [ref=e95]: Placements in the past year
          - paragraph [ref=e96]: 186 engineers, 5 regions
    - region "How a company hires" [ref=e97]:
      - generic [ref=e98]:
        - generic [ref=e99]:
          - paragraph [ref=e100]: The search
          - heading "How a company hires" [level=2] [ref=e101]
          - generic [ref=e102]: The brief is one page. The week that follows is the same shape whether the seat is permanent or contract.
        - list [ref=e104]:
          - listitem [ref=e105]:
            - paragraph [ref=e106]: "01"
            - heading "Name the bar" [level=3] [ref=e107]
            - paragraph [ref=e108]: The hiring manager, the system the hire will own, the salary band you will actually offer, and the interview loop.
          - listitem [ref=e109]:
            - paragraph [ref=e110]: "02"
            - heading "Read the shortlist" [level=3] [ref=e111]
            - paragraph [ref=e112]: A long list arrives with notes on depth. The shortlist that follows carries salary, notice, and a plain reason each engineer fits.
          - listitem [ref=e113]:
            - paragraph [ref=e114]: "03"
            - heading "Stay through the start" [level=3] [ref=e115]
            - paragraph [ref=e116]: Offers go out with the desk still on the thread. A confidential search holds the company name until a first conversation.
    - region "Monday brief. Friday offer." [ref=e117]:
      - generic [ref=e118]:
        - generic [ref=e119]:
          - paragraph [ref=e120]: The week
          - heading "Monday brief. Friday offer." [level=2] [ref=e121]
        - list [ref=e123]:
          - listitem [ref=e124]:
            - paragraph [ref=e125]: Mon
            - heading "Brief" [level=3] [ref=e126]
            - paragraph [ref=e127]: You tell us the stack, the hiring manager, and what good looks like in the first ninety days.
          - listitem [ref=e128]:
            - paragraph [ref=e129]: Tue
            - heading "Long list" [level=3] [ref=e130]
            - paragraph [ref=e131]: We send a long list with notes on depth, so your team can see who is worth a conversation.
          - listitem [ref=e132]:
            - paragraph [ref=e133]: Wed
            - heading "Interviews" [level=3] [ref=e134]
            - paragraph [ref=e135]: We run the first conversations and hold the calendar for people your managers should meet.
          - listitem [ref=e136]:
            - paragraph [ref=e137]: Thu
            - heading "Shortlist" [level=3] [ref=e138]
            - paragraph [ref=e139]: A short list arrives with salary, notice, and a plain reason each engineer fits this brief.
          - listitem [ref=e140]:
            - paragraph [ref=e141]: Fri
            - heading "Sent" [level=3] [ref=e142]
            - paragraph [ref=e143]: Offers go out with our desk still on the thread until the engineer starts.
    - region "Fees" [ref=e144]:
      - generic [ref=e145]:
        - generic [ref=e146]:
          - paragraph [ref=e147]: The fee
          - heading "Fees" [level=2] [ref=e148]
          - generic [ref=e149]: The signed search agreement is the one that applies.
        - list [ref=e151]:
          - listitem [ref=e152]:
            - heading "Permanent" [level=3] [ref=e153]
            - paragraph [ref=e154]: 20% of first-year base salary for a permanent hire, billed when the engineer starts.
          - listitem [ref=e155]:
            - heading "Contract" [level=3] [ref=e156]
            - paragraph [ref=e157]: An 18% margin on the agreed contract rate.
          - listitem [ref=e158]:
            - heading "Guarantee" [level=3] [ref=e159]
            - paragraph [ref=e160]: A 12-week replacement guarantee. If a permanent hire leaves inside that window, we reopen the search once at no extra fee.
    - region "Tell us the seat" [ref=e161]:
      - generic [ref=e162]:
        - generic [ref=e163]:
          - paragraph [ref=e164]: Brief
          - heading "Tell us the seat" [level=2] [ref=e165]
          - generic [ref=e166]: Company, role, region, and what good looks like. We reply from the desk.
        - form "Hire engineers" [ref=e168]:
          - generic [aria-hidden] [ref=e169]:
            - text: Company website
            - textbox [ref=e170]
          - generic [ref=e174]:
            - generic [ref=e175]: Name
            - textbox "Name" [ref=e176]
          - generic [ref=e177]:
            - generic [ref=e178]: Email
            - textbox "Email" [ref=e179]
          - generic [ref=e180]:
            - generic [ref=e181]: Company
            - textbox "Company" [ref=e182]
          - generic [ref=e183]:
            - generic [ref=e184]: Role title
            - textbox "Role title" [ref=e185]
          - group "Regions" [ref=e186]:
            - generic [ref=e188]:
              - checkbox "United States" [ref=e189]
              - text: United States
            - generic [ref=e190]:
              - checkbox "Canada" [ref=e191]
              - text: Canada
            - generic [ref=e192]:
              - checkbox "Latin America" [ref=e193]
              - text: Latin America
            - generic [ref=e194]:
              - checkbox "Europe" [ref=e195]
              - text: Europe
            - generic [ref=e196]:
              - checkbox "Asia" [ref=e197]
              - text: Asia
          - generic [ref=e198]:
            - generic [ref=e199]: Engagement
            - combobox "Engagement" [ref=e200]:
              - option "Choose engagement" [selected]
              - option "Permanent"
              - option "Contract"
          - generic [ref=e201]:
            - generic [ref=e202]: Hiring manager
            - textbox "Hiring manager" [ref=e203]
          - generic [ref=e204]:
            - generic [ref=e205]: Stack
            - textbox "Stack" [ref=e206]
          - generic [ref=e207]:
            - generic [ref=e208]: Band or day rate
            - textbox "Band or day rate" [ref=e209]
          - generic [ref=e210]:
            - generic [ref=e211]: First ninety days
            - textbox "First ninety days" [ref=e212]
          - generic [ref=e213]:
            - generic [ref=e214]: Contract duration
            - textbox "Contract duration" [ref=e215]
          - generic [ref=e216]:
            - checkbox "Confidential search. Keep the company name off the public brief." [ref=e217]
            - text: Confidential search. Keep the company name off the public brief.
          - generic [ref=e218]:
            - 'checkbox "I acknowledge the published fee: 20% of first-year base and a 12-week replacement for a permanent hire, or an 18% margin and no replacement clock for a contract." [ref=e219]'
            - text: "I acknowledge the published fee: 20% of first-year base and a 12-week replacement for a permanent hire, or an 18% margin and no replacement clock for a contract."
          - generic [ref=e220]:
            - generic [ref=e221]: Message
            - textbox "Message" [ref=e222]
          - button "Send hiring brief" [ref=e223] [cursor=pointer]:
            - generic [ref=e224]:
              - generic [ref=e225]: Send hiring brief
              - generic [aria-hidden] [ref=e226]: Send hiring brief
  - contentinfo [ref=e232]:
    - generic [ref=e233]:
      - generic [ref=e234]:
        - generic [ref=e235]:
          - link "BridgeWide" [ref=e236] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e240]:
            - generic [aria-hidden] [ref=e241]:
              - text: Company website
              - textbox [ref=e242]
            - paragraph [ref=e246]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e248]
            - generic [ref=e250]:
              - generic [ref=e251]:
                - textbox "Email" [ref=e252]
                - generic: Email
              - button "Send" [ref=e253] [cursor=pointer]:
                - generic [ref=e254]:
                  - generic [ref=e255]: Send
                  - generic [aria-hidden] [ref=e256]: Send
        - navigation "Footer" [ref=e260]:
          - generic [ref=e261]:
            - heading "Company" [level=2] [ref=e262]
            - list [ref=e263]:
              - listitem [ref=e264]:
                - link "About" [ref=e265] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e266]:
                - link "Regions" [ref=e267] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e268]:
                - link "Stories" [ref=e269] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e270]:
                - link "Insights" [ref=e271] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e272]:
            - heading "Staffing" [level=2] [ref=e273]
            - list [ref=e274]:
              - listitem [ref=e275]:
                - link "Hire engineers" [ref=e276] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e277]:
                - link "How hiring works" [ref=e278] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e279]:
                - link "Salary guide" [ref=e280] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e281]:
                - link "Open roles" [ref=e282] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e283]:
            - heading "AI training" [level=2] [ref=e284]
            - list [ref=e285]:
              - listitem [ref=e286]:
                - link "Overview" [ref=e287] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e288]:
                - link "For candidates" [ref=e289] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e290]:
                - link "For partners" [ref=e291] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e292]:
                - link "Jobs" [ref=e293] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e294]:
            - heading "The desk" [level=2] [ref=e295]
            - list [ref=e296]:
              - listitem [ref=e297]:
                - link "michael.allen@bridgewide.org" [ref=e298] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e299]:
                - link "+1 (442) 567-1328" [ref=e300] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e303] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e306]:
                  - text: Open
                  - generic [ref=e307]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e308]:
                - link "Send a CV" [ref=e309] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e310]:
        - generic [ref=e311]: © 2026 BridgeWide
        - generic [ref=e312]: San Francisco · remote desks in five regions
        - generic [ref=e313]:
          - link "Privacy" [ref=e314] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e315] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e321] [cursor=pointer]
  - alert [ref=e325]
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